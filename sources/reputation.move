/// Reputation System - Two-sided rating mechanism
module dolphguild::reputation {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use std::vector;

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const EAlreadyRated: u64 = 2;
    const EInvalidRating: u64 = 3;
    const ESelfRating: u64 = 4;

    // ==================== Constants ====================
    const MIN_RATING: u8 = 1;
    const MAX_RATING: u8 = 5;

    const BADGE_TOP_EMPLOYER: u8 = 0;
    const BADGE_RISING_STAR: u8 = 1;
    const BADGE_FAST_RESPONDER: u8 = 2;
    const BADGE_EARLY_ADOPTER: u8 = 3;

    // ==================== Structs ====================
    
    /// User reputation profile
    public struct ReputationProfile has key, store {
        id: UID,
        user: address,
        
        // Employer metrics
        employer_rating_sum: u64,
        employer_rating_count: u64,
        total_hires: u64,
        
        // Candidate metrics
        candidate_rating_sum: u64,
        candidate_rating_count: u64,
        total_jobs_completed: u64,
        
        // Behavioral metrics
        response_time_avg_hours: u64,
        show_up_rate: u64, // Percentage (0-100)
        
        // Badges earned
        badges: vector<u8>,
        
        created_at: u64,
    }

    /// Individual rating record
    public struct Rating has key, store {
        id: UID,
        job_id: ID,
        rater: address,
        rated_user: address,
        rating: u8, // 1-5
        review: String,
        rating_type: u8, // 0: Employer rating, 1: Candidate rating
        created_at: u64,
    }

    /// Badge NFT (Display Object)
    public struct Badge has key, store {
        id: UID,
        owner: address,
        badge_type: u8,
        title: String,
        description: String,
        image_url: String,
        earned_at: u64,
    }

    // ==================== Events ====================
    
    public struct RatingSubmittedEvent has copy, drop {
        rating_id: ID,
        rater: address,
        rated_user: address,
        rating: u8,
        job_id: ID,
        timestamp: u64,
    }

    public struct BadgeEarnedEvent has copy, drop {
        badge_id: ID,
        user: address,
        badge_type: u8,
        timestamp: u64,
    }

    public struct ReputationUpdatedEvent has copy, drop {
        user: address,
        new_avg_rating: u64,
        total_ratings: u64,
        timestamp: u64,
    }

    // ==================== Functions ====================
    
    /// Create reputation profile for new user
    public entry fun create_reputation_profile(
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let profile = ReputationProfile {
            id: object::new(ctx),
            user: sender,
            employer_rating_sum: 0,
            employer_rating_count: 0,
            total_hires: 0,
            candidate_rating_sum: 0,
            candidate_rating_count: 0,
            total_jobs_completed: 0,
            response_time_avg_hours: 0,
            show_up_rate: 100,
            badges: vector::empty(),
            created_at: timestamp,
        };

        transfer::public_share_object(profile);
    }

    /// Submit rating for employer or candidate
    public entry fun submit_rating(
        profile: &mut ReputationProfile,
        job_id: ID,
        rated_user: address,
        rating_value: u8,
        review: String,
        is_employer_rating: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);
        
        // Validations
        assert!(sender != rated_user, ESelfRating);
        assert!(rating_value >= MIN_RATING && rating_value <= MAX_RATING, EInvalidRating);
        assert!(profile.user == rated_user, EUnauthorized);
        
        let rating_type = if (is_employer_rating) { 0 } else { 1 };
        
        // Create rating record
        let rating = Rating {
            id: object::new(ctx),
            job_id,
            rater: sender,
            rated_user,
            rating: rating_value,
            review,
            rating_type,
            created_at: timestamp,
        };
        
        let rating_id = object::id(&rating);
        
        // Update profile
        if (is_employer_rating) {
            profile.employer_rating_sum = profile.employer_rating_sum + (rating_value as u64);
            profile.employer_rating_count = profile.employer_rating_count + 1;
        } else {
            profile.candidate_rating_sum = profile.candidate_rating_sum + (rating_value as u64);
            profile.candidate_rating_count = profile.candidate_rating_count + 1;
        };
        
        // Emit events
        event::emit(RatingSubmittedEvent {
            rating_id,
            rater: sender,
            rated_user,
            rating: rating_value,
            job_id,
            timestamp,
        });
        
        // Transfer rating to rater
        transfer::public_transfer(rating, sender);
    }

    /// Award badge to user
    public entry fun award_badge(
        profile: &mut ReputationProfile,
        badge_type: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);
        let user = profile.user;

        // Check if badge already earned
        let mut i = 0;
        let len = vector::length(&profile.badges);
        let mut already_has = false;
        while (i < len) {
            if (*vector::borrow(&profile.badges, i) == badge_type) {
                already_has = true;
                break
            };
            i = i + 1;
        };

        assert!(!already_has, EAlreadyRated);

        // Add badge to profile
        vector::push_back(&mut profile.badges, badge_type);

        // Create badge NFT
        let (title, description, image_url) = get_badge_metadata(badge_type);

        let badge = Badge {
            id: object::new(ctx),
            owner: user,
            badge_type,
            title,
            description,
            image_url,
            earned_at: timestamp,
        };

        let badge_id = object::id(&badge);

        // Emit event
        event::emit(BadgeEarnedEvent {
            badge_id,
            user,
            badge_type,
            timestamp,
        });

        // Transfer badge to user
        transfer::public_transfer(badge, user);
    }

    /// Get badge metadata
    fun get_badge_metadata(badge_type: u8): (String, String, String) {
        use std::string;

        if (badge_type == BADGE_TOP_EMPLOYER) {
            (
                string::utf8(b"Top Employer"),
                string::utf8(b"Achieved 4.5+ rating with 10+ hires"),
                string::utf8(b"https://dolphguild.io/badges/top-employer.png")
            )
        } else if (badge_type == BADGE_RISING_STAR) {
            (
                string::utf8(b"Rising Star"),
                string::utf8(b"Achieved 4.5+ rating with 3+ completed jobs"),
                string::utf8(b"https://dolphguild.io/badges/rising-star.png")
            )
        } else if (badge_type == BADGE_FAST_RESPONDER) {
            (
                string::utf8(b"Fast Responder"),
                string::utf8(b"Average response time under 24 hours"),
                string::utf8(b"https://dolphguild.io/badges/fast-responder.png")
            )
        } else {
            (
                string::utf8(b"Early Adopter"),
                string::utf8(b"One of the first 1000 users"),
                string::utf8(b"https://dolphguild.io/badges/early-adopter.png")
            )
        }
    }

    /// Update hire count
    public entry fun increment_hire_count(
        profile: &mut ReputationProfile,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(profile.user == sender, EUnauthorized);

        profile.total_hires = profile.total_hires + 1;
    }

    /// Update job completion count
    public entry fun increment_job_completion(
        profile: &mut ReputationProfile,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(profile.user == sender, EUnauthorized);

        profile.total_jobs_completed = profile.total_jobs_completed + 1;
    }

    // ==================== View Functions ====================

    /// Get employer average rating
    public fun get_employer_avg_rating(profile: &ReputationProfile): u64 {
        if (profile.employer_rating_count == 0) {
            return 0
        };
        profile.employer_rating_sum / profile.employer_rating_count
    }

    /// Get candidate average rating
    public fun get_candidate_avg_rating(profile: &ReputationProfile): u64 {
        if (profile.candidate_rating_count == 0) {
            return 0
        };
        profile.candidate_rating_sum / profile.candidate_rating_count
    }

    /// Get total badges earned
    public fun get_badge_count(profile: &ReputationProfile): u64 {
        vector::length(&profile.badges)
    }

    /// Check if user has specific badge
    public fun has_badge(profile: &ReputationProfile, badge_type: u8): bool {
        let mut i = 0;
        let len = vector::length(&profile.badges);
        while (i < len) {
            if (*vector::borrow(&profile.badges, i) == badge_type) {
                return true
            };
            i = i + 1;
        };
        false
    }

    /// Get profile stats
    public fun get_profile_stats(profile: &ReputationProfile): (u64, u64, u64, u64) {
        (
            get_employer_avg_rating(profile),
            get_candidate_avg_rating(profile),
            profile.total_hires,
            profile.total_jobs_completed
        )
    }

    /// Get user address from profile
    public fun get_user_address(profile: &ReputationProfile): address {
        profile.user
    }

    /// Increment total hires (for employer) - called by hire_candidate
    public fun increment_total_hires(profile: &mut ReputationProfile) {
        profile.total_hires = profile.total_hires + 1;
    }

    /// Increment jobs completed (for candidate) - called by hire_candidate
    public fun increment_jobs_completed(profile: &mut ReputationProfile) {
        profile.total_jobs_completed = profile.total_jobs_completed + 1;
    }
}


