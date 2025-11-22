/// DolpGuild - Ocean-Themed Web3 Professional Network
/// Main module coordinating the entire ecosystem
module dolphguild::dolphguild {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::display;
    use sui::package;
    use std::option::{Self, Option};
    use std::vector;

    // Import other modules for integration
    use dolphguild::employment_badge::{Self, BadgeRegistry};
    use dolphguild::reputation::{Self, ReputationProfile};

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const EInvalidInput: u64 = 2;
    const EPodNotFound: u64 = 3;
    const EJobNotFound: u64 = 4;
    const EAlreadyApplied: u64 = 5;
    const EDeadlinePassed: u64 = 6;
    const EInvalidStatus: u64 = 7;

    // ==================== Constants ====================
    const JOB_STATUS_OPEN: u8 = 0;
    const JOB_STATUS_CLOSED: u8 = 1;
    const JOB_STATUS_FILLED: u8 = 2;

    const JOB_TYPE_FULL_TIME: u8 = 0;
    const JOB_TYPE_PART_TIME: u8 = 1;
    const JOB_TYPE_FREELANCE: u8 = 2;

    // ==================== Core Structs ====================
    
    /// One-Time-Witness for Display Object
    public struct DOLPHGUILD has drop {}

    /// Global registry - Shared Object
    public struct GlobalRegistry has key {
        id: UID,
        total_pods: u64,
        total_jobs: u64,
        total_applications: u64,
        total_hires: u64,
    }

    /// Professional Pod - Community of specialists
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

    /// Job Posting with all mandatory features
    public struct JobPosting has key, store {
        id: UID,
        employer: address,
        pod_id: ID,
        title: String,
        description: String,
        requirements: String,
        
        // Option<T> usage - Mandatory requirement
        salary: Option<u64>,
        application_deadline: Option<u64>,
        hired_candidate: Option<address>,
        
        job_type: u8, // FULL_TIME, PART_TIME, FREELANCE
        status: u8,
        
        // Vector usage - Mandatory requirement
        applications: vector<ID>,
        required_skills: vector<String>,
        
        created_at: u64,
        company_name: String,
        company_logo_url: String,
        location: String,
    }

    /// Application with pod endorsement
    public struct Application has key, store {
        id: UID,
        job_id: ID,
        candidate: address,
        pod_id: ID,
        cover_letter: String,
        
        // Walrus integration - CV storage
        cv_blob_id: Option<String>,
        portfolio_url: Option<String>,
        
        // Seal integration - Encrypted data
        encrypted_cv_blob_id: Option<String>,
        
        applied_at: u64,
        status: u8, // 0: Pending, 1: Reviewed, 2: Accepted, 3: Rejected
    }

    // ==================== Events - Mandatory Requirement ====================
    
    public struct PodCreatedEvent has copy, drop {
        pod_id: ID,
        name: String,
        creator: address,
        timestamp: u64,
    }

    public struct JobPostedEvent has copy, drop {
        job_id: ID,
        employer: address,
        pod_id: ID,
        title: String,
        job_type: u8,
        timestamp: u64,
    }

    public struct ApplicationSubmittedEvent has copy, drop {
        application_id: ID,
        job_id: ID,
        candidate: address,
        pod_id: ID,
        timestamp: u64,
    }

    public struct CandidateHiredEvent has copy, drop {
        job_id: ID,
        employer: address,
        candidate: address,
        salary: Option<u64>,
        timestamp: u64,
    }

    public struct MemberJoinedPodEvent has copy, drop {
        pod_id: ID,
        member: address,
        timestamp: u64,
    }

    // ==================== Init Function ====================
    
    fun init(otw: DOLPHGUILD, ctx: &mut TxContext) {
        // Create global registry as shared object
        let registry = GlobalRegistry {
            id: object::new(ctx),
            total_pods: 0,
            total_jobs: 0,
            total_applications: 0,
            total_hires: 0,
        };
        
        transfer::share_object(registry);

        // Create Display for JobPosting
        let publisher = package::claim(otw, ctx);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    // ==================== Pod Functions ====================

    /// Create a new professional pod
    public entry fun create_pod(
        registry: &mut GlobalRegistry,
        name: String,
        description: String,
        category: String,
        logo_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let pod = Pod {
            id: object::new(ctx),
            name,
            description,
            category,
            creator: sender,
            members: vector::empty(),
            member_count: 0,
            reputation_score: 100, // Starting reputation
            created_at: timestamp,
            logo_url,
        };

        let pod_id = object::id(&pod);

        // Update registry
        registry.total_pods = registry.total_pods + 1;

        // Emit event
        event::emit(PodCreatedEvent {
            pod_id,
            name: pod.name,
            creator: sender,
            timestamp,
        });

        // Transfer pod to creator
        transfer::public_transfer(pod, sender);
    }

    /// Join a pod
    public entry fun join_pod(
        pod: &mut Pod,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Add member to pod
        vector::push_back(&mut pod.members, sender);
        pod.member_count = pod.member_count + 1;

        // Emit event
        event::emit(MemberJoinedPodEvent {
            pod_id: object::id(pod),
            member: sender,
            timestamp,
        });
    }

    // ==================== Job Posting Functions ====================

    /// Post a new job (with all mandatory features)
    public entry fun post_job(
        registry: &mut GlobalRegistry,
        pod_id: ID,
        title: String,
        description: String,
        requirements: String,
        salary_amount: u64,
        has_salary: bool,
        deadline_ms: u64,
        has_deadline: bool,
        job_type: u8,
        company_name: String,
        company_logo_url: String,
        location: String,
        required_skills: vector<String>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Use Option<T> for salary and deadline - Mandatory requirement
        let salary = if (has_salary) {
            option::some(salary_amount)
        } else {
            option::none()
        };

        let application_deadline = if (has_deadline) {
            option::some(deadline_ms)
        } else {
            option::none()
        };

        let job = JobPosting {
            id: object::new(ctx),
            employer: sender,
            pod_id,
            title,
            description,
            requirements,
            salary,
            application_deadline,
            hired_candidate: option::none(), // Option<T> usage
            job_type,
            status: JOB_STATUS_OPEN,
            applications: vector::empty(), // Vector usage
            required_skills,
            created_at: timestamp,
            company_name,
            company_logo_url,
            location,
        };

        let job_id = object::id(&job);

        // Update registry
        registry.total_jobs = registry.total_jobs + 1;

        // Emit event
        event::emit(JobPostedEvent {
            job_id,
            employer: sender,
            pod_id,
            title: job.title,
            job_type,
            timestamp,
        });

        // Share job object so anyone can apply
        transfer::public_share_object(job);
    }

    /// Submit application to a job
    public entry fun submit_application(
        registry: &mut GlobalRegistry,
        job: &mut JobPosting,
        pod_id: ID,
        cover_letter: String,
        cv_blob_id_value: String,
        has_cv_blob: bool,
        portfolio_url_value: String,
        has_portfolio: bool,
        // Seal + Walrus integration - Encrypted CV storage
        encrypted_cv_blob_id_value: String,
        has_encrypted_cv: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Check deadline if exists
        if (option::is_some(&job.application_deadline)) {
            let deadline = *option::borrow(&job.application_deadline);
            assert!(timestamp <= deadline, EDeadlinePassed);
        };

        // Check job is still open
        assert!(job.status == JOB_STATUS_OPEN, EInvalidStatus);

        // Use Option<T> for optional fields
        let cv_blob_id = if (has_cv_blob) {
            option::some(cv_blob_id_value)
        } else {
            option::none()
        };

        let portfolio_url = if (has_portfolio) {
            option::some(portfolio_url_value)
        } else {
            option::none()
        };

        // Seal integration - Encrypted CV blob ID from Walrus
        // CV is encrypted with Seal and stored on Walrus
        let encrypted_cv_blob_id = if (has_encrypted_cv) {
            option::some(encrypted_cv_blob_id_value)
        } else {
            option::none()
        };

        let application = Application {
            id: object::new(ctx),
            job_id: object::id(job),
            candidate: sender,
            pod_id,
            cover_letter,
            cv_blob_id,
            portfolio_url,
            encrypted_cv_blob_id,
            applied_at: timestamp,
            status: 0, // Pending
        };

        let application_id = object::id(&application);

        // Add application to job's vector - Mandatory requirement
        vector::push_back(&mut job.applications, application_id);

        // Update registry
        registry.total_applications = registry.total_applications + 1;

        // Emit event
        event::emit(ApplicationSubmittedEvent {
            application_id,
            job_id: object::id(job),
            candidate: sender,
            pod_id,
            timestamp,
        });

        // Transfer application to candidate
        transfer::public_transfer(application, sender);
    }

    /// Hire a candidate - Access Control Implementation
    /// Now with automatic badge minting and reputation updates
    public entry fun hire_candidate(
        registry: &mut GlobalRegistry,
        badge_registry: &mut BadgeRegistry,
        employer_reputation: &mut ReputationProfile,
        candidate_reputation: &mut ReputationProfile,
        job: &mut JobPosting,
        candidate_addr: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Access Control - Only employer can hire - Mandatory requirement
        assert!(job.employer == sender, EUnauthorized);

        // Check job is still open
        assert!(job.status == JOB_STATUS_OPEN, EInvalidStatus);

        // Verify reputation profiles belong to correct users
        assert!(reputation::get_user_address(employer_reputation) == sender, EUnauthorized);
        assert!(reputation::get_user_address(candidate_reputation) == candidate_addr, EUnauthorized);

        // Update job status
        job.status = JOB_STATUS_FILLED;
        job.hired_candidate = option::some(candidate_addr);

        // Update registry
        registry.total_hires = registry.total_hires + 1;

        // ✅ NEW: Issue Employment Badge automatically
        employment_badge::issue_badge(
            badge_registry,
            candidate_addr,
            job.company_name,
            job.company_logo_url,
            job.title,
            object::id(job),
            job.description,
            clock,
            ctx
        );

        // ✅ NEW: Update employer reputation (increment total hires)
        reputation::increment_total_hires(employer_reputation);

        // ✅ NEW: Update candidate reputation (increment jobs completed)
        reputation::increment_jobs_completed(candidate_reputation);

        // Emit event
        event::emit(CandidateHiredEvent {
            job_id: object::id(job),
            employer: sender,
            candidate: candidate_addr,
            salary: job.salary,
            timestamp,
        });
    }

    /// Close job posting - Access Control
    public entry fun close_job(
        job: &mut JobPosting,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // Access Control - Only employer can close
        assert!(job.employer == sender, EUnauthorized);

        job.status = JOB_STATUS_CLOSED;
    }

    // ==================== View Functions ====================

    /// Get pod member count
    public fun get_pod_member_count(pod: &Pod): u64 {
        pod.member_count
    }

    /// Get pod reputation
    public fun get_pod_reputation(pod: &Pod): u64 {
        pod.reputation_score
    }

    /// Get job application count
    public fun get_job_application_count(job: &JobPosting): u64 {
        vector::length(&job.applications)
    }

    /// Check if job has salary
    public fun job_has_salary(job: &JobPosting): bool {
        option::is_some(&job.salary)
    }

    /// Get job salary (if exists)
    public fun get_job_salary(job: &JobPosting): u64 {
        assert!(option::is_some(&job.salary), EInvalidInput);
        *option::borrow(&job.salary)
    }

    /// Check if job has deadline
    public fun job_has_deadline(job: &JobPosting): bool {
        option::is_some(&job.application_deadline)
    }

    /// Get job status
    public fun get_job_status(job: &JobPosting): u8 {
        job.status
    }

    /// Get registry stats
    public fun get_registry_stats(registry: &GlobalRegistry): (u64, u64, u64, u64) {
        (registry.total_pods, registry.total_jobs, registry.total_applications, registry.total_hires)
    }

    // ==================== Seal + Walrus CV Access Functions ====================

    /// Get encrypted CV blob ID - Only accessible by employer and candidate
    /// This function enforces access control for privacy
    public fun get_encrypted_cv_blob_id(
        application: &Application,
        job: &JobPosting,
        ctx: &TxContext
    ): Option<String> {
        let caller = tx_context::sender(ctx);

        // Only employer (job owner) or candidate can access encrypted CV
        assert!(
            caller == job.employer || caller == application.candidate,
            EUnauthorized
        );

        application.encrypted_cv_blob_id
    }

    /// Get regular CV blob ID - Only accessible by employer and candidate
    public fun get_cv_blob_id(
        application: &Application,
        job: &JobPosting,
        ctx: &TxContext
    ): Option<String> {
        let caller = tx_context::sender(ctx);

        // Only employer (job owner) or candidate can access CV
        assert!(
            caller == job.employer || caller == application.candidate,
            EUnauthorized
        );

        application.cv_blob_id
    }

    /// Check if application has encrypted CV
    public fun has_encrypted_cv(application: &Application): bool {
        option::is_some(&application.encrypted_cv_blob_id)
    }

    /// Check if application has regular CV
    public fun has_cv(application: &Application): bool {
        option::is_some(&application.cv_blob_id)
    }

    // ==================== Test-Only Functions ====================

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        let registry = GlobalRegistry {
            id: object::new(ctx),
            total_pods: 0,
            total_jobs: 0,
            total_applications: 0,
            total_hires: 0,
        };
        transfer::share_object(registry);
    }
}

