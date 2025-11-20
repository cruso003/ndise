# NDISE System Overview
## National Digital Identity & Services Ecosystem

**Version:** 2.0 (Enhanced)  
**Date:** November 19, 2025  
**Purpose:** Comprehensive national identity and service integration system for Liberia

---

## Executive Summary

NDISE is a **federated digital identity platform** that serves as the backbone for government services, security operations, and economic integration in Liberia. It combines:

- **Citizen Identity Management** (4.5M+ Liberians)
- **Foreign National Tracking** (visa/permit management)
- **Government Service Integration** (15+ agencies)
- **Security Intelligence** (NSA, Immigration, Police)
- **Regional Interoperability** (ECOWAS cross-border)

---

## System Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCESS LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Citizen  │  │ Agency   │  │  Border  │  │  Private │   │
│  │  Portal  │  │ Dashboards│  │  Officer │  │  Sector  │   │
│  │ (Mobile) │  │          │  │  Tablet  │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    API GATEWAY                               │
│  • Authentication (OAuth 2.0)                                │
│  • Rate Limiting                                             │
│  • Request Routing                                           │
│  • Audit Logging                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    CORE SERVICES                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  IDENTITY CORE                                      │    │
│  │  ├─ Foundational Identity DB                       │    │
│  │  ├─ Biometric Matching Engine                      │    │
│  │  ├─ AI Reconciliation                              │    │
│  │  └─ Blockchain Audit Trail                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SPECIALIZED MODULES                                │    │
│  │  ├─ Foreign Identity Registry (FIR)                │    │
│  │  ├─ Justice & Corrections                          │    │
│  │  ├─ Vehicle & Driver Registry                      │    │
│  │  ├─ Business Intelligence                          │    │
│  │  ├─ Education Credentials                          │    │
│  │  ├─ Social Welfare                                 │    │
│  │  ├─ Emergency Response                             │    │
│  │  └─ Security Intelligence (NSA)                    │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│              INTEGRATION LAYER                               │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │Immigration│  │  Police   │  │   NIR     │  │  LTA    │ │
│  │           │  │ (LIPS)    │  │ (Civil    │  │ (SIM)   │ │
│  │           │  │           │  │ Registry) │  │         │ │
│  └───────────┘  └───────────┘  └───────────┘  └─────────┘ │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │ Health    │  │   Tax     │  │  Land     │  │ Driver  │ │
│  │ Ministry  │  │ Authority │  │ Registry  │  │ License │ │
│  └───────────┘  └───────────┘  └───────────┘  └─────────┘ │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  Banks    │  │  Mobile   │  │  ECOWAS   │              │
│  │           │  │  Money    │  │  Systems  │              │
│  └───────────┘  └───────────┘  └───────────┘              │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Identity Core (Foundation)

**Purpose:** Single source of truth for all identities in Liberia

**Key Features:**
- Unique National ID Number (16 digits)
- Multi-modal biometrics (fingerprints, face, iris)
- Demographic data (name, DOB, address, parents)
- Birth/death certificates linkage
- Blockchain audit trail (immutable log)

**Database:** PostgreSQL (master) + MongoDB (biometric images)

---

### 2. Foreign Identity Registry (FIR)

**Purpose:** Track all foreigners with visa/permit management

**Foreigner Categories:**
- Tourists (< 90 days)
- ECOWAS Citizens (90-day free movement)
- Work Permit Holders
- Residence Permit Holders
- Students
- Diplomatic Corps
- Refugees/Asylum Seekers

**Key Capabilities:**
- Automatic overstay detection
- Visa expiry → SIM suspension
- Border entry/exit tracking
- Employer verification for work permits
- Deportation order automation

**Integration Points:**
- Immigration database
- Border control systems
- Police (wanted persons)
- LTA (SIM registration)
- Banks (account opening)
- Employers (work permit verification)

---

### 3. AI Reconciliation Engine

**Purpose:** Merge fragmented records across government agencies

**How It Works:**
```
Step 1: Data Ingestion
├─ Immigration records
├─ Police records
├─ Health records
├─ Tax records
└─ Civil registry

Step 2: AI Analysis
├─ Biometric matching (99.9% accuracy threshold)
├─ Demographic similarity (name, DOB, address)
├─ Relationship detection (same parents, siblings)
└─ Confidence scoring (0-100%)

Step 3: Human Review
├─ High confidence (>95%) → Auto-merge
├─ Medium confidence (70-95%) → Human review
├─ Low confidence (<70%) → Reject, manual investigation
└─ Citizen notification (30-day dispute window)

Step 4: Continuous Learning
├─ ML model improves over time
├─ Pattern recognition for fraud detection
└─ Anomaly detection (multiple IDs, ghost persons)
```

---

### 4. Biometric System

**Capture Equipment:**
- Fingerprint scanner (10 fingers, FBI-compliant)
- Face camera (multiple angles, 3D capable)
- Iris scanner (optional, high-security)
- Document scanner (passport, birth certificate)

**Matching Capabilities:**
- **1:1 Verification** (You claim to be John → Prove it)
- **1:N Identification** (Who is this person? → Search 5M records)
- **Deduplication** (Find all duplicates in database)
- **Watchlist Screening** (Is this person wanted?)

**Performance Targets:**
- Match speed: <2 seconds for 1:1
- Search speed: <10 seconds for 1:N (5M records)
- False Acceptance Rate (FAR): <0.01%
- False Rejection Rate (FRR): <1%

---

### 5. Access Control Matrix

**Role-Based + Purpose-Based Access Control**

| Role | Identity Core | FIR | Justice | Health | Financial | Intelligence |
|------|---------------|-----|---------|--------|-----------|--------------|
| **Citizen** | Own data only | N/A | N/A | Own records | Own records | N/A |
| **Civil Registry Officer** | Create/Update | N/A | N/A | N/A | N/A | N/A |
| **Immigration Officer** | Read | Full access | Read | N/A | N/A | N/A |
| **Police Officer** | Read (case-based) | Read | Full access | N/A | N/A | Read (warrants) |
| **Border Control** | Read | Full access | Read (wanted) | N/A | N/A | Read (watch list) |
| **NSA Analyst** | Read | Full access | Full access | Read | Read | Full access |
| **Health Worker** | Read | N/A | N/A | Full access | N/A | N/A |
| **Tax Officer** | Read (taxpayer) | Read (business) | N/A | N/A | Read | N/A |
| **Bank Teller** | Verify only (API) | Verify only | N/A | N/A | N/A | N/A |
| **System Admin** | Technical only | Technical only | Technical only | Technical only | Technical only | N/A |

**Key Principles:**
- Need-to-know basis only
- Purpose logging required (WHY accessing)
- Time-limited access (sessions expire)
- Citizen can see WHO accessed their data
- Automatic red flags for unusual patterns

---

### 6. Integration Modules

#### **A. SIM Registration Integration**

**Use Case:** When someone buys a SIM card

**Flow for Liberian Citizens:**
```
1. Person goes to telco shop
2. Agent scans National ID card (QR code)
3. System verifies:
   ├─ ID is valid (not expired, not suspended)
   ├─ Biometric match (optional: fingerprint)
   └─ No SIM limit exceeded (max 4 per operator)
4. SIM activated and linked to National ID
5. Citizen gets SMS: "SIM registered to your ID"
```

**Flow for Foreigners:**
```
1. Foreigner presents passport + visa
2. Agent checks FIR system:
   ├─ Visa valid?
   ├─ Overstay history?
   └─ Permitted to work? (if applicable)
3. SIM registered with expiry = visa expiry
4. System monitors:
   ├─ Day 80 → SMS: "Visa expires in 10 days"
   ├─ Day 90 → SIM suspended (receive-only)
   ├─ Day 120 → Full deactivation
5. Renewal: Upload new visa → SIM reactivated
```

#### **B. Border Control Integration**

**Entry Process:**
```
Roberts International Airport - Immigration Desk

Officer actions:
1. Scan passport (MRZ reader)
2. Capture biometrics:
   ├─ Face photo (4 angles)
   ├─ Fingerprints (both thumbs)
   └─ Iris (if available)
3. System checks:
   ├─ ECOWAS citizen? → 90-day auto-grant
   ├─ Valid visa for non-ECOWAS?
   ├─ Wanted person? (Interpol + regional)
   ├─ Previous overstays?
   ├─ Deportation history?
   └─ Watch list match?
4. Automatic FIR record created:
   ├─ Entry date/time
   ├─ Entry point
   ├─ Purpose of visit
   ├─ Intended stay duration
   └─ Local address
5. Entry stamp issued (or denial with reason)
```

**Exit Process:**
```
1. Scan passport at exit
2. System calculates days stayed
3. Overstay check:
   ├─ Within limit → Close FIR record
   ├─ Overstayed → Flag for future, fine collected
   └─ Severe overstay → Ban from re-entry
4. Exit stamp issued
```

#### **C. Bank Account Opening**

**KYC Verification API:**
```
POST /api/kyc/verify
{
  "national_id": "1234567890123456",
  "purpose": "account_opening",
  "bank_code": "ECO001"
}

Response:
{
  "verified": true,
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St, Monrovia",
  "nationality": "Liberian",
  "risk_flags": [],
  "kyc_level": "full"
}
```

**For Foreigners:**
```
POST /api/kyc/verify-foreigner
{
  "passport_number": "A12345678",
  "nationality": "Nigerian",
  "purpose": "account_opening"
}

Response:
{
  "verified": true,
  "full_name": "Adeola Smith",
  "visa_status": "valid",
  "visa_expiry": "2027-12-31",
  "work_permit": true,
  "risk_flags": ["tax_id_missing"],
  "kyc_level": "standard"
}
```

#### **D. Justice & Corrections**

**Arrest → Release Tracking:**
```
1. Arrest:
   ├─ Police scan fingerprints
   ├─ System identifies person (even if fake name given)
   ├─ Pulls criminal history
   ├─ Creates case file
   └─ Notifies court system

2. Court:
   ├─ Judge accesses case via tablet
   ├─ Sees prior convictions
   ├─ Sentencing recorded in system
   └─ Prison notified automatically

3. Prison:
   ├─ Inmate registered (biometric check-in)
   ├─ Sentence calculation (time served, good behavior)
   ├─ Visitor log (who visited when)
   └─ Release date auto-calculated

4. Release:
   ├─ Biometric verification before release
   ├─ Police notified (if probation required)
   ├─ Reintegration services linked
   └─ Citizen record updated (criminal history)
```

**Wanted Persons Alerts:**
```
Someone wanted by police:
1. Flag activated in NDISE
2. Alerts triggered when person:
   ├─ Crosses border (entry/exit)
   ├─ Registers new SIM
   ├─ Opens bank account
   ├─ Visits government office
   ├─ Gets stopped for traffic violation
   └─ Enrolls child in school
3. Police receive instant notification:
   ├─ Location
   ├─ Timestamp
   ├─ Reason for interaction
   └─ GPS coordinates (if available)
```

#### **E. Vehicle & Driver Registry**

**Driver's License:**
```
Apply for license:
1. Profile auto-populated from NDISE
2. Medical fitness exam recorded
3. Driving test scheduled
4. Pass → Digital license issued
5. License stored in:
   ├─ Mobile app (QR code)
   ├─ Physical card (backup)
   └─ Police database

Police stop:
1. Officer scans driver's QR code
2. Instant verification:
   ├─ Valid license?
   ├─ Vehicle registered to this person?
   ├─ Insurance current?
   ├─ Outstanding warrants?
   └─ Traffic violations history
3. Issue e-ticket if violation
4. Driver notified via SMS
```

---

## Security & Privacy

### Data Protection Measures

**Technical:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Biometric templates (not raw images stored in main DB)
- Zero-knowledge proofs for verifications
- Regular penetration testing

**Organizational:**
- Independent Data Protection Authority
- Annual privacy audits
- Mandatory breach notifications (72 hours)
- Whistleblower protections
- Criminal penalties for unauthorized access

**Citizen Rights:**
- Right to access your data
- Right to see WHO accessed (audit log)
- Right to correct errors
- Right to dispute incorrect linkages
- Right to be forgotten (with legal exceptions)

---

## Deployment Architecture

**Cloud-Hybrid Model:**
```
Production Environment:
├─ AWS Africa (Cape Town) - Primary
│   ├─ Core identity database (RDS PostgreSQL)
│   ├─ Biometric storage (S3 + Glacier)
│   ├─ Application servers (EKS)
│   └─ Redis cache
├─ On-Premise (Monrovia) - Critical backup
│   ├─ Border control systems
│   ├─ Police database sync
│   └─ Offline mode capability
└─ Disaster Recovery (AWS EU-Frankfurt)
    └─ Full backup, 4-hour recovery time
```

**Offline Capability:**
- QR codes with embedded, cryptographically signed data
- Portable biometric kits for field operations
- Local database sync when connectivity restored
- SMS-based verification for rural areas

---

## Demo Focus Areas

For your AI-powered demo, prioritize these user flows:

### 1. **Citizen Enrollment** (5-minute demo)
- Show enrollment form with validation
- Biometric capture simulation
- Duplicate detection
- ID card generation

### 2. **Foreigner Registration** (3-minute demo)
- Border entry simulation
- Visa tracking
- Overstay alert automation

### 3. **SIM Registration** (2-minute demo)
- National ID verification
- Foreigner visa check
- Auto-suspension on visa expiry

### 4. **Police Search** (2-minute demo)
- Biometric search (find person by fingerprint)
- Criminal history display
- Wanted person alert

### 5. **Dashboard Analytics** (2-minute demo)
- Real-time enrollment stats
- Visa expiration alerts
- System health monitoring

---

## Next Documents in This Package

1. ✅ **System Overview** (this document)
2. **Database Schema** (complete table designs)
3. **API Specifications** (endpoint details for each module)
4. **User Interface Wireframes** (screens for demo)
5. **Demo Dataset** (sample data for testing)
6. **Deployment Guide** (how to set up locally)

---

**Ready for demo development?** Let's move to the technical specs next.
