# NDISE API Specification
## RESTful API Documentation for Demo Development

**Version:** 2.0  
**Base URL:** `https://api.ndise.gov.lr/v1`  
**Authentication:** OAuth 2.0 + API Keys  
**Date:** November 19, 2025

---

## Table of Contents

1. [Authentication](#authentication)
2. [Core Identity APIs](#core-identity)
3. [Foreign Identity Registry APIs](#foreign-identity)
4. [Integration APIs](#integration)
5. [Security & Intelligence APIs](#security)
6. [Search & Analytics APIs](#analytics)
7. [Error Handling](#errors)

---

<a name="authentication"></a>
## 1. Authentication

### OAuth 2.0 Flow

**Step 1: Get Access Token**

```http
POST /auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&scope=read:citizens write:citizens read:foreigners
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:citizens write:citizens read:foreigners"
}
```

**Step 2: Use Token in Requests**

```http
GET /citizens/1990010112345678
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: your-api-key-here
X-Request-ID: unique-request-id
```

### API Key Tiers

| Tier | Rate Limit | Use Case |
|------|------------|----------|
| **Public** | 10 req/min | Verification only (KYC checks) |
| **Agency** | 100 req/min | Government agencies |
| **Internal** | 1000 req/min | Core NDISE services |
| **Admin** | Unlimited | System administration |

---

<a name="core-identity"></a>
## 2. Core Identity APIs

### 2.1 Create Citizen (Enrollment)

**Endpoint:** `POST /citizens`

**Purpose:** Enroll a new citizen

**Request Body:**
```json
{
  "first_name": "John",
  "middle_name": "Kwame",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "place_of_birth": "Monrovia",
  "gender": "Male",
  "phone_number": "+231770123456",
  "email": "john.doe@email.com",
  
  "mother": {
    "first_name": "Mary",
    "last_name": "Smith",
    "national_id": "1965050123456789"
  },
  
  "father": {
    "first_name": "Joseph",
    "last_name": "Doe",
    "national_id": "1962030123456789"
  },
  
  "address": {
    "street_address": "123 Broad Street",
    "community": "Old Road",
    "city": "Monrovia",
    "county": "Montserrado"
  },
  
  "documents": [
    {
      "type": "birth_certificate",
      "number": "BC-2025-12345",
      "file_url": "s3://ndise-docs/bc_12345.pdf"
    }
  ],
  
  "enrollment_metadata": {
    "officer_id": "OFFICER-001",
    "location": "Monrovia Central Enrollment Center",
    "device_id": "TABLET-045"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "national_id_number": "1990010112345678",
    "status": "active",
    "card_number": "NID-2025-001",
    "issue_date": "2025-11-19",
    "expiry_date": "2030-11-19",
    "next_step": "biometric_capture"
  },
  "message": "Citizen enrolled successfully. Please proceed to biometric capture."
}
```

**Duplicate Detection:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_DETECTED",
    "message": "Potential duplicate found",
    "details": {
      "existing_records": [
        {
          "national_id": "1990010112345679",
          "name": "John K. Doe",
          "dob": "1990-01-01",
          "match_score": 87.5,
          "match_reason": "Name similarity + DOB match"
        }
      ],
      "action_required": "human_review"
    }
  }
}
```

---

### 2.2 Get Citizen by National ID

**Endpoint:** `GET /citizens/{national_id}`

**Purpose:** Retrieve citizen details (requires authorization)

**Request:**
```http
GET /citizens/1990010112345678
Authorization: Bearer {token}
X-Purpose: "KYC verification for bank account opening"
X-Case-Number: "CASE-2025-001"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "national_id_number": "1990010112345678",
    "full_name": "John Kwame Doe",
    "first_name": "John",
    "middle_name": "Kwame",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "age": 35,
    "place_of_birth": "Monrovia",
    "gender": "Male",
    "status": "active",
    
    "contact": {
      "phone": "+231770123456",
      "email": "john.doe@email.com"
    },
    
    "current_address": {
      "street": "123 Broad Street",
      "community": "Old Road",
      "city": "Monrovia",
      "county": "Montserrado"
    },
    
    "card": {
      "number": "NID-2025-001",
      "issue_date": "2025-01-01",
      "expiry_date": "2030-01-01",
      "is_expired": false
    },
    
    "verification": {
      "biometric_enrolled": true,
      "biometric_quality": 95,
      "kyc_level": "full"
    }
  },
  "audit": {
    "access_logged": true,
    "log_id": "audit-xyz123"
  }
}
```

**Restricted Fields (Only for Authorized Agencies):**
```json
{
  "parents": {
    "mother": {
      "name": "Mary Smith",
      "national_id": "1965050123456789"
    },
    "father": {
      "name": "Joseph Doe",
      "national_id": "1962030123456789"
    }
  },
  "relationships": [
    {
      "type": "spouse",
      "name": "Jane Doe",
      "national_id": "1992030112345678"
    },
    {
      "type": "child",
      "name": "Sarah Doe",
      "national_id": "2015060112345678"
    }
  ]
}
```

---

### 2.3 Update Citizen

**Endpoint:** `PATCH /citizens/{national_id}`

**Purpose:** Update citizen information

**Request:**
```json
{
  "phone_number": "+231770999888",
  "email": "newemail@example.com",
  "address": {
    "street_address": "456 New Street",
    "community": "Sinkor",
    "city": "Monrovia",
    "county": "Montserrado"
  },
  "reason": "Citizen moved to new address",
  "updated_by": "OFFICER-002"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Citizen record updated successfully",
  "changes": {
    "phone_number": {
      "old": "+231770123456",
      "new": "+231770999888"
    },
    "address": {
      "old": "123 Broad Street, Old Road",
      "new": "456 New Street, Sinkor"
    }
  },
  "audit_log_id": "audit-abc456"
}
```

---

### 2.4 Biometric Capture & Match

**Endpoint:** `POST /biometrics/capture`

**Purpose:** Submit biometric data for enrollment

**Request (Multipart Form Data):**
```
POST /biometrics/capture
Content-Type: multipart/form-data

citizen_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
fingerprints: [binary data - 10 fingerprint images]
face_photo: [binary image data]
capture_device: "SecuGen Hamster Pro"
capture_location: "Monrovia Central"
liveness_check: true
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "citizen_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "biometric_id": "bio-xyz789",
    "quality_assessment": {
      "overall_score": 95,
      "fingerprints": {
        "right_thumb": 98,
        "right_index": 95,
        "left_thumb": 92,
        "captured_count": 10
      },
      "face": {
        "score": 94,
        "liveness_passed": true
      }
    },
    "deduplication_check": {
      "duplicates_found": 0,
      "status": "unique"
    }
  },
  "message": "Biometric enrollment completed successfully"
}
```

**Biometric Verification (1:1 Match):**

```http
POST /biometrics/verify
Content-Type: application/json
```

```json
{
  "national_id": "1990010112345678",
  "biometric_type": "fingerprint",
  "biometric_data": "base64_encoded_fingerprint_template",
  "match_threshold": 90
}
```

**Response:**
```json
{
  "success": true,
  "match": true,
  "match_score": 97.8,
  "confidence": "high",
  "message": "Biometric verified successfully"
}
```

**Biometric Search (1:N Identification):**

```http
POST /biometrics/identify
Content-Type: application/json
```

```json
{
  "biometric_type": "fingerprint",
  "biometric_data": "base64_encoded_template",
  "search_scope": "all", // or "wanted_persons", "citizens_only"
  "max_results": 5
}
```

**Response:**
```json
{
  "success": true,
  "matches_found": 2,
  "results": [
    {
      "national_id": "1990010112345678",
      "name": "John Kwame Doe",
      "match_score": 98.5,
      "confidence": "very_high"
    },
    {
      "national_id": "1990010112345679",
      "name": "John K. Doe",
      "match_score": 87.2,
      "confidence": "high",
      "note": "Possible duplicate"
    }
  ]
}
```

---

<a name="foreign-identity"></a>
## 3. Foreign Identity Registry (FIR) APIs

### 3.1 Register Foreigner (Border Entry)

**Endpoint:** `POST /foreigners`

**Purpose:** Register foreigner at point of entry

**Request:**
```json
{
  "passport": {
    "number": "A12345678",
    "country": "Nigeria",
    "issue_date": "2023-01-01",
    "expiry_date": "2028-01-01"
  },
  
  "personal_info": {
    "first_name": "Adeola",
    "middle_name": "Chioma",
    "last_name": "Okoye",
    "date_of_birth": "1988-05-15",
    "place_of_birth": "Lagos, Nigeria",
    "gender": "Female",
    "nationality": "Nigerian"
  },
  
  "contact": {
    "phone": "+2348012345678",
    "email": "adeola@email.com",
    "local_address": "123 Sinkor, Monrovia"
  },
  
  "entry_details": {
    "border_point": "Roberts International Airport",
    "entry_date": "2025-11-19T10:30:00Z",
    "transport_mode": "air",
    "flight_number": "BA203",
    "coming_from": "Lagos, Nigeria",
    "visit_purpose": "tourism",
    "intended_stay_days": 30,
    "local_contact_name": "John Doe",
    "local_contact_phone": "+231770123456"
  },
  
  "visa_permit": {
    "type": "ecowas_free_movement",
    "duration_days": 90
  },
  
  "biometrics": {
    "face_photo": "base64_encoded_image",
    "fingerprints": ["base64_template_1", "base64_template_2"]
  },
  
  "officer_id": "IMM-OFFICER-045"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "foreigner_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "foreign_id_number": "FID-2025-NGR-001",
    "permit_number": "ECOWAS-2025-001",
    "entry_logged": true,
    "visa_expiry_date": "2026-02-17",
    "auto_suspend_date": "2026-02-17",
    "status": "active"
  },
  "alerts": {
    "watchlist_match": false,
    "previous_overstays": 0,
    "deportation_history": false
  },
  "message": "Entry granted. ECOWAS 90-day permit issued."
}
```

**If Wanted/Watchlist Match:**
```json
{
  "success": false,
  "error": {
    "code": "WATCHLIST_MATCH",
    "message": "Person matched on security watchlist",
    "severity": "critical",
    "action_required": "detain_for_questioning",
    "details": {
      "match_type": "interpol_wanted",
      "match_score": 97.8,
      "warrant_number": "INTERPOL-2024-12345",
      "issuing_authority": "Interpol NCB Nigeria"
    }
  }
}
```

---

### 3.2 Get Foreigner Details

**Endpoint:** `GET /foreigners/{foreign_id}`

**Request:**
```http
GET /foreigners/FID-2025-NGR-001
Authorization: Bearer {token}
X-Purpose: "Work permit verification"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "foreign_id_number": "FID-2025-NGR-001",
    "full_name": "Adeola Chioma Okoye",
    "nationality": "Nigerian",
    "date_of_birth": "1988-05-15",
    "gender": "Female",
    
    "passport": {
      "number": "A12345678",
      "country": "Nigeria",
      "expiry_date": "2028-01-01",
      "is_valid": true
    },
    
    "current_permit": {
      "type": "work_permit",
      "number": "WP-2024-001",
      "issue_date": "2024-06-01",
      "expiry_date": "2026-06-01",
      "days_remaining": 200,
      "status": "valid",
      "employer": "Tech Solutions Liberia Ltd",
      "job_title": "Software Engineer"
    },
    
    "status": "active",
    "overstay_risk": "low",
    
    "immigration_history": {
      "first_entry": "2024-06-01",
      "total_entries": 3,
      "last_entry": "2025-09-15",
      "last_exit": "2025-08-20",
      "days_in_liberia": 365
    },
    
    "contact": {
      "phone": "+231886543210",
      "local_address": "Sinkor, Monrovia"
    }
  }
}
```

---

### 3.3 Visa/Permit Expiry Check (for SIM Suspension)

**Endpoint:** `GET /foreigners/visa-status/{phone_number}`

**Purpose:** Quick check if foreigner's visa is still valid (for telcos)

**Request:**
```http
GET /foreigners/visa-status/+231886543210
Authorization: Bearer {token}
X-Operator: LoneStar_MTN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "phone_number": "+231886543210",
    "foreigner_id": "FID-2025-NGR-001",
    "visa_status": "valid",
    "visa_expiry_date": "2026-06-01",
    "days_until_expiry": 200,
    "should_suspend": false,
    "auto_suspend_date": "2026-06-01"
  }
}
```

**When Visa Expired:**
```json
{
  "success": true,
  "data": {
    "phone_number": "+231886543210",
    "visa_status": "expired",
    "visa_expiry_date": "2025-10-01",
    "days_overdue": 49,
    "should_suspend": true,
    "action": "suspend_sim_immediately",
    "overstay_alert_id": "alert-123"
  }
}
```

---

### 3.4 Overstay Detection (Automated Job)

**Endpoint:** `GET /foreigners/overstays`

**Purpose:** Get list of foreigners who overstayed (for enforcement)

**Request:**
```http
GET /foreigners/overstays?severity=moderate&status=open&limit=100
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "total": 87,
  "data": [
    {
      "foreigner_id": "FID-2025-NGR-012",
      "name": "Example Person",
      "nationality": "Ghana",
      "visa_expiry_date": "2025-09-15",
      "days_overstayed": 65,
      "severity": "moderate",
      "phone_number": "+231770555666",
      "last_known_address": "Paynesville, Monrovia",
      "actions_taken": ["sms_sent", "sim_suspended"],
      "next_action": "police_notification"
    }
  ]
}
```

---

### 3.5 Border Exit

**Endpoint:** `POST /foreigners/{foreign_id}/exit`

**Purpose:** Log foreigner departure

**Request:**
```json
{
  "border_point": "Roberts International Airport",
  "exit_date": "2025-12-15T14:30:00Z",
  "transport_mode": "air",
  "flight_number": "BA204",
  "going_to": "Lagos, Nigeria",
  "officer_id": "IMM-OFFICER-045"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exit_logged": true,
    "total_days_stayed": 26,
    "overstay": false,
    "permit_closed": true,
    "status": "departed"
  },
  "message": "Exit processed successfully. No overstay detected."
}
```

**If Overstay Detected:**
```json
{
  "success": false,
  "error": {
    "code": "OVERSTAY_DETECTED",
    "message": "Visa overstay - fine required",
    "days_overstayed": 15,
    "fine_amount": 5000.00,
    "fine_currency": "LRD",
    "action": "collect_fine_before_departure"
  }
}
```

---

<a name="integration"></a>
## 4. Integration APIs

### 4.1 SIM Registration

**Endpoint:** `POST /integrations/sim/register`

**Purpose:** Register SIM card to identity

**Request:**
```json
{
  "owner_type": "citizen",
  "national_id": "1990010112345678",
  
  "sim_details": {
    "phone_number": "+231770123456",
    "imsi": "231011234567890",
    "iccid": "8923100123456789",
    "operator": "LoneStar_MTN"
  },
  
  "registration": {
    "method": "agent",
    "location": "Monrovia Central Office",
    "agent_id": "AGENT-001"
  },
  
  "kyc_verification": {
    "biometric_verified": true,
    "document_verified": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registration_id": "sim-reg-123",
    "phone_number": "+231770123456",
    "status": "active",
    "kyc_level": "full",
    "registered_to": "John Kwame Doe",
    "national_id": "1990010112345678"
  },
  "message": "SIM registered successfully"
}
```

**For Foreigner:**
```json
{
  "owner_type": "foreigner",
  "foreign_id": "FID-2025-NGR-001",
  "visa_permit_number": "WP-2024-001",
  
  "sim_details": {
    "phone_number": "+231886543210",
    "imsi": "231012987654321",
    "iccid": "8923100987654321",
    "operator": "Orange_Liberia"
  }
}
```

**Response (with auto-suspension date):**
```json
{
  "success": true,
  "data": {
    "registration_id": "sim-reg-124",
    "phone_number": "+231886543210",
    "status": "active",
    "registered_to": "Adeola Chioma Okoye",
    "foreign_id": "FID-2025-NGR-001",
    "visa_linked": true,
    "auto_suspend_date": "2026-06-01",
    "warning": "SIM will be suspended if visa not renewed by 2026-06-01"
  }
}
```

---

### 4.2 Bank KYC Verification

**Endpoint:** `POST /integrations/kyc/verify`

**Purpose:** Verify identity for banking services

**Request:**
```json
{
  "identity_type": "national_id",
  "identity_number": "1990010112345678",
  "purpose": "account_opening",
  "bank_code": "ECO001",
  "account_type": "savings",
  "requested_kyc_level": "full"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "data": {
    "national_id": "1990010112345678",
    "full_name": "John Kwame Doe",
    "date_of_birth": "1990-01-01",
    "age": 35,
    "gender": "Male",
    "phone_number": "+231770123456",
    "address": "123 Broad Street, Old Road, Monrovia",
    "kyc_level": "full",
    "risk_flags": [],
    "document_verified": true,
    "biometric_enrolled": true,
    "status": "active"
  },
  "verification_token": "kyc-token-abc123xyz",
  "expires_at": "2025-11-19T18:30:00Z"
}
```

**Risk Flags Example:**
```json
{
  "risk_flags": [
    {
      "type": "criminal_record",
      "severity": "low",
      "description": "Minor traffic violation in 2020"
    },
    {
      "type": "tax_compliance",
      "severity": "medium",
      "description": "Outstanding tax returns for 2023"
    }
  ]
}
```

---

### 4.3 Police Criminal Record Check

**Endpoint:** `GET /integrations/criminal-check/{national_id}`

**Purpose:** Check criminal history (authorized agencies only)

**Request:**
```http
GET /integrations/criminal-check/1990010112345678
Authorization: Bearer {token}
X-Agency: Liberia_National_Police
X-Case-Number: CASE-2025-001
X-Purpose: "Background check for government employment"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "national_id": "1990010112345678",
    "full_name": "John Kwame Doe",
    "criminal_history": true,
    "total_records": 2,
    
    "records": [
      {
        "case_number": "CR-2020-12345",
        "offense": "Traffic violation",
        "offense_date": "2020-03-15",
        "verdict": "guilty",
        "sentence": "Fine paid",
        "status": "closed"
      },
      {
        "case_number": "CR-2022-67890",
        "offense": "Petty theft",
        "offense_date": "2022-08-10",
        "verdict": "not_guilty",
        "status": "closed"
      }
    ],
    
    "active_warrants": 0,
    "wanted_status": false,
    "risk_assessment": "low"
  }
}
```

---

### 4.4 Wanted Person Alert

**Endpoint:** `POST /integrations/wanted-person-alert`

**Purpose:** Issue alert when wanted person is detected

**Request:**
```json
{
  "trigger_type": "border_crossing",
  "trigger_location": "Roberts International Airport",
  "trigger_timestamp": "2025-11-19T10:30:00Z",
  
  "person": {
    "national_id": "1990010112345678",
    "biometric_match_score": 98.5
  },
  
  "wanted_record": {
    "warrant_number": "WNT-2025-001",
    "offense": "Armed robbery",
    "priority": "high"
  },
  
  "officer_id": "BORDER-OFFICER-012"
}
```

**Response:**
```json
{
  "success": true,
  "alert_id": "alert-abc123",
  "actions": [
    {
      "action": "notify_police",
      "status": "dispatched",
      "units_notified": ["Monrovia Central Police", "Airport Security"]
    },
    {
      "action": "detain_person",
      "instructions": "Hold for police arrival. Do not allow to depart."
    }
  ],
  "estimated_police_arrival": "15 minutes",
  "message": "High priority warrant. Police dispatched."
}
```

---

<a name="security"></a>
## 5. Security & Intelligence APIs (NSA Access Only)

### 5.1 Pattern Analysis

**Endpoint:** `POST /intelligence/pattern-analysis`

**Purpose:** Detect suspicious patterns across identities

**Request:**
```json
{
  "analysis_type": "multi_sim_ownership",
  "parameters": {
    "threshold": 5,
    "time_period_days": 30,
    "include_foreigners": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis_id": "analysis-xyz789",
  "results_count": 23,
  "results": [
    {
      "national_id": "1990010112345678",
      "name": "John Kwame Doe",
      "sim_count": 8,
      "operators": ["LoneStar_MTN", "Orange_Liberia"],
      "registration_dates": ["2025-10-01", "2025-10-05", "2025-10-10"],
      "risk_score": 75,
      "flags": ["rapid_acquisition", "multiple_operators"],
      "recommendation": "investigate"
    }
  ]
}
```

---

### 5.2 Network Mapping

**Endpoint:** `POST /intelligence/network-map`

**Purpose:** Build relationship graph for investigation

**Request:**
```json
{
  "center_person": {
    "national_id": "1990010112345678"
  },
  "depth": 2,
  "include_types": [
    "family",
    "business_associates",
    "phone_contacts",
    "co_travelers",
    "shared_addresses"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "network_id": "network-abc123",
  "center_node": {
    "id": "1990010112345678",
    "name": "John Kwame Doe",
    "type": "citizen"
  },
  "connections": [
    {
      "target_id": "1992030112345678",
      "target_name": "Jane Doe",
      "relationship_type": "spouse",
      "confidence": 100,
      "verified": true
    },
    {
      "target_id": "FID-2025-NGR-001",
      "target_name": "Adeola Okoye",
      "relationship_type": "business_associate",
      "confidence": 85,
      "evidence": ["shared_employer", "frequent_phone_contact"]
    }
  ],
  "visualization_url": "https://ndise.gov.lr/intel/networks/network-abc123"
}
```

---

<a name="analytics"></a>
## 6. Search & Analytics APIs

### 6.1 Advanced Search

**Endpoint:** `POST /search`

**Purpose:** Multi-criteria search across all records

**Request:**
```json
{
  "criteria": {
    "name": "John",
    "county": "Montserrado",
    "age_range": {
      "min": 30,
      "max": 40
    },
    "gender": "Male",
    "has_criminal_record": false
  },
  "search_scope": ["citizens", "foreigners"],
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "total_results": 156,
  "returned": 20,
  "results": [
    {
      "type": "citizen",
      "national_id": "1990010112345678",
      "name": "John Kwame Doe",
      "dob": "1990-01-01",
      "address": "Monrovia, Montserrado",
      "relevance_score": 95
    }
  ],
  "next_page": "/search?page=2&query_id=qry-123"
}
```

---

### 6.2 Dashboard Analytics

**Endpoint:** `GET /analytics/dashboard`

**Purpose:** Real-time system statistics

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-11-19T15:30:00Z",
  "statistics": {
    "citizens": {
      "total_enrolled": 3850000,
      "enrolled_today": 1250,
      "target": 4500000,
      "completion_percentage": 85.6
    },
    
    "foreigners": {
      "currently_in_country": 45000,
      "entries_today": 320,
      "exits_today": 280,
      "overstays_active": 87,
      "visa_expiring_30days": 450
    },
    
    "sims": {
      "total_registered": 4200000,
      "registrations_today": 890,
      "suspended_visa_expiry": 120,
      "compliance_rate": 96.5
    },
    
    "security": {
      "wanted_persons_active": 234,
      "alerts_today": 5,
      "border_alerts": 2,
      "sim_alerts": 3
    },
    
    "system_health": {
      "api_uptime": 99.97,
      "avg_response_time_ms": 145,
      "database_load": 34.5,
      "errors_last_hour": 3
    }
  }
}
```

---

<a name="errors"></a>
## 7. Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    },
    "timestamp": "2025-11-19T15:30:00Z",
    "request_id": "req-abc123",
    "documentation_url": "https://docs.ndise.gov.lr/errors/ERROR_CODE"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_DETECTED` | 409 | Record already exists |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `BIOMETRIC_QUALITY_LOW` | 422 | Biometric quality below threshold |
| `VISA_EXPIRED` | 400 | Visa/permit no longer valid |
| `WATCHLIST_MATCH` | 403 | Person on security watchlist |

---

## Sample cURL Commands for Testing

```bash
# 1. Get Access Token
curl -X POST https://api.ndise.gov.lr/v1/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=demo&client_secret=secret&scope=read:citizens"

# 2. Get Citizen Details
curl -X GET https://api.ndise.gov.lr/v1/citizens/1990010112345678 \
  -H "Authorization: Bearer {token}" \
  -H "X-API-Key: demo-key" \
  -H "X-Purpose: Demo testing"

# 3. Check Visa Status
curl -X GET "https://api.ndise.gov.lr/v1/foreigners/visa-status/+231886543210" \
  -H "Authorization: Bearer {token}" \
  -H "X-Operator: LoneStar_MTN"

# 4. Search Citizens
curl -X POST https://api.ndise.gov.lr/v1/search \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"criteria": {"county": "Montserrado", "age_range": {"min": 25, "max": 40}}}'
```

---

## Next: UI Wireframes & Demo Screens

The API is ready! Next document will show:
- Screen mockups for demo
- User flows
- Component designs
- Demo scenarios

Ready to code your demo! 🚀
