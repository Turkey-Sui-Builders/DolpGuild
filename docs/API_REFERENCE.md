# 📚 DolpGuild API Reference

Complete reference for all smart contract functions and data structures.

---

## 🏗️ Module: `dolphguild::dolphguild`

Main module for core platform functionality.

### Data Structures

#### `GlobalRegistry` (Shared Object)
```move
public struct GlobalRegistry has key {
    id: UID,
    total_pods: u64,
    total_jobs: u64,
    total_applications: u64,
    total_hires: u64,
}
```

#### `Pod`
```move
public struct Pod has key, store {
    id: UID,
    name: String,
    description: String,
    category: String,
    creator: address,
    members: vector<address>,
    member_count: u64,
    reputation_score: u64,
    created_at: u64,
    logo_url: String,
}
```

#### `JobPosting`
```move
public struct JobPosting has key, store {
    id: UID,
    employer: address,
    pod_id: ID,
    title: String,
    description: String,
    requirements: String,
    salary: Option<u64>,
    application_deadline: Option<u64>,
    hired_candidate: Option<address>,
    job_type: u8,  // 0: Full-time, 1: Part-time, 2: Freelance
    status: u8,    // 0: Open, 1: Closed, 2: Filled
    applications: vector<ID>,
    required_skills: vector<String>,
    created_at: u64,
    company_name: String,
    company_logo_url: String,
    location: String,
}
```

#### `Application`
```move
public struct Application has key, store {
    id: UID,
    job_id: ID,
    candidate: address,
    pod_id: ID,
    cover_letter: String,
    cv_blob_id: Option<String>,
    portfolio_url: Option<String>,
    encrypted_cv_blob_id: Option<String>,
    applied_at: u64,
    status: u8,  // 0: Pending, 1: Reviewed, 2: Accepted, 3: Rejected
}
```

### Entry Functions

#### `create_pod`
Create a new professional pod.

**Parameters:**
- `registry: &mut GlobalRegistry` - Global registry (shared object)
- `name: String` - Pod name
- `description: String` - Pod description
- `category: String` - Pod category (e.g., "Engineering", "Design")
- `logo_url: String` - Pod logo URL
- `clock: &Clock` - Clock object for timestamp
- `ctx: &mut TxContext` - Transaction context

**Returns:** Transfers `Pod` object to creator

**Events:** `PodCreatedEvent`

**Example:**
```typescript
await signAndExecuteTransaction({
  transaction: {
    kind: 'moveCall',
    data: {
      packageObjectId: PACKAGE_ID,
      module: 'dolphguild',
      function: 'create_pod',
      arguments: [
        REGISTRY_ID,
        'Developer Pod',
        'Community of blockchain developers',
        'Engineering',
        'https://dolphguild.io/pods/dev.png',
        CLOCK_ID
      ],
      gasBudget: 10000000,
    }
  }
});
```

#### `join_pod`
Join an existing pod.

**Parameters:**
- `pod: &mut Pod` - Pod to join
- `clock: &Clock` - Clock object
- `ctx: &mut TxContext` - Transaction context

**Events:** `MemberJoinedPodEvent`

#### `post_job`
Post a new job listing.

**Parameters:**
- `registry: &mut GlobalRegistry`
- `pod_id: ID` - Target pod ID
- `title: String`
- `description: String`
- `requirements: String`
- `salary_amount: u64`
- `has_salary: bool` - Whether salary is specified
- `deadline_ms: u64`
- `has_deadline: bool` - Whether deadline is set
- `job_type: u8` - 0: Full-time, 1: Part-time, 2: Freelance
- `company_name: String`
- `company_logo_url: String`
- `location: String`
- `required_skills: vector<String>`
- `clock: &Clock`
- `ctx: &mut TxContext`

**Returns:** Transfers `JobPosting` to employer

**Events:** `JobPostedEvent`

#### `submit_application`
Submit application to a job.

**Parameters:**
- `registry: &mut GlobalRegistry`
- `job: &mut JobPosting`
- `pod_id: ID` - Applicant's pod
- `cover_letter: String`
- `cv_blob_id_value: String` - Walrus blob ID
- `has_cv_blob: bool`
- `portfolio_url_value: String`
- `has_portfolio: bool`
- `clock: &Clock`
- `ctx: &mut TxContext`

**Returns:** Transfers `Application` to candidate

**Events:** `ApplicationSubmittedEvent`

**Validations:**
- Deadline not passed (if set)
- Job status is OPEN

#### `hire_candidate`
Hire a candidate (employer only).

**Parameters:**
- `registry: &mut GlobalRegistry`
- `job: &mut JobPosting`
- `candidate_addr: address`
- `clock: &Clock`
- `ctx: &mut TxContext`

**Events:** `CandidateHiredEvent`

**Access Control:** Only job employer can call

**Effects:**
- Sets job status to FILLED
- Sets hired_candidate to candidate address
- Increments total_hires in registry

#### `close_job`
Close job posting (employer only).

**Parameters:**
- `job: &mut JobPosting`
- `ctx: &mut TxContext`

**Access Control:** Only job employer can call

### View Functions

#### `get_pod_member_count`
```move
public fun get_pod_member_count(pod: &Pod): u64
```

#### `get_pod_reputation`
```move
public fun get_pod_reputation(pod: &Pod): u64
```

#### `get_job_application_count`
```move
public fun get_job_application_count(job: &JobPosting): u64
```

#### `job_has_salary`
```move
public fun job_has_salary(job: &JobPosting): bool
```

#### `get_job_salary`
```move
public fun get_job_salary(job: &JobPosting): u64
```
**Note:** Aborts if salary not set

#### `job_has_deadline`
```move
public fun job_has_deadline(job: &JobPosting): bool
```

#### `get_job_status`
```move
public fun get_job_status(job: &JobPosting): u8
```

#### `get_registry_stats`
```move
public fun get_registry_stats(registry: &GlobalRegistry): (u64, u64, u64, u64)
```
**Returns:** (total_pods, total_jobs, total_applications, total_hires)

### Events

#### `PodCreatedEvent`
```move
public struct PodCreatedEvent has copy, drop {
    pod_id: ID,
    name: String,
    creator: address,
    timestamp: u64,
}
```

#### `JobPostedEvent`
```move
public struct JobPostedEvent has copy, drop {
    job_id: ID,
    employer: address,
    pod_id: ID,
    title: String,
    job_type: u8,
    timestamp: u64,
}
```

#### `ApplicationSubmittedEvent`
```move
public struct ApplicationSubmittedEvent has copy, drop {
    application_id: ID,
    job_id: ID,
    candidate: address,
    pod_id: ID,
    timestamp: u64,
}
```

#### `CandidateHiredEvent`
```move
public struct CandidateHiredEvent has copy, drop {
    job_id: ID,
    employer: address,
    candidate: address,
    salary: Option<u64>,
    timestamp: u64,
}
```

#### `MemberJoinedPodEvent`
```move
public struct MemberJoinedPodEvent has copy, drop {
    pod_id: ID,
    member: address,
    timestamp: u64,
}
```

---

## Module continues in API_REFERENCE_PART2.md...

