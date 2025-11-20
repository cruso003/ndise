# NDISE Database Schema
## Complete Database Design for Demo Implementation

**Version:** 2.0  
**Database:** PostgreSQL 15+ (primary) + MongoDB (biometric images)  
**Purpose:** Production-ready schema for NDISE system

---

## Database Architecture

```
┌─────────────────────────────────────────────────────────┐
│              ndise_core (PostgreSQL)                     │
│  ├─ citizens                                            │
│  ├─ addresses                                           │
│  ├─ biometric_templates                                 │
│  ├─ documents                                           │
│  ├─ relationships                                       │
│  └─ audit_log                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              ndise_fir (PostgreSQL)                      │
│  ├─ foreigners                                          │
│  ├─ visas_permits                                       │
│  ├─ border_crossings                                    │
│  ├─ overstay_alerts                                     │
│  └─ deportation_orders                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           ndise_integrations (PostgreSQL)                │
│  ├─ sim_registrations                                   │
│  ├─ bank_accounts                                       │
│  ├─ vehicles                                            │
│  ├─ drivers_licenses                                    │
│  ├─ criminal_records                                    │
│  ├─ wanted_persons                                      │
│  ├─ business_registry                                   │
│  └─ education_credentials                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            ndise_biometric (MongoDB)                     │
│  ├─ fingerprint_images (GridFS)                        │
│  ├─ face_photos (GridFS)                               │
│  └─ iris_scans (GridFS)                                │
└─────────────────────────────────────────────────────────┘
```

---

## CORE IDENTITY TABLES

### 1. citizens

**Purpose:** Master record for all Liberian citizens

```sql
CREATE TABLE citizens (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- National ID
    national_id_number VARCHAR(16) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    maiden_name VARCHAR(100), -- for married women
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(200),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    
    -- Parents (for relationship verification)
    mother_first_name VARCHAR(100),
    mother_last_name VARCHAR(100),
    mother_national_id VARCHAR(16), -- link if she's in system
    father_first_name VARCHAR(100),
    father_last_name VARCHAR(100),
    father_national_id VARCHAR(16),
    
    -- Contact
    phone_number VARCHAR(20),
    email VARCHAR(100),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'suspended', 'deceased', 'revoked')),
    status_reason TEXT,
    
    -- Card Details
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    card_number VARCHAR(20) UNIQUE, -- physical card number
    
    -- Security
    photo_hash VARCHAR(64), -- SHA-256 of photo for integrity
    biometric_quality_score INTEGER, -- 0-100
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100), -- officer ID who enrolled
    enrollment_location VARCHAR(200),
    
    -- Constraints
    CONSTRAINT chk_dob CHECK (date_of_birth < CURRENT_DATE),
    CONSTRAINT chk_expiry CHECK (expiry_date > issue_date),
    CONSTRAINT chk_quality CHECK (biometric_quality_score BETWEEN 0 AND 100)
);

-- Indexes for fast lookup
CREATE INDEX idx_citizens_national_id ON citizens(national_id_number);
CREATE INDEX idx_citizens_name ON citizens(last_name, first_name);
CREATE INDEX idx_citizens_dob ON citizens(date_of_birth);
CREATE INDEX idx_citizens_phone ON citizens(phone_number);
CREATE INDEX idx_citizens_status ON citizens(status);
CREATE INDEX idx_citizens_mother ON citizens(mother_national_id);
CREATE INDEX idx_citizens_father ON citizens(father_national_id);

-- Full-text search on names
CREATE INDEX idx_citizens_fulltext ON citizens 
    USING gin(to_tsvector('english', 
        first_name || ' ' || COALESCE(middle_name, '') || ' ' || last_name));
```

### 2. addresses

**Purpose:** Track current and historical addresses

```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    
    -- Address Type
    address_type VARCHAR(20) NOT NULL 
        CHECK (address_type IN ('current', 'permanent', 'work', 'mailing')),
    
    -- Address Details
    street_address TEXT,
    community VARCHAR(100), -- village or neighborhood
    city VARCHAR(100),
    county VARCHAR(50) NOT NULL, -- Liberia's 15 counties
    postal_code VARCHAR(20),
    
    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Validity
    is_current BOOLEAN NOT NULL DEFAULT true,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    verification_method VARCHAR(50), -- 'utility_bill', 'landlord_letter', 'field_visit'
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_address_citizen ON addresses(citizen_id);
CREATE INDEX idx_address_current ON addresses(citizen_id, is_current) WHERE is_current = true;
CREATE INDEX idx_address_county ON addresses(county);
CREATE INDEX idx_address_geo ON addresses(latitude, longitude);
```

### 3. biometric_templates

**Purpose:** Store processed biometric templates (NOT raw images)

```sql
CREATE TABLE biometric_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    
    -- Fingerprint Templates (processed, not raw images)
    fp_right_thumb BYTEA,
    fp_right_index BYTEA,
    fp_right_middle BYTEA,
    fp_right_ring BYTEA,
    fp_right_little BYTEA,
    fp_left_thumb BYTEA,
    fp_left_index BYTEA,
    fp_left_middle BYTEA,
    fp_left_ring BYTEA,
    fp_left_little BYTEA,
    
    -- Face Template (FaceNet embedding)
    face_embedding BYTEA, -- 128-dimensional vector
    
    -- Iris Template (optional)
    iris_template BYTEA,
    
    -- Quality Scores (NFIQ for fingerprints, 1-5 where 1=best)
    fp_quality_scores JSONB, -- {"right_thumb": 1, "left_index": 2, ...}
    face_quality_score INTEGER, -- 0-100
    
    -- Reference to MongoDB images
    fp_image_ids JSONB, -- {"right_thumb": "mongo_id_1", ...}
    face_photo_id VARCHAR(100), -- MongoDB GridFS ID
    iris_image_id VARCHAR(100),
    
    -- Capture Info
    captured_at TIMESTAMP NOT NULL DEFAULT NOW(),
    captured_by VARCHAR(100),
    capture_device VARCHAR(100), -- device serial number
    capture_location VARCHAR(200),
    
    -- Liveness Detection
    liveness_check_passed BOOLEAN DEFAULT true,
    liveness_score DECIMAL(5, 2), -- 0.00-100.00
    
    UNIQUE(citizen_id)
);

CREATE INDEX idx_biometric_citizen ON biometric_templates(citizen_id);
```

### 4. documents

**Purpose:** Link supporting documents to citizen records

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    
    -- Document Type
    document_type VARCHAR(50) NOT NULL 
        CHECK (document_type IN (
            'birth_certificate', 'passport', 'driver_license', 
            'voter_id', 'marriage_certificate', 'death_certificate',
            'school_certificate', 'deed', 'other'
        )),
    
    -- Document Details
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(100),
    issuing_country VARCHAR(50) DEFAULT 'Liberia',
    
    -- File Storage (S3 or local path)
    file_url TEXT,
    file_hash VARCHAR(64), -- SHA-256 for integrity verification
    file_size INTEGER, -- bytes
    file_type VARCHAR(50), -- 'image/jpeg', 'application/pdf'
    
    -- OCR/Extraction
    extracted_text TEXT, -- OCR result for searchability
    extracted_data JSONB, -- structured data extracted from document
    
    -- Verification
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doc_citizen ON documents(citizen_id);
CREATE INDEX idx_doc_type ON documents(document_type);
CREATE INDEX idx_doc_number ON documents(document_number);
CREATE INDEX idx_doc_verified ON documents(verified);
```

### 5. relationships

**Purpose:** Family and guardian relationships

```sql
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The two people in the relationship
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    related_citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    
    -- Relationship Type
    relationship_type VARCHAR(50) NOT NULL 
        CHECK (relationship_type IN (
            'parent', 'child', 'spouse', 'sibling', 
            'guardian', 'dependent', 'grandparent', 'grandchild',
            'other'
        )),
    
    -- Details
    relationship_details TEXT, -- e.g., "adopted child", "step-sibling"
    
    -- Verification
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    verification_method VARCHAR(50), -- 'birth_certificate', 'court_order', 'field_verification'
    
    -- Validity
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE, -- for guardianship that expires
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_no_self_relation CHECK (citizen_id != related_citizen_id),
    UNIQUE(citizen_id, related_citizen_id, relationship_type)
);

CREATE INDEX idx_rel_citizen ON relationships(citizen_id);
CREATE INDEX idx_rel_related ON relationships(related_citizen_id);
CREATE INDEX idx_rel_type ON relationships(relationship_type);
```

### 6. audit_log

**Purpose:** Track ALL access to citizen data (privacy requirement)

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    
    -- What was accessed
    citizen_id UUID REFERENCES citizens(id),
    foreigner_id UUID, -- if accessing foreigner data
    
    -- Who accessed
    actor_id VARCHAR(100) NOT NULL, -- user ID or system ID
    actor_role VARCHAR(50), -- 'immigration_officer', 'police', 'admin'
    actor_agency VARCHAR(100), -- 'Immigration', 'Police', 'NIR'
    
    -- What action
    action VARCHAR(50) NOT NULL, -- 'view', 'create', 'update', 'delete', 'search'
    resource_type VARCHAR(50), -- 'citizen', 'biometric', 'document', 'address'
    resource_id UUID, -- specific record accessed
    
    -- Why accessed
    purpose TEXT, -- required justification
    case_number VARCHAR(100), -- if related to investigation/case
    
    -- How accessed
    access_method VARCHAR(50), -- 'web_portal', 'mobile_app', 'api', 'manual'
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- What data was accessed/changed
    fields_accessed TEXT[], -- array of field names
    old_values JSONB, -- for updates
    new_values JSONB, -- for updates
    
    -- Consent
    consent_provided BOOLEAN DEFAULT false,
    consent_token VARCHAR(100), -- citizen provided explicit consent
    
    -- Result
    success BOOLEAN NOT NULL,
    error_message TEXT, -- if action failed
    
    -- Timestamp
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Blockchain reference (immutable audit trail)
    blockchain_tx_id VARCHAR(100) -- reference to Hyperledger transaction
);

-- Indexes for audit queries
CREATE INDEX idx_audit_citizen ON audit_log(citizen_id);
CREATE INDEX idx_audit_foreigner ON audit_log(foreigner_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_agency ON audit_log(actor_agency);

-- Partition by month for performance
CREATE INDEX idx_audit_timestamp_month ON audit_log(DATE_TRUNC('month', timestamp));
```

---

## FOREIGN IDENTITY REGISTRY (FIR) TABLES

### 7. foreigners

**Purpose:** Track all non-citizens in Liberia

```sql
CREATE TABLE foreigners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign ID Number (issued by Liberia)
    foreign_id_number VARCHAR(16) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(200),
    gender VARCHAR(10) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    
    -- Passport Information
    passport_number VARCHAR(50) NOT NULL,
    passport_country VARCHAR(50) NOT NULL,
    passport_issue_date DATE,
    passport_expiry_date DATE,
    
    -- Contact
    phone_number VARCHAR(20),
    email VARCHAR(100),
    local_address TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'overstay', 'departed', 'deported', 'deceased')),
    status_reason TEXT,
    
    -- Biometric Reference
    has_biometric BOOLEAN DEFAULT false,
    biometric_quality_score INTEGER,
    photo_hash VARCHAR(64),
    
    -- Metadata
    first_entry_date DATE, -- first time they entered Liberia
    total_entries INTEGER DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100)
);

CREATE INDEX idx_foreigner_fid ON foreigners(foreign_id_number);
CREATE INDEX idx_foreigner_passport ON foreigners(passport_number, passport_country);
CREATE INDEX idx_foreigner_name ON foreigners(last_name, first_name);
CREATE INDEX idx_foreigner_nationality ON foreigners(nationality);
CREATE INDEX idx_foreigner_status ON foreigners(status);
CREATE INDEX idx_foreigner_phone ON foreigners(phone_number);
```

### 8. visas_permits

**Purpose:** Track all visas and permits for foreigners

```sql
CREATE TABLE visas_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foreigner_id UUID NOT NULL REFERENCES foreigners(id) ON DELETE CASCADE,
    
    -- Permit Type
    permit_type VARCHAR(50) NOT NULL
        CHECK (permit_type IN (
            'tourist_visa', 'business_visa', 'work_permit', 
            'residence_permit', 'student_visa', 'diplomatic',
            'ecowas_free_movement', 'refugee_status', 'asylum_seeker'
        )),
    
    -- Permit Details
    permit_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    issuing_authority VARCHAR(100) DEFAULT 'Liberia Immigration Service',
    
    -- Work Permit Specifics
    employer_name VARCHAR(200),
    employer_tax_id VARCHAR(50),
    job_title VARCHAR(100),
    work_location VARCHAR(200),
    
    -- Student Visa Specifics
    institution_name VARCHAR(200),
    course_of_study VARCHAR(200),
    expected_graduation DATE,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'valid'
        CHECK (status IN ('valid', 'expired', 'revoked', 'suspended', 'renewed')),
    status_reason TEXT,
    
    -- Renewal History
    previous_permit_id UUID REFERENCES visas_permits(id),
    renewal_count INTEGER DEFAULT 0,
    
    -- Alerts
    alert_sent_80_days BOOLEAN DEFAULT false,
    alert_sent_expiry BOOLEAN DEFAULT false,
    suspension_date DATE, -- when it was suspended
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_permit_dates CHECK (expiry_date > issue_date)
);

CREATE INDEX idx_permit_foreigner ON visas_permits(foreigner_id);
CREATE INDEX idx_permit_number ON visas_permits(permit_number);
CREATE INDEX idx_permit_type ON visas_permits(permit_type);
CREATE INDEX idx_permit_expiry ON visas_permits(expiry_date);
CREATE INDEX idx_permit_status ON visas_permits(status);
CREATE INDEX idx_permit_employer ON visas_permits(employer_tax_id);
```

### 9. border_crossings

**Purpose:** Entry/exit log at all border points

```sql
CREATE TABLE border_crossings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('citizen', 'foreigner')),
    citizen_id UUID REFERENCES citizens(id),
    foreigner_id UUID REFERENCES foreigners(id),
    
    -- Movement Type
    movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('entry', 'exit')),
    
    -- When & Where
    crossing_datetime TIMESTAMP NOT NULL DEFAULT NOW(),
    border_point VARCHAR(100) NOT NULL, -- 'Roberts Int Airport', 'Bo-Waterside', etc.
    
    -- Travel Details
    coming_from VARCHAR(100), -- country
    going_to VARCHAR(100), -- country
    transport_mode VARCHAR(50), -- 'air', 'land', 'sea'
    flight_number VARCHAR(20),
    vehicle_registration VARCHAR(50),
    
    -- Purpose (for entries)
    visit_purpose VARCHAR(50), -- 'tourism', 'business', 'family', 'work', 'study'
    intended_stay_days INTEGER,
    local_address_staying TEXT,
    local_contact_name VARCHAR(200),
    local_contact_phone VARCHAR(20),
    
    -- Visa/Permit Used
    visa_permit_id UUID REFERENCES visas_permits(id),
    
    -- Officer
    immigration_officer_id VARCHAR(100) NOT NULL,
    officer_notes TEXT,
    
    -- Biometric Verification
    biometric_verified BOOLEAN DEFAULT false,
    biometric_match_score DECIMAL(5, 2), -- 0.00-100.00
    
    -- Alerts Triggered
    alerts JSONB, -- [{type: 'wanted_person', details: '...'}, ...]
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crossing_citizen ON border_crossings(citizen_id);
CREATE INDEX idx_crossing_foreigner ON border_crossings(foreigner_id);
CREATE INDEX idx_crossing_datetime ON border_crossings(crossing_datetime DESC);
CREATE INDEX idx_crossing_border ON border_crossings(border_point);
CREATE INDEX idx_crossing_type ON border_crossings(movement_type);
```

### 10. overstay_alerts

**Purpose:** Track visa overstays and enforcement actions

```sql
CREATE TABLE overstay_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foreigner_id UUID NOT NULL REFERENCES foreigners(id),
    visa_permit_id UUID NOT NULL REFERENCES visas_permits(id),
    
    -- Overstay Details
    visa_expiry_date DATE NOT NULL,
    days_overstayed INTEGER NOT NULL,
    detected_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Alert Level
    severity VARCHAR(20) NOT NULL
        CHECK (severity IN ('warning', 'moderate', 'severe', 'critical')),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'resolved', 'deported', 'extended', 'ignored')),
    
    -- Actions Taken
    actions_taken JSONB, -- [{action: 'sms_sent', date: '...', by: '...'}, ...]
    
    -- Resolution
    resolved_date DATE,
    resolution_method VARCHAR(50), -- 'visa_renewed', 'departed', 'deported', 'fine_paid'
    fine_amount DECIMAL(10, 2),
    fine_paid BOOLEAN DEFAULT false,
    
    -- Notifications
    sms_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    police_notified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_overstay_foreigner ON overstay_alerts(foreigner_id);
CREATE INDEX idx_overstay_status ON overstay_alerts(status);
CREATE INDEX idx_overstay_severity ON overstay_alerts(severity);
CREATE INDEX idx_overstay_detected ON overstay_alerts(detected_date);
```

---

## INTEGRATION TABLES

### 11. sim_registrations

**Purpose:** Link SIM cards to identities

```sql
CREATE TABLE sim_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner Identity
    owner_type VARCHAR(20) NOT NULL CHECK (owner_type IN ('citizen', 'foreigner', 'corporate')),
    citizen_id UUID REFERENCES citizens(id),
    foreigner_id UUID REFERENCES foreigners(id),
    corporate_id UUID, -- if company owns SIM
    
    -- SIM Details
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    imsi VARCHAR(15) UNIQUE NOT NULL, -- International Mobile Subscriber Identity
    iccid VARCHAR(20) UNIQUE, -- SIM card serial number
    
    -- Operator
    operator VARCHAR(50) NOT NULL CHECK (operator IN ('LoneStar_MTN', 'Orange_Liberia')),
    
    -- Registration
    registration_date TIMESTAMP NOT NULL DEFAULT NOW(),
    registration_method VARCHAR(20), -- 'agent', 'self_service', 'ussd', 'online'
    registration_location VARCHAR(200),
    registration_agent_id VARCHAR(100),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'blocked', 'expired', 'ported', 'deactivated')),
    status_reason TEXT,
    suspension_date TIMESTAMP,
    
    -- For Foreigners: Link to visa
    linked_visa_permit_id UUID REFERENCES visas_permits(id),
    auto_suspend_date DATE, -- calculated from visa expiry
    
    -- Verification
    kyc_verified BOOLEAN NOT NULL DEFAULT false,
    kyc_level VARCHAR(20), -- 'basic', 'standard', 'full'
    biometric_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- Portability
    ported BOOLEAN DEFAULT false,
    ported_from VARCHAR(50),
    ported_date TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sim_phone ON sim_registrations(phone_number);
CREATE INDEX idx_sim_citizen ON sim_registrations(citizen_id);
CREATE INDEX idx_sim_foreigner ON sim_registrations(foreigner_id);
CREATE INDEX idx_sim_operator ON sim_registrations(operator);
CREATE INDEX idx_sim_status ON sim_registrations(status);
CREATE INDEX idx_sim_auto_suspend ON sim_registrations(auto_suspend_date);
```

### 12. criminal_records

**Purpose:** Criminal history tracking

```sql
CREATE TABLE criminal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Person
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('citizen', 'foreigner')),
    citizen_id UUID REFERENCES citizens(id),
    foreigner_id UUID REFERENCES foreigners(id),
    
    -- Case Details
    case_number VARCHAR(100) UNIQUE NOT NULL,
    case_type VARCHAR(50), -- 'arrest', 'charge', 'conviction', 'acquittal'
    
    -- Offense
    offense_category VARCHAR(50), -- 'violent', 'property', 'drug', 'fraud', 'traffic'
    offense_description TEXT NOT NULL,
    offense_date DATE,
    offense_location VARCHAR(200),
    
    -- Court Details
    court_name VARCHAR(200),
    judge_name VARCHAR(200),
    hearing_date DATE,
    verdict VARCHAR(50), -- 'guilty', 'not_guilty', 'pending'
    
    -- Sentence
    sentence_type VARCHAR(50), -- 'prison', 'fine', 'probation', 'community_service', 'acquitted'
    sentence_duration VARCHAR(50), -- '5 years', '6 months'
    sentence_start_date DATE,
    sentence_end_date DATE,
    fine_amount DECIMAL(10, 2),
    fine_paid BOOLEAN,
    
    -- Prison Details
    prison_name VARCHAR(200),
    inmate_number VARCHAR(50),
    released BOOLEAN DEFAULT false,
    release_date DATE,
    release_type VARCHAR(50), -- 'completed', 'parole', 'early_release', 'pardon'
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'closed', 'expunged', 'under_appeal')),
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100)
);

CREATE INDEX idx_crime_citizen ON criminal_records(citizen_id);
CREATE INDEX idx_crime_foreigner ON criminal_records(foreigner_id);
CREATE INDEX idx_crime_case ON criminal_records(case_number);
CREATE INDEX idx_crime_type ON criminal_records(offense_category);
CREATE INDEX idx_crime_status ON criminal_records(status);
```

### 13. wanted_persons

**Purpose:** Active warrants and wanted list

```sql
CREATE TABLE wanted_persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Person
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('citizen', 'foreigner', 'unknown')),
    citizen_id UUID REFERENCES citizens(id),
    foreigner_id UUID REFERENCES foreigners(id),
    
    -- If Unknown Person
    suspected_name VARCHAR(200),
    suspected_aliases TEXT[], -- array of known aliases
    
    -- Warrant Details
    warrant_number VARCHAR(100) UNIQUE NOT NULL,
    warrant_issue_date DATE NOT NULL,
    warrant_type VARCHAR(50), -- 'arrest', 'detention', 'questioning'
    issuing_court VARCHAR(200),
    issuing_judge VARCHAR(200),
    
    -- Offense
    offense_description TEXT NOT NULL,
    offense_severity VARCHAR(20), -- 'misdemeanor', 'felony', 'capital'
    
    -- Alert Level
    priority VARCHAR(20) NOT NULL
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    dangerous BOOLEAN DEFAULT false,
    armed BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'apprehended', 'withdrawn', 'expired')),
    
    -- Last Known Info
    last_seen_location VARCHAR(200),
    last_seen_date DATE,
    known_associates TEXT[],
    known_addresses TEXT[],
    
    -- Apprehension
    apprehended_date DATE,
    apprehended_by VARCHAR(100),
    apprehended_location VARCHAR(200),
    
    -- Notifications
    border_alert BOOLEAN DEFAULT true, -- alert at borders
    sim_alert BOOLEAN DEFAULT true, -- alert on SIM registration
    bank_alert BOOLEAN DEFAULT false, -- alert on banking activity
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wanted_citizen ON wanted_persons(citizen_id);
CREATE INDEX idx_wanted_foreigner ON wanted_persons(foreigner_id);
CREATE INDEX idx_wanted_warrant ON wanted_persons(warrant_number);
CREATE INDEX idx_wanted_status ON wanted_persons(status);
CREATE INDEX idx_wanted_priority ON wanted_persons(priority);
```

---

## SAMPLE DATA FOR DEMO

```sql
-- Demo Citizen 1: John Doe
INSERT INTO citizens VALUES (
    gen_random_uuid(),
    '1990010112345678', -- national_id_number
    'John', 'Kwame', 'Doe',
    NULL, -- maiden_name
    '1990-01-01', 'Monrovia', 'Male',
    'Mary', 'Smith', NULL,
    'Joseph', 'Doe', NULL,
    '+231770123456', 'john.doe@email.com',
    'active', NULL,
    '2025-01-01', '2030-01-01', 'NID-2025-001',
    'abc123hash', 95,
    NOW(), NOW(), 'OFFICER-001', 'Monrovia Central'
);

-- Demo Foreigner 1: Adeola Okoye (Nigerian on work permit)
INSERT INTO foreigners VALUES (
    gen_random_uuid(),
    'FID-2025-NGR-001',
    'Adeola', 'Chioma', 'Okoye',
    '1988-05-15', 'Lagos, Nigeria', 'Female',
    'Nigerian',
    'A12345678', 'Nigeria', '2023-01-01', '2028-01-01',
    '+231886543210', 'adeola.okoye@email.com',
    'Sinkor, Monrovia',
    'Chidi Okoye', '+2348012345678', 'Husband',
    'active', NULL,
    true, 92, 'def456hash',
    '2024-06-01', 1,
    NOW(), NOW(), 'OFFICER-001'
);

-- Work Permit for Adeola
INSERT INTO visas_permits VALUES (
    gen_random_uuid(),
    (SELECT id FROM foreigners WHERE foreign_id_number = 'FID-2025-NGR-001'),
    'work_permit',
    'WP-2024-001',
    '2024-06-01', '2026-06-01',
    'Liberia Immigration Service',
    'Tech Solutions Liberia Ltd', 'TAX-12345', 'Software Engineer',
    'Monrovia',
    NULL, NULL, NULL, -- student fields
    'valid', NULL,
    NULL, 0,
    false, false, NULL,
    NOW(), NOW()
);

-- SIM Registration for John (citizen)
INSERT INTO sim_registrations VALUES (
    gen_random_uuid(),
    'citizen',
    (SELECT id FROM citizens WHERE national_id_number = '1990010112345678'),
    NULL, NULL,
    '+231770123456', '231011234567890', '8923100123456789',
    'LoneStar_MTN',
    NOW(), 'agent', 'Monrovia Office', 'AGENT-001',
    'active', NULL, NULL,
    NULL, NULL,
    true, 'full', true,
    false, NULL, NULL,
    NOW(), NOW()
);

-- SIM Registration for Adeola (foreigner - linked to work permit)
INSERT INTO sim_registrations VALUES (
    gen_random_uuid(),
    'foreigner',
    NULL,
    (SELECT id FROM foreigners WHERE foreign_id_number = 'FID-2025-NGR-001'),
    NULL,
    '+231886543210', '231012987654321', '8923100987654321',
    'Orange_Liberia',
    NOW(), 'agent', 'Sinkor Office', 'AGENT-002',
    'active', NULL, NULL,
    (SELECT id FROM visas_permits WHERE permit_number = 'WP-2024-001'),
    '2026-06-01', -- auto_suspend_date = visa expiry
    true, 'full', true,
    false, NULL, NULL,
    NOW(), NOW()
);
```

---

## Next: API Specification Document

The database is ready. Next document will detail:
- REST API endpoints for each module
- Request/response formats
- Authentication
- Rate limiting
- Code examples

Ready to build your demo! 🚀
