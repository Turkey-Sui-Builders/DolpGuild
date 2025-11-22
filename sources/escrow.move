/// Smart Escrow System - Milestone-based payments for freelance work
module dolphguild::escrow {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::vector;
    use std::option::{Self, Option};

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const EInsufficientFunds: u64 = 2;
    const EMilestoneNotComplete: u64 = 3;
    const EMilestoneAlreadyPaid: u64 = 4;
    const EInvalidMilestone: u64 = 5;
    const EContractNotActive: u64 = 6;

    // ==================== Constants ====================
    const MILESTONE_STATUS_PENDING: u8 = 0;
    const MILESTONE_STATUS_IN_PROGRESS: u8 = 1;
    const MILESTONE_STATUS_COMPLETED: u8 = 2;
    const MILESTONE_STATUS_PAID: u8 = 3;

    const CONTRACT_STATUS_ACTIVE: u8 = 0;
    const CONTRACT_STATUS_COMPLETED: u8 = 1;
    const CONTRACT_STATUS_CANCELLED: u8 = 2;

    // ==================== Structs ====================
    
    /// Milestone definition
    public struct Milestone has store, drop, copy {
        title: String,
        description: String,
        payment_amount: u64,
        status: u8,
        completed_at: Option<u64>,
    }

    /// Freelance contract with escrow
    public struct FreelanceContract has key, store {
        id: UID,
        job_id: ID,
        employer: address,
        freelancer: address,
        
        // Escrow balance
        escrowed_funds: Balance<SUI>,
        total_amount: u64,
        
        // Milestones
        milestones: vector<Milestone>,
        current_milestone: u64,
        
        // Contract details
        title: String,
        description: String,
        status: u8,
        
        created_at: u64,
        deadline: Option<u64>,
    }

    // ==================== Events ====================
    
    public struct ContractCreatedEvent has copy, drop {
        contract_id: ID,
        employer: address,
        freelancer: address,
        total_amount: u64,
        milestone_count: u64,
        timestamp: u64,
    }

    public struct MilestoneCompletedEvent has copy, drop {
        contract_id: ID,
        milestone_index: u64,
        freelancer: address,
        timestamp: u64,
    }

    public struct PaymentReleasedEvent has copy, drop {
        contract_id: ID,
        milestone_index: u64,
        freelancer: address,
        amount: u64,
        timestamp: u64,
    }

    public struct ContractCompletedEvent has copy, drop {
        contract_id: ID,
        employer: address,
        freelancer: address,
        total_paid: u64,
        timestamp: u64,
    }

    // ==================== Functions ====================
    
    /// Create freelance contract with escrowed funds
    public entry fun create_contract(
        job_id: ID,
        freelancer_addr: address,
        title: String,
        description: String,
        milestone_titles: vector<String>,
        milestone_descriptions: vector<String>,
        milestone_amounts: vector<u64>,
        payment: Coin<SUI>,
        has_deadline: bool,
        deadline_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let employer = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);
        
        // Calculate total amount
        let mut total = 0u64;
        let mut i = 0;
        let milestone_count = vector::length(&milestone_amounts);
        
        while (i < milestone_count) {
            total = total + *vector::borrow(&milestone_amounts, i);
            i = i + 1;
        };
        
        // Verify payment covers total
        assert!(coin::value(&payment) >= total, EInsufficientFunds);
        
        // Create milestones
        let mut milestones = vector::empty<Milestone>();
        i = 0;
        while (i < milestone_count) {
            let milestone = Milestone {
                title: *vector::borrow(&milestone_titles, i),
                description: *vector::borrow(&milestone_descriptions, i),
                payment_amount: *vector::borrow(&milestone_amounts, i),
                status: MILESTONE_STATUS_PENDING,
                completed_at: option::none(),
            };
            vector::push_back(&mut milestones, milestone);
            i = i + 1;
        };
        
        let deadline = if (has_deadline) {
            option::some(deadline_ms)
        } else {
            option::none()
        };
        
        // Create contract with escrowed funds
        let contract = FreelanceContract {
            id: object::new(ctx),
            job_id,
            employer,
            freelancer: freelancer_addr,
            escrowed_funds: coin::into_balance(payment),
            total_amount: total,
            milestones,
            current_milestone: 0,
            title,
            description,
            status: CONTRACT_STATUS_ACTIVE,
            created_at: timestamp,
            deadline,
        };
        
        let contract_id = object::id(&contract);
        
        // Emit event
        event::emit(ContractCreatedEvent {
            contract_id,
            employer,
            freelancer: freelancer_addr,
            total_amount: total,
            milestone_count,
            timestamp,
        });
        
        // Share contract object
        transfer::share_object(contract);
    }

    /// Mark milestone as completed (freelancer)
    public entry fun complete_milestone(
        contract: &mut FreelanceContract,
        milestone_index: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Only freelancer can mark as complete
        assert!(contract.freelancer == sender, EUnauthorized);
        assert!(contract.status == CONTRACT_STATUS_ACTIVE, EContractNotActive);

        // Validate milestone index
        assert!(milestone_index < vector::length(&contract.milestones), EInvalidMilestone);

        // Get milestone and update status
        let milestone = vector::borrow_mut(&mut contract.milestones, milestone_index);
        assert!(milestone.status != MILESTONE_STATUS_PAID, EMilestoneAlreadyPaid);

        milestone.status = MILESTONE_STATUS_COMPLETED;
        milestone.completed_at = option::some(timestamp);

        // Emit event
        event::emit(MilestoneCompletedEvent {
            contract_id: object::id(contract),
            milestone_index,
            freelancer: sender,
            timestamp,
        });
    }

    /// Release payment for completed milestone (employer)
    public entry fun release_payment(
        contract: &mut FreelanceContract,
        milestone_index: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Only employer can release payment
        assert!(contract.employer == sender, EUnauthorized);
        assert!(contract.status == CONTRACT_STATUS_ACTIVE, EContractNotActive);

        // Validate milestone
        assert!(milestone_index < vector::length(&contract.milestones), EInvalidMilestone);

        let milestone = vector::borrow_mut(&mut contract.milestones, milestone_index);
        assert!(milestone.status == MILESTONE_STATUS_COMPLETED, EMilestoneNotComplete);
        assert!(milestone.status != MILESTONE_STATUS_PAID, EMilestoneAlreadyPaid);

        // Release payment from escrow
        let payment_amount = milestone.payment_amount;
        let payment_coin = coin::take(&mut contract.escrowed_funds, payment_amount, ctx);

        // Update milestone status
        milestone.status = MILESTONE_STATUS_PAID;

        // Transfer payment to freelancer
        transfer::public_transfer(payment_coin, contract.freelancer);

        // Emit event
        event::emit(PaymentReleasedEvent {
            contract_id: object::id(contract),
            milestone_index,
            freelancer: contract.freelancer,
            amount: payment_amount,
            timestamp,
        });

        // Check if all milestones are paid
        let all_paid = check_all_milestones_paid(contract);
        if (all_paid) {
            contract.status = CONTRACT_STATUS_COMPLETED;

            event::emit(ContractCompletedEvent {
                contract_id: object::id(contract),
                employer: contract.employer,
                freelancer: contract.freelancer,
                total_paid: contract.total_amount,
                timestamp,
            });
        };
    }

    /// Cancel contract and refund remaining funds (mutual agreement)
    public entry fun cancel_contract(
        contract: &mut FreelanceContract,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // Only employer or freelancer can cancel
        assert!(
            sender == contract.employer || sender == contract.freelancer,
            EUnauthorized
        );

        contract.status = CONTRACT_STATUS_CANCELLED;

        // Refund remaining escrowed funds to employer
        let remaining = balance::value(&contract.escrowed_funds);
        if (remaining > 0) {
            let refund = coin::take(&mut contract.escrowed_funds, remaining, ctx);
            transfer::public_transfer(refund, contract.employer);
        };
    }

    // ==================== Helper Functions ====================

    /// Check if all milestones are paid
    fun check_all_milestones_paid(contract: &FreelanceContract): bool {
        let mut i = 0;
        let len = vector::length(&contract.milestones);

        while (i < len) {
            let milestone = vector::borrow(&contract.milestones, i);
            if (milestone.status != MILESTONE_STATUS_PAID) {
                return false
            };
            i = i + 1;
        };

        true
    }

    // ==================== View Functions ====================

    /// Get contract status
    public fun get_contract_status(contract: &FreelanceContract): u8 {
        contract.status
    }

    /// Get milestone count
    public fun get_milestone_count(contract: &FreelanceContract): u64 {
        vector::length(&contract.milestones)
    }

    /// Get total escrowed amount
    public fun get_escrowed_amount(contract: &FreelanceContract): u64 {
        balance::value(&contract.escrowed_funds)
    }

    /// Get contract details
    public fun get_contract_info(contract: &FreelanceContract): (address, address, u64, u8) {
        (contract.employer, contract.freelancer, contract.total_amount, contract.status)
    }
}


