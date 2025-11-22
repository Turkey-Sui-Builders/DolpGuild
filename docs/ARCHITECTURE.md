# 🏛️ DolpGuild Technical Architecture

Comprehensive technical architecture documentation for DolpGuild.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     DolpGuild Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pod System │  │  Job Market  │  │  Reputation  │      │
│  │              │  │              │  │    System    │      │
│  │ - Create Pod │  │ - Post Jobs  │  │ - Ratings    │      │
│  │ - Join Pod   │  │ - Apply      │  │ - Badges     │      │
│  │ - Reputation │  │ - Hire       │  │ - Metrics    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Escrow     │  │  Employment  │  │   Privacy    │      │
│  │   System     │  │    Badges    │  │   (Seal)     │      │
│  │              │  │              │  │              │      │
│  │ - Milestones │  │ - Soulbound  │  │ - Encrypted  │      │
│  │ - Payments   │  │ - Display    │  │ - Access Ctl │      │
│  │ - Refunds    │  │ - Verify     │  │ - Walrus     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   Sui Blockchain  │
                  │                   │
                  │ - Smart Contracts │
                  │ - Events          │
                  │ - Shared Objects  │
                  └──────────────────┘
```

---

## 🔧 Module Architecture

### 1. Core Module: `dolphguild.move`

**Responsibilities:**
- Pod management (create, join, track)
- Job posting and discovery
- Application submission
- Hiring process
- Global statistics

**Key Design Patterns:**
- **Shared Objects** - GlobalRegistry for platform-wide state
- **Owned Objects** - Pods, Jobs, Applications owned by users
- **Vector Storage** - Applications list, members list
- **Option Types** - Optional salary, deadline, hired candidate
- **Event Emission** - All major actions emit events

**Object Ownership:**
```
GlobalRegistry (Shared)
├── Tracked by all users
└── Updated on pod/job/application/hire actions

Pod (Owned by Creator)
├── Can be transferred
└── Mutable by owner

JobPosting (Owned by Employer)
├── Can be transferred
└── Mutable by employer (hire, close)

Application (Owned by Candidate)
├── Can be transferred
└── Immutable after creation
```

### 2. Reputation Module: `reputation.move`

**Responsibilities:**
- Two-sided rating system
- Badge management
- Behavioral metrics
- Trust scoring

**Data Flow:**
```
Job Completion
      ↓
Rating Submission (Employer → Candidate)
      ↓
Profile Update (rating_sum, rating_count)
      ↓
Badge Eligibility Check
      ↓
Badge Award (if qualified)
      ↓
Badge NFT Minted
```

**Badge Criteria:**
- **Top Employer**: avg_rating ≥ 4.5, total_hires ≥ 10
- **Rising Star**: avg_rating ≥ 4.5, total_jobs ≥ 3
- **Fast Responder**: response_time < 24h
- **Early Adopter**: user_id < 1000

### 3. Employment Badge Module: `employment_badge.move`

**Responsibilities:**
- Soulbound NFT credentials
- Employment verification
- Display Object integration
- Badge lifecycle (issue, revoke)

**Soulbound Implementation:**
```move
public struct EmploymentBadge has key, store {
    is_soulbound: bool,  // Always true
    // ... other fields
}

// Transfer only on initial issue
transfer::public_transfer(badge, employee);

// No transfer function provided
// Badge stays with employee forever
```

**Display Object Integration:**
```move
display::add(&mut display, "name", "{company_name} - {job_title}");
display::add(&mut display, "image_url", "{company_logo_url}");
display::add(&mut display, "description", "{description}");
```

### 4. Escrow Module: `escrow.move`

**Responsibilities:**
- Milestone-based payments
- Fund escrow management
- Payment releases
- Contract lifecycle

**Escrow Flow:**
```
1. create_contract()
   ├── Employer deposits total amount
   ├── Funds locked in Balance<SUI>
   └── Contract becomes shared object

2. complete_milestone()
   ├── Freelancer marks milestone done
   └── Status: PENDING → COMPLETED

3. release_payment()
   ├── Employer verifies work
   ├── Extract funds from escrow
   ├── Transfer to freelancer
   └── Status: COMPLETED → PAID

4. All milestones paid?
   └── Contract status: ACTIVE → COMPLETED
```

**Security Features:**
- Funds locked in smart contract
- Only employer can release payments
- Only freelancer can mark milestones complete
- Automatic refunds on cancellation

---

## 🔐 Access Control Matrix

| Function | Caller | Access Check | Error Code |
|----------|--------|--------------|------------|
| `create_pod` | Anyone | None | - |
| `join_pod` | Anyone | None | - |
| `post_job` | Anyone | None | - |
| `submit_application` | Anyone | Deadline check | `EDeadlinePassed` |
| `hire_candidate` | Employer | `job.employer == sender` | `EUnauthorized` |
| `close_job` | Employer | `job.employer == sender` | `EUnauthorized` |
| `submit_rating` | Involved party | Not self-rating | `ESelfRating` |
| `issue_badge` | Employer | None (anyone can issue) | - |
| `revoke_badge` | Employer | `badge.employer == sender` | `EUnauthorized` |
| `release_payment` | Employer | `contract.employer == sender` | `EUnauthorized` |
| `complete_milestone` | Freelancer | `contract.freelancer == sender` | `EUnauthorized` |

---

## 📡 Event System

### Event Categories

**1. Pod Events**
- `PodCreatedEvent` - New pod created
- `MemberJoinedPodEvent` - User joins pod

**2. Job Events**
- `JobPostedEvent` - New job posted
- `ApplicationSubmittedEvent` - Application received
- `CandidateHiredEvent` - Candidate hired

**3. Reputation Events**
- `RatingSubmittedEvent` - Rating given
- `BadgeEarnedEvent` - Badge awarded
- `ReputationUpdatedEvent` - Profile updated

**4. Badge Events**
- `BadgeIssuedEvent` - Employment badge issued
- `BadgeRevokedEvent` - Badge revoked

**5. Escrow Events**
- `ContractCreatedEvent` - Escrow contract created
- `MilestoneCompletedEvent` - Milestone marked done
- `PaymentReleasedEvent` - Payment released
- `ContractCompletedEvent` - All milestones paid

### Event Indexing

Events can be indexed for:
- Real-time notifications
- Activity feeds
- Analytics dashboards
- Search functionality

**Query Example:**
```bash
sui client events --event-type $PACKAGE_ID::dolphguild::JobPostedEvent
```

---

## 💾 Data Storage Patterns

### On-Chain Storage
- User profiles (reputation, badges)
- Job postings (metadata, status)
- Applications (cover letters, references)
- Contracts (milestones, payments)
- Ratings and reviews

### Off-Chain Storage (Walrus)
- CVs and resumes
- Portfolio files
- Large documents
- Media files

**Integration Pattern:**
```move
public struct Application has key, store {
    // On-chain metadata
    cover_letter: String,
    
    // Off-chain reference
    cv_blob_id: Option<String>,  // Walrus blob ID
    
    // Encrypted reference (Seal)
    encrypted_cv_blob_id: Option<String>,
}
```

---

## 🔄 State Transitions

### Job Lifecycle
```
OPEN (0) ──hire_candidate()──> FILLED (2)
   │
   └──close_job()──> CLOSED (1)
```

### Application Status
```
PENDING (0) ──review──> REVIEWED (1)
                           │
                           ├──> ACCEPTED (2)
                           │
                           └──> REJECTED (3)
```

### Milestone Status
```
PENDING (0) ──complete_milestone()──> COMPLETED (2)
                                          │
                                          └──release_payment()──> PAID (3)
```

### Contract Status
```
ACTIVE (0) ──all_milestones_paid()──> COMPLETED (1)
   │
   └──cancel_contract()──> CANCELLED (2)
```

---

## 🚀 Scalability Considerations

### Current Implementation
- **Vector Storage** - Applications, members, skills
- **Limitation** - ~1000 items per vector (gas costs)

### Future Optimization (Dynamic Fields)
```move
use sui::dynamic_field as df;

// Instead of:
applications: vector<ID>

// Use:
df::add(&mut job.id, application_id, application);
```

**Benefits:**
- Unlimited scalability
- Lower gas costs for large datasets
- Better performance

---

## 🔒 Security Architecture

### Smart Contract Security
- ✅ Access control on sensitive functions
- ✅ Input validation (ratings 1-5, valid addresses)
- ✅ Deadline enforcement
- ✅ Status checks before state changes
- ✅ No reentrancy (Move language guarantee)

### Privacy Features
- 🔐 Encrypted CV storage (Seal integration ready)
- 🔐 Access control lists for sensitive data
- 🔐 Optional public/private profiles

### Economic Security
- 💰 Escrow protection for payments
- 💰 No platform fees (only gas)
- 💰 Transparent pricing

---

**Architecture Version:** 1.0  
**Last Updated:** 2025-11-22

