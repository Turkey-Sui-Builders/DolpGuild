/// DolpGuild - Admin Module for Contract Upgradeability
/// Implements versioned object pattern and controlled upgrades
module dolphguild::admin {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use sui::clock::{Self, Clock};

    // ==================== Error Codes ====================
    const EUnauthorized: u64 = 1;
    const EInvalidVersion: u64 = 2;
    const EMigrationAlreadyDone: u64 = 3;

    // ==================== Versioning ====================
    const CURRENT_VERSION: u64 = 3; // V3 with all features

    // ==================== Core Structs ====================

    /// Admin capability - Only admin can upgrade contracts
    public struct AdminCap has key, store {
        id: UID,
        admin: address,
        created_at: u64,
    }

    /// Version control object - Shared Object
    public struct VersionRegistry has key {
        id: UID,
        current_version: u64,
        previous_version: u64,
        upgrade_count: u64,
        last_upgrade_time: u64,
        migration_completed: bool,
    }

    /// Migration state tracker
    public struct MigrationState has key {
        id: UID,
        from_version: u64,
        to_version: u64,
        migrated_pods: u64,
        migrated_jobs: u64,
        migrated_applications: u64,
        is_complete: bool,
        started_at: u64,
        completed_at: u64,
    }

    // ==================== Events ====================

    public struct AdminCapCreatedEvent has copy, drop {
        admin_cap_id: address,
        admin: address,
        timestamp: u64,
    }

    public struct VersionUpgradedEvent has copy, drop {
        from_version: u64,
        to_version: u64,
        timestamp: u64,
        admin: address,
    }

    public struct MigrationStartedEvent has copy, drop {
        from_version: u64,
        to_version: u64,
        timestamp: u64,
    }

    public struct MigrationCompletedEvent has copy, drop {
        from_version: u64,
        to_version: u64,
        migrated_pods: u64,
        migrated_jobs: u64,
        migrated_applications: u64,
        timestamp: u64,
    }

    // ==================== Init Function ====================

    /// Initialize admin capability and version registry
    fun init(ctx: &mut TxContext) {
        let admin = tx_context::sender(ctx);
        
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
            admin,
            created_at: 0, // Will be set with clock
        };

        // Create version registry (shared object)
        let version_registry = VersionRegistry {
            id: object::new(ctx),
            current_version: CURRENT_VERSION,
            previous_version: 0,
            upgrade_count: 0,
            last_upgrade_time: 0,
            migration_completed: true,
        };

        transfer::transfer(admin_cap, admin);
        transfer::share_object(version_registry);
    }

    // ==================== Admin Functions ====================

    /// Create admin capability (only for initial setup or new admins)
    public entry fun create_admin_cap(
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let admin = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let admin_cap = AdminCap {
            id: object::new(ctx),
            admin,
            created_at: timestamp,
        };

        event::emit(AdminCapCreatedEvent {
            admin_cap_id: object::uid_to_address(&admin_cap.id),
            admin,
            timestamp,
        });

        transfer::transfer(admin_cap, admin);
    }

    /// Upgrade version (only admin)
    public entry fun upgrade_version(
        admin_cap: &AdminCap,
        version_registry: &mut VersionRegistry,
        new_version: u64,
        clock: &Clock,
        ctx: &TxContext
    ) {
        let caller = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Only admin can upgrade
        assert!(caller == admin_cap.admin, EUnauthorized);
        
        // New version must be higher
        assert!(new_version > version_registry.current_version, EInvalidVersion);

        // Update version
        version_registry.previous_version = version_registry.current_version;
        version_registry.current_version = new_version;
        version_registry.upgrade_count = version_registry.upgrade_count + 1;
        version_registry.last_upgrade_time = timestamp;
        version_registry.migration_completed = false;

        event::emit(VersionUpgradedEvent {
            from_version: version_registry.previous_version,
            to_version: new_version,
            timestamp,
            admin: caller,
        });
    }

    /// Start migration process
    public entry fun start_migration(
        admin_cap: &AdminCap,
        version_registry: &VersionRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Only admin can start migration
        assert!(caller == admin_cap.admin, EUnauthorized);

        let migration_state = MigrationState {
            id: object::new(ctx),
            from_version: version_registry.previous_version,
            to_version: version_registry.current_version,
            migrated_pods: 0,
            migrated_jobs: 0,
            migrated_applications: 0,
            is_complete: false,
            started_at: timestamp,
            completed_at: 0,
        };

        event::emit(MigrationStartedEvent {
            from_version: version_registry.previous_version,
            to_version: version_registry.current_version,
            timestamp,
        });

        transfer::transfer(migration_state, caller);
    }

    /// Complete migration
    public entry fun complete_migration(
        admin_cap: &AdminCap,
        version_registry: &mut VersionRegistry,
        migration_state: MigrationState,
        clock: &Clock,
        ctx: &TxContext
    ) {
        let caller = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Only admin can complete migration
        assert!(caller == admin_cap.admin, EUnauthorized);
        assert!(!version_registry.migration_completed, EMigrationAlreadyDone);

        let MigrationState {
            id,
            from_version,
            to_version,
            migrated_pods,
            migrated_jobs,
            migrated_applications,
            is_complete: _,
            started_at: _,
            completed_at: _,
        } = migration_state;

        object::delete(id);

        // Mark migration as complete
        version_registry.migration_completed = true;

        event::emit(MigrationCompletedEvent {
            from_version,
            to_version,
            migrated_pods,
            migrated_jobs,
            migrated_applications,
            timestamp,
        });
    }

    // ==================== View Functions ====================

    /// Get current version
    public fun get_current_version(version_registry: &VersionRegistry): u64 {
        version_registry.current_version
    }

    /// Get previous version
    public fun get_previous_version(version_registry: &VersionRegistry): u64 {
        version_registry.previous_version
    }

    /// Check if migration is completed
    public fun is_migration_completed(version_registry: &VersionRegistry): bool {
        version_registry.migration_completed
    }

    /// Get admin address
    public fun get_admin_address(admin_cap: &AdminCap): address {
        admin_cap.admin
    }

    /// Verify version compatibility
    public fun verify_version(version_registry: &VersionRegistry, required_version: u64): bool {
        version_registry.current_version >= required_version
    }
}

