/// DolpGuild - Dynamic Fields for Applications
/// Demonstrates scalability with dynamic fields instead of vectors
module dolphguild::dynamic_applications {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::dynamic_field;
    use std::option::{Self, Option};

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const EApplicationNotFound: u64 = 2;
    const EAlreadyApplied: u64 = 3;

    // ==================== Core Structs ====================

    /// Job with dynamic field applications (scalable)
    public struct DynamicJobPosting has key {
        id: UID,
        employer: address,
        title: String,
        description: String,
        company_name: String,
        company_logo_url: String,
        salary: Option<u64>,
        status: u8,
        application_count: u64,
        created_at: u64,
    }

    /// Application stored as dynamic field
    public struct DynamicApplication has store {
        candidate: address,
        cover_letter: String,
        cv_blob_id: Option<String>,
        encrypted_cv_blob_id: Option<String>,
        applied_at: u64,
        status: u8,
    }

    /// Application key for dynamic field
    public struct ApplicationKey has copy, drop, store {
        candidate: address,
    }

    // ==================== Events ====================

    public struct DynamicApplicationSubmittedEvent has copy, drop {
        job_id: ID,
        candidate: address,
        timestamp: u64,
    }

    public struct DynamicApplicationWithdrawnEvent has copy, drop {
        job_id: ID,
        candidate: address,
        timestamp: u64,
    }

    // ==================== Job Functions ====================

    /// Create job with dynamic fields support
    public entry fun create_dynamic_job(
        title: String,
        description: String,
        company_name: String,
        company_logo_url: String,
        salary: Option<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let employer = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let job = DynamicJobPosting {
            id: object::new(ctx),
            employer,
            title,
            description,
            company_name,
            company_logo_url,
            salary,
            status: 0, // OPEN
            application_count: 0,
            created_at: timestamp,
        };

        transfer::share_object(job);
    }

    // ==================== Application Functions ====================

    /// Submit application using dynamic fields
    public entry fun submit_dynamic_application(
        job: &mut DynamicJobPosting,
        cover_letter: String,
        cv_blob_id: Option<String>,
        encrypted_cv_blob_id: Option<String>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let candidate = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let key = ApplicationKey { candidate };

        // Check if already applied
        assert!(!dynamic_field::exists_(&job.id, key), EAlreadyApplied);

        // Create application
        let application = DynamicApplication {
            candidate,
            cover_letter,
            cv_blob_id,
            encrypted_cv_blob_id,
            applied_at: timestamp,
            status: 0, // PENDING
        };

        // Add as dynamic field
        dynamic_field::add(&mut job.id, key, application);
        job.application_count = job.application_count + 1;

        event::emit(DynamicApplicationSubmittedEvent {
            job_id: object::id(job),
            candidate,
            timestamp,
        });
    }

    /// Withdraw application using dynamic fields
    public entry fun withdraw_dynamic_application(
        job: &mut DynamicJobPosting,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let candidate = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let key = ApplicationKey { candidate };

        // Check if application exists
        assert!(dynamic_field::exists_(&job.id, key), EApplicationNotFound);

        // Remove dynamic field
        let DynamicApplication {
            candidate: _,
            cover_letter: _,
            cv_blob_id: _,
            encrypted_cv_blob_id: _,
            applied_at: _,
            status: _,
        } = dynamic_field::remove(&mut job.id, key);

        job.application_count = job.application_count - 1;

        event::emit(DynamicApplicationWithdrawnEvent {
            job_id: object::id(job),
            candidate,
            timestamp,
        });
    }

    // ==================== View Functions ====================

    /// Check if candidate has applied
    public fun has_applied(job: &DynamicJobPosting, candidate: address): bool {
        let key = ApplicationKey { candidate };
        dynamic_field::exists_(&job.id, key)
    }

    /// Get application count (O(1) instead of O(n) with vectors)
    public fun get_application_count(job: &DynamicJobPosting): u64 {
        job.application_count
    }

    /// Get application details (if authorized)
    public fun get_application(
        job: &DynamicJobPosting,
        candidate: address,
        ctx: &TxContext
    ): (String, Option<String>, Option<String>, u64) {
        let caller = tx_context::sender(ctx);

        // Only employer or candidate can view
        assert!(caller == job.employer || caller == candidate, EUnauthorized);

        let key = ApplicationKey { candidate };
        assert!(dynamic_field::exists_(&job.id, key), EApplicationNotFound);

        let application = dynamic_field::borrow<ApplicationKey, DynamicApplication>(&job.id, key);

        (
            application.cover_letter,
            application.cv_blob_id,
            application.encrypted_cv_blob_id,
            application.applied_at
        )
    }

    /// Get encrypted CV blob ID (access control)
    public fun get_encrypted_cv(
        job: &DynamicJobPosting,
        candidate: address,
        ctx: &TxContext
    ): Option<String> {
        let caller = tx_context::sender(ctx);

        // Only employer or candidate can view
        assert!(caller == job.employer || caller == candidate, EUnauthorized);

        let key = ApplicationKey { candidate };
        assert!(dynamic_field::exists_(&job.id, key), EApplicationNotFound);

        let application = dynamic_field::borrow<ApplicationKey, DynamicApplication>(&job.id, key);
        application.encrypted_cv_blob_id
    }

    /// Get job employer
    public fun get_employer(job: &DynamicJobPosting): address {
        job.employer
    }

    /// Get job title
    public fun get_job_title(job: &DynamicJobPosting): String {
        job.title
    }

    /// Get job status
    public fun get_job_status(job: &DynamicJobPosting): u8 {
        job.status
    }
}

