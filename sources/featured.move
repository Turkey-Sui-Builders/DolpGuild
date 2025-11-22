/// DolpGuild - Featured Jobs & Lottery System
/// Uses Sui Random object for fair selection
module dolphguild::featured {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::random::{Self, Random};
    use std::vector;
    use std::option::{Self, Option};

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const ENoJobsAvailable: u64 = 2;
    const ELotteryNotActive: u64 = 3;
    const EAlreadyEntered: u64 = 4;
    const EInsufficientEntries: u64 = 5;

    // ==================== Constants ====================
    const LOTTERY_STATUS_ACTIVE: u8 = 0;
    const LOTTERY_STATUS_DRAWING: u8 = 1;
    const LOTTERY_STATUS_COMPLETED: u8 = 2;

    // ==================== Core Structs ====================

    /// Featured Job of the Day - Shared Object
    public struct FeaturedJobRegistry has key {
        id: UID,
        current_featured_job: Option<ID>,
        featured_job_title: String,
        featured_job_company: String,
        last_update_time: u64,
        total_featured_count: u64,
    }

    /// Lottery system for fair job selection
    public struct JobLottery has key {
        id: UID,
        job_id: ID,
        job_title: String,
        company_name: String,
        entries: vector<address>,
        max_entries: u64,
        winner: Option<address>,
        status: u8,
        created_at: u64,
        drawn_at: u64,
    }

    /// Lottery entry ticket
    public struct LotteryTicket has key, store {
        id: UID,
        lottery_id: ID,
        participant: address,
        entry_number: u64,
        timestamp: u64,
    }

    // ==================== Events ====================

    public struct FeaturedJobSelectedEvent has copy, drop {
        job_id: ID,
        job_title: String,
        company_name: String,
        timestamp: u64,
    }

    public struct LotteryCreatedEvent has copy, drop {
        lottery_id: ID,
        job_id: ID,
        job_title: String,
        max_entries: u64,
        timestamp: u64,
    }

    public struct LotteryEnteredEvent has copy, drop {
        lottery_id: ID,
        participant: address,
        entry_number: u64,
        timestamp: u64,
    }

    public struct LotteryWinnerSelectedEvent has copy, drop {
        lottery_id: ID,
        winner: address,
        total_entries: u64,
        timestamp: u64,
    }

    // ==================== Init Function ====================

    fun init(ctx: &mut TxContext) {
        let featured_registry = FeaturedJobRegistry {
            id: object::new(ctx),
            current_featured_job: option::none(),
            featured_job_title: std::string::utf8(b"No featured job yet"),
            featured_job_company: std::string::utf8(b""),
            last_update_time: 0,
            total_featured_count: 0,
        };

        transfer::share_object(featured_registry);
    }

    // ==================== Featured Job Functions ====================

    /// Select random featured job of the day
    public entry fun select_featured_job(
        featured_registry: &mut FeaturedJobRegistry,
        job_id: ID,
        job_title: String,
        company_name: String,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);

        featured_registry.current_featured_job = option::some(job_id);
        featured_registry.featured_job_title = job_title;
        featured_registry.featured_job_company = company_name;
        featured_registry.last_update_time = timestamp;
        featured_registry.total_featured_count = featured_registry.total_featured_count + 1;

        event::emit(FeaturedJobSelectedEvent {
            job_id,
            job_title,
            company_name,
            timestamp,
        });
    }

    /// Randomly select featured job from available jobs using Random object
    public entry fun select_random_featured_job(
        featured_registry: &mut FeaturedJobRegistry,
        available_job_ids: vector<ID>,
        available_job_titles: vector<String>,
        available_job_companies: vector<String>,
        random: &Random,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let job_count = vector::length(&available_job_ids);
        assert!(job_count > 0, ENoJobsAvailable);

        // Generate random index
        let mut generator = random::new_generator(random, ctx);
        let random_index = random::generate_u64_in_range(&mut generator, 0, job_count - 1);

        let selected_job_id = *vector::borrow(&available_job_ids, random_index);
        let selected_title = *vector::borrow(&available_job_titles, random_index);
        let selected_company = *vector::borrow(&available_job_companies, random_index);

        select_featured_job(
            featured_registry,
            selected_job_id,
            selected_title,
            selected_company,
            clock,
            ctx
        );
    }

    // ==================== Lottery Functions ====================

    /// Create a lottery for a job position
    public entry fun create_job_lottery(
        job_id: ID,
        job_title: String,
        company_name: String,
        max_entries: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);

        let lottery = JobLottery {
            id: object::new(ctx),
            job_id,
            job_title,
            company_name,
            entries: vector::empty(),
            max_entries,
            winner: option::none(),
            status: LOTTERY_STATUS_ACTIVE,
            created_at: timestamp,
            drawn_at: 0,
        };

        let lottery_id = object::id(&lottery);

        event::emit(LotteryCreatedEvent {
            lottery_id,
            job_id,
            job_title,
            max_entries,
            timestamp,
        });

        transfer::share_object(lottery);
    }

    /// Enter the lottery
    public entry fun enter_lottery(
        lottery: &mut JobLottery,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let participant = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Check lottery is active
        assert!(lottery.status == LOTTERY_STATUS_ACTIVE, ELotteryNotActive);

        // Check not already entered
        assert!(!vector::contains(&lottery.entries, &participant), EAlreadyEntered);

        // Check max entries not reached
        assert!(vector::length(&lottery.entries) < lottery.max_entries, EInsufficientEntries);

        // Add entry
        vector::push_back(&mut lottery.entries, participant);
        let entry_number = vector::length(&lottery.entries);

        // Create ticket
        let ticket = LotteryTicket {
            id: object::new(ctx),
            lottery_id: object::id(lottery),
            participant,
            entry_number,
            timestamp,
        };

        event::emit(LotteryEnteredEvent {
            lottery_id: object::id(lottery),
            participant,
            entry_number,
            timestamp,
        });

        transfer::transfer(ticket, participant);
    }

    /// Draw lottery winner using Random object
    public entry fun draw_lottery_winner(
        lottery: &mut JobLottery,
        random: &Random,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);
        let entry_count = vector::length(&lottery.entries);

        // Check lottery is active
        assert!(lottery.status == LOTTERY_STATUS_ACTIVE, ELotteryNotActive);

        // Need at least 1 entry
        assert!(entry_count > 0, EInsufficientEntries);

        // Generate random winner index
        let mut generator = random::new_generator(random, ctx);
        let winner_index = random::generate_u64_in_range(&mut generator, 0, entry_count - 1);
        let winner = *vector::borrow(&lottery.entries, winner_index);

        // Update lottery
        lottery.winner = option::some(winner);
        lottery.status = LOTTERY_STATUS_COMPLETED;
        lottery.drawn_at = timestamp;

        event::emit(LotteryWinnerSelectedEvent {
            lottery_id: object::id(lottery),
            winner,
            total_entries: entry_count,
            timestamp,
        });
    }

    // ==================== View Functions ====================

    /// Get current featured job
    public fun get_featured_job(featured_registry: &FeaturedJobRegistry): (Option<ID>, String, String) {
        (
            featured_registry.current_featured_job,
            featured_registry.featured_job_title,
            featured_registry.featured_job_company
        )
    }

    /// Get lottery winner
    public fun get_lottery_winner(lottery: &JobLottery): Option<address> {
        lottery.winner
    }

    /// Get lottery status
    public fun get_lottery_status(lottery: &JobLottery): u8 {
        lottery.status
    }

    /// Get lottery entry count
    public fun get_lottery_entry_count(lottery: &JobLottery): u64 {
        vector::length(&lottery.entries)
    }

    /// Check if address entered lottery
    public fun has_entered_lottery(lottery: &JobLottery, participant: address): bool {
        vector::contains(&lottery.entries, &participant)
    }
}

