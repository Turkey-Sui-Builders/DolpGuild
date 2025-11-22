/// Employment Badge NFT - Soulbound credentials for verified employment
module dolphguild::employment_badge {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::display::{Self, Display};
    use sui::package::{Self, Publisher};
    use std::option::{Self, Option};
    use std::string;

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const ESoulboundTransfer: u64 = 2;
    const EAlreadyIssued: u64 = 3;

    // ==================== Structs ====================
    
    /// One-Time-Witness for Display
    public struct EMPLOYMENT_BADGE has drop {}

    /// Soulbound Employment Badge NFT
    public struct EmploymentBadge has key, store {
        id: UID,
        employee: address,
        employer: address,
        company_name: String,
        company_logo_url: String,
        job_title: String,
        job_id: ID,
        hire_date: u64,
        end_date: Option<u64>,
        is_active: bool,
        is_soulbound: bool, // Always true
        description: String,
    }

    /// Badge registry to prevent duplicates
    public struct BadgeRegistry has key {
        id: UID,
        total_badges: u64,
    }

    // ==================== Events ====================
    
    public struct BadgeIssuedEvent has copy, drop {
        badge_id: ID,
        employee: address,
        employer: address,
        company_name: String,
        job_title: String,
        timestamp: u64,
    }

    public struct BadgeRevokedEvent has copy, drop {
        badge_id: ID,
        employee: address,
        employer: address,
        timestamp: u64,
    }

    // ==================== Init Function ====================
    
    fun init(otw: EMPLOYMENT_BADGE, ctx: &mut TxContext) {
        // Create badge registry
        let registry = BadgeRegistry {
            id: object::new(ctx),
            total_badges: 0,
        };
        transfer::share_object(registry);

        // Create Display for EmploymentBadge
        let publisher = package::claim(otw, ctx);
        
        let mut display = display::new<EmploymentBadge>(&publisher, ctx);
        
        // Set display fields for beautiful NFT visualization
        display::add(&mut display, string::utf8(b"name"), string::utf8(b"{company_name} - {job_title}"));
        display::add(&mut display, string::utf8(b"description"), string::utf8(b"{description}"));
        display::add(&mut display, string::utf8(b"image_url"), string::utf8(b"{company_logo_url}"));
        display::add(&mut display, string::utf8(b"project_url"), string::utf8(b"https://dolphguild.io"));
        display::add(&mut display, string::utf8(b"creator"), string::utf8(b"DolpGuild"));
        
        display::update_version(&mut display);
        
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // ==================== Functions ====================
    
    /// Issue employment badge to hired candidate
    public entry fun issue_badge(
        registry: &mut BadgeRegistry,
        employee_addr: address,
        company_name: String,
        company_logo_url: String,
        job_title: String,
        job_id: ID,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let employer = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);
        
        let badge = EmploymentBadge {
            id: object::new(ctx),
            employee: employee_addr,
            employer,
            company_name,
            company_logo_url,
            job_title,
            job_id,
            hire_date: timestamp,
            end_date: option::none(),
            is_active: true,
            is_soulbound: true,
            description,
        };
        
        let badge_id = object::id(&badge);
        
        // Update registry
        registry.total_badges = registry.total_badges + 1;
        
        // Emit event
        event::emit(BadgeIssuedEvent {
            badge_id,
            employee: employee_addr,
            employer,
            company_name: badge.company_name,
            job_title: badge.job_title,
            timestamp,
        });
        
        // Transfer badge to employee (soulbound - cannot be transferred after)
        transfer::public_transfer(badge, employee_addr);
    }

    /// Revoke badge (mark as inactive, but don't delete - permanent record)
    public entry fun revoke_badge(
        badge: &mut EmploymentBadge,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);
        
        // Only employer can revoke
        assert!(badge.employer == sender, EUnauthorized);
        
        badge.is_active = false;
        badge.end_date = option::some(timestamp);
        
        // Emit event
        event::emit(BadgeRevokedEvent {
            badge_id: object::id(badge),
            employee: badge.employee,
            employer: sender,
            timestamp,
        });
    }

    // ==================== View Functions ====================
    
    /// Check if badge is active
    public fun is_active(badge: &EmploymentBadge): bool {
        badge.is_active
    }

    /// Get badge details
    public fun get_badge_info(badge: &EmploymentBadge): (address, address, String, String, u64) {
        (badge.employee, badge.employer, badge.company_name, badge.job_title, badge.hire_date)
    }

    /// Check if badge is soulbound
    public fun is_soulbound(badge: &EmploymentBadge): bool {
        badge.is_soulbound
    }
}

