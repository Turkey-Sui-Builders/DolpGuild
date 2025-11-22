/// Comprehensive test suite for DolpGuild
#[test_only]
module dolphguild::dolphguild_tests {
    use dolphguild::dolphguild::{Self, GlobalRegistry, Pod, JobPosting, Application};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use std::string;
    use std::vector;

    // Test addresses
    const ADMIN: address = @0xAD;
    const EMPLOYER: address = @0xE1;
    const CANDIDATE1: address = @0xC1;
    const CANDIDATE2: address = @0xC2;

    // ==================== Helper Functions ====================
    
    fun setup_test(): Scenario {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the module
        {
            ts::next_tx(&mut scenario, ADMIN);
            dolphguild::init_for_testing(ts::ctx(&mut scenario));
        };
        
        scenario
    }

    fun create_test_clock(scenario: &mut Scenario): Clock {
        ts::next_tx(scenario, ADMIN);
        clock::create_for_testing(ts::ctx(scenario))
    }

    // ==================== Pod Tests ====================
    
    #[test]
    fun test_create_pod() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);
        
        // Create pod
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            
            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Developer Pod"),
                string::utf8(b"Community of blockchain developers"),
                string::utf8(b"Engineering"),
                string::utf8(b"https://dolphguild.io/pods/dev.png"),
                &clock,
                ts::ctx(&mut scenario)
            );
            
            // Verify registry updated
            let (total_pods, _, _, _) = dolphguild::get_registry_stats(&registry);
            assert!(total_pods == 1, 0);
            
            ts::return_shared(registry);
        };
        
        // Verify pod created
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let pod = ts::take_from_sender<Pod>(&scenario);
            assert!(dolphguild::get_pod_member_count(&pod) == 0, 1);
            assert!(dolphguild::get_pod_reputation(&pod) == 100, 2);
            ts::return_to_sender(&scenario, pod);
        };
        
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_join_pod() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);
        
        // Create pod
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Designer Pod"),
                string::utf8(b"UI/UX designers"),
                string::utf8(b"Design"),
                string::utf8(b"https://dolphguild.io/pods/design.png"),
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_shared(registry);
        };
        
        // Join pod
        ts::next_tx(&mut scenario, CANDIDATE1);
        {
            let mut pod = ts::take_from_address<Pod>(&scenario, EMPLOYER);
            dolphguild::join_pod(&mut pod, &clock, ts::ctx(&mut scenario));
            
            assert!(dolphguild::get_pod_member_count(&pod) == 1, 0);
            ts::return_to_address(EMPLOYER, pod);
        };
        
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ==================== Job Posting Tests ====================
    
    #[test]
    fun test_post_job() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);
        
        // Create pod first
        ts::next_tx(&mut scenario, EMPLOYER);
        let pod_id = {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Dev Pod"),
                string::utf8(b"Developers"),
                string::utf8(b"Engineering"),
                string::utf8(b"https://dolphguild.io/pods/dev.png"),
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_shared(registry);
            
            ts::next_tx(&mut scenario, EMPLOYER);
            let pod = ts::take_from_sender<Pod>(&scenario);
            let id = object::id(&pod);
            ts::return_to_sender(&scenario, pod);
            id
        };
        
        // Post job
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut skills = vector::empty<string::String>();
            vector::push_back(&mut skills, string::utf8(b"Move"));
            vector::push_back(&mut skills, string::utf8(b"Rust"));
            
            dolphguild::post_job(
                &mut registry,
                pod_id,
                string::utf8(b"Senior Move Developer"),
                string::utf8(b"Build smart contracts on Sui"),
                string::utf8(b"5+ years experience"),
                100000, // salary
                true, // has salary
                0, // deadline
                false, // no deadline
                0, // full-time
                string::utf8(b"Mysten Labs"),
                string::utf8(b"https://mystenlabs.com/logo.png"),
                string::utf8(b"Remote"),
                skills,
                &clock,
                ts::ctx(&mut scenario)
            );
            
            let (_, total_jobs, _, _) = dolphguild::get_registry_stats(&registry);
            assert!(total_jobs == 1, 0);
            
            ts::return_shared(registry);
        };
        
        // Verify job created
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let job = ts::take_from_sender<JobPosting>(&scenario);
            assert!(dolphguild::job_has_salary(&job), 1);
            assert!(dolphguild::get_job_salary(&job) == 100000, 2);
            assert!(dolphguild::get_job_application_count(&job) == 0, 3);
            ts::return_to_sender(&scenario, job);
        };
        
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_submit_application() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);

        // Setup: Create pod and job
        let (pod_id, _job_id) = {
            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);

            // Create pod
            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Dev Pod"),
                string::utf8(b"Developers"),
                string::utf8(b"Engineering"),
                string::utf8(b"https://dolphguild.io/pods/dev.png"),
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);

            ts::next_tx(&mut scenario, EMPLOYER);
            let pod = ts::take_from_sender<Pod>(&scenario);
            let p_id = object::id(&pod);
            ts::return_to_sender(&scenario, pod);

            // Post job
            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let skills = vector::empty<string::String>();

            dolphguild::post_job(
                &mut registry,
                p_id,
                string::utf8(b"Move Developer"),
                string::utf8(b"Build dApps"),
                string::utf8(b"Experience required"),
                80000,
                true,
                0,
                false,
                0,
                string::utf8(b"Sui Foundation"),
                string::utf8(b"https://sui.io/logo.png"),
                string::utf8(b"Remote"),
                skills,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);

            ts::next_tx(&mut scenario, EMPLOYER);
            let job = ts::take_from_sender<JobPosting>(&scenario);
            let j_id = object::id(&job);
            ts::return_to_sender(&scenario, job);

            (p_id, j_id)
        };

        // Submit application
        ts::next_tx(&mut scenario, CANDIDATE1);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut job = ts::take_from_address<JobPosting>(&scenario, EMPLOYER);

            dolphguild::submit_application(
                &mut registry,
                &mut job,
                pod_id,
                string::utf8(b"I'm a great Move developer!"),
                string::utf8(b"walrus_blob_123"),
                true, // has CV
                string::utf8(b"https://github.com/candidate1"),
                true, // has portfolio
                string::utf8(b"seal_encrypted_walrus_blob_456"), // encrypted CV blob ID
                true, // has encrypted CV
                &clock,
                ts::ctx(&mut scenario)
            );

            // Verify application added to job
            assert!(dolphguild::get_job_application_count(&job) == 1, 0);

            let (_, _, total_apps, _) = dolphguild::get_registry_stats(&registry);
            assert!(total_apps == 1, 1);

            ts::return_to_address(EMPLOYER, job);
            ts::return_shared(registry);
        };

        // Verify application created
        ts::next_tx(&mut scenario, CANDIDATE1);
        {
            let app = ts::take_from_sender<Application>(&scenario);
            ts::return_to_sender(&scenario, app);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_hire_candidate() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);

        // Setup: Create pod, job, and application
        let (pod_id, _) = {
            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);

            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Dev Pod"),
                string::utf8(b"Developers"),
                string::utf8(b"Engineering"),
                string::utf8(b"https://dolphguild.io/pods/dev.png"),
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);

            ts::next_tx(&mut scenario, EMPLOYER);
            let pod = ts::take_from_sender<Pod>(&scenario);
            let p_id = object::id(&pod);
            ts::return_to_sender(&scenario, pod);

            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let skills = vector::empty<string::String>();

            dolphguild::post_job(
                &mut registry,
                p_id,
                string::utf8(b"Move Developer"),
                string::utf8(b"Build dApps"),
                string::utf8(b"Experience required"),
                90000,
                true,
                0,
                false,
                0,
                string::utf8(b"Sui Foundation"),
                string::utf8(b"https://sui.io/logo.png"),
                string::utf8(b"Remote"),
                skills,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);

            ts::next_tx(&mut scenario, EMPLOYER);
            let job = ts::take_from_sender<JobPosting>(&scenario);
            let j_id = object::id(&job);
            ts::return_to_sender(&scenario, job);

            (p_id, j_id)
        };

        // Submit application
        ts::next_tx(&mut scenario, CANDIDATE1);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut job = ts::take_from_address<JobPosting>(&scenario, EMPLOYER);

            dolphguild::submit_application(
                &mut registry,
                &mut job,
                pod_id,
                string::utf8(b"Hire me!"),
                string::utf8(b""),
                false,
                string::utf8(b""),
                false,
                string::utf8(b"seal_encrypted_cv_789"), // encrypted CV
                true, // has encrypted CV
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_address(EMPLOYER, job);
            ts::return_shared(registry);
        };

        // Hire candidate
        ts::next_tx(&mut scenario, EMPLOYER);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut job = ts::take_from_sender<JobPosting>(&scenario);

            dolphguild::hire_candidate(
                &mut registry,
                &mut job,
                CANDIDATE1,
                &clock,
                ts::ctx(&mut scenario)
            );

            // Verify job status updated
            assert!(dolphguild::get_job_status(&job) == 2, 0); // FILLED

            let (_, _, _, total_hires) = dolphguild::get_registry_stats(&registry);
            assert!(total_hires == 1, 1);

            ts::return_to_sender(&scenario, job);
            ts::return_shared(registry);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // EUnauthorized
    fun test_unauthorized_hire() {
        let mut scenario = setup_test();
        let clock = create_test_clock(&mut scenario);

        // Setup
        let pod_id = {
            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);

            dolphguild::create_pod(
                &mut registry,
                string::utf8(b"Dev Pod"),
                string::utf8(b"Developers"),
                string::utf8(b"Engineering"),
                string::utf8(b"https://dolphguild.io/pods/dev.png"),
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);

            ts::next_tx(&mut scenario, EMPLOYER);
            let pod = ts::take_from_sender<Pod>(&scenario);
            let p_id = object::id(&pod);
            ts::return_to_sender(&scenario, pod);

            ts::next_tx(&mut scenario, EMPLOYER);
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let skills = vector::empty<string::String>();

            dolphguild::post_job(
                &mut registry,
                p_id,
                string::utf8(b"Developer"),
                string::utf8(b"Build"),
                string::utf8(b"Exp"),
                50000,
                true,
                0,
                false,
                0,
                string::utf8(b"Company"),
                string::utf8(b"logo.png"),
                string::utf8(b"Remote"),
                skills,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(registry);
            p_id
        };

        // Submit application first
        ts::next_tx(&mut scenario, CANDIDATE2);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut job = ts::take_from_address<JobPosting>(&scenario, EMPLOYER);

            dolphguild::submit_application(
                &mut registry,
                &mut job,
                pod_id,
                string::utf8(b"I want this job!"),
                string::utf8(b"walrus_cv_999"),
                true,
                string::utf8(b""),
                false,
                string::utf8(b"seal_encrypted_cv_999"),
                true,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_address(EMPLOYER, job);
            ts::return_shared(registry);
        };

        // Try to hire as non-employer (should fail)
        ts::next_tx(&mut scenario, CANDIDATE1);
        {
            let mut registry = ts::take_shared<GlobalRegistry>(&scenario);
            let mut job = ts::take_from_address<JobPosting>(&scenario, EMPLOYER);

            // This should abort with EUnauthorized
            dolphguild::hire_candidate(
                &mut registry,
                &mut job,
                CANDIDATE2,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_address(EMPLOYER, job);
            ts::return_shared(registry);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}


