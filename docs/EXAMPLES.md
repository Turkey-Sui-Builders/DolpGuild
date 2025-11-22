# 📖 DolpGuild Usage Examples

Real-world examples for interacting with DolpGuild smart contracts.

---

## 🎯 Complete Workflow Example

### Scenario: Hiring a Move Developer

**Actors:**
- **Alice** - Employer at Mysten Labs
- **Bob** - Move developer looking for work
- **Developer Pod** - Community of blockchain developers

### Step 1: Alice Creates Developer Pod

```bash
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function create_pod \
  --args \
    $REGISTRY_ID \
    "Developer Pod" \
    "Elite blockchain developers specializing in Move and Rust" \
    "Engineering" \
    "https://dolphguild.io/pods/developer.png" \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Pod created with ID: `0xPOD123...`
- Alice is the creator
- Initial reputation: 100

### Step 2: Bob Joins Developer Pod

```bash
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function join_pod \
  --args \
    $POD_ID \
    "0x6" \
  --gas-budget 5000000
```

**Result:**
- Bob added to pod members
- Pod member count: 1

### Step 3: Alice Posts Job Opening

```bash
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function post_job \
  --args \
    $REGISTRY_ID \
    $POD_ID \
    "Senior Move Developer" \
    "Build core smart contracts for Sui ecosystem. Work on cutting-edge blockchain technology." \
    "5+ years software engineering, 2+ years blockchain, Move/Rust expertise" \
    120000 \
    true \
    1735689600000 \
    true \
    0 \
    "Mysten Labs" \
    "https://mystenlabs.com/logo.png" \
    "Remote" \
    '["Move", "Rust", "Blockchain", "Smart Contracts"]' \
    "0x6" \
  --gas-budget 15000000
```

**Parameters Explained:**
- Salary: 120,000 SUI (has_salary: true)
- Deadline: 1735689600000 ms (has_deadline: true)
- Job type: 0 (Full-time)
- Required skills: Move, Rust, Blockchain, Smart Contracts

**Result:**
- Job posted with ID: `0xJOB456...`
- Status: OPEN (0)
- Applications: []

### Step 4: Bob Submits Application

```bash
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function submit_application \
  --args \
    $REGISTRY_ID \
    $JOB_ID \
    $POD_ID \
    "I have 6 years of experience in blockchain development, including 3 years with Move. I've built multiple DeFi protocols and contributed to Sui ecosystem projects. My expertise in smart contract security and optimization makes me an ideal fit for this role." \
    "walrus_blob_cv_abc123xyz" \
    true \
    "https://github.com/bob-developer" \
    true \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Application created with ID: `0xAPP789...`
- Job applications count: 1
- CV stored on Walrus: `walrus_blob_cv_abc123xyz`

### Step 5: Alice Reviews and Hires Bob

```bash
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function hire_candidate \
  --args \
    $REGISTRY_ID \
    $JOB_ID \
    $BOB_ADDRESS \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Job status: FILLED (2)
- Hired candidate: Bob's address
- Total hires in registry: +1

### Step 6: Issue Employment Badge to Bob

```bash
sui client call \
  --package $PACKAGE_ID \
  --module employment_badge \
  --function issue_badge \
  --args \
    $BADGE_REGISTRY_ID \
    $BOB_ADDRESS \
    "Mysten Labs" \
    "https://mystenlabs.com/logo.png" \
    "Senior Move Developer" \
    $JOB_ID \
    "Verified employment at Mysten Labs as Senior Move Developer. Contributed to core Sui smart contract development." \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Soulbound NFT badge created
- Transferred to Bob (non-transferable)
- Visible on SuiScan with company branding

### Step 7: Bob Rates Alice as Employer

```bash
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function submit_rating \
  --args \
    $ALICE_REPUTATION_PROFILE \
    $JOB_ID \
    $ALICE_ADDRESS \
    5 \
    "Excellent employer! Clear communication, fair compensation, and great team culture." \
    true \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Alice's employer rating updated
- Rating: 5/5
- Review recorded on-chain

### Step 8: Alice Rates Bob as Candidate

```bash
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function submit_rating \
  --args \
    $BOB_REPUTATION_PROFILE \
    $JOB_ID \
    $BOB_ADDRESS \
    5 \
    "Outstanding developer! Delivered high-quality code, met all deadlines, and showed great initiative." \
    false \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- Bob's candidate rating updated
- Rating: 5/5
- Eligible for "Rising Star" badge

---

## 💼 Freelance Project with Escrow

### Scenario: Website Development Project

**Actors:**
- **Carol** - Client needing website
- **Dave** - Freelance web developer

### Step 1: Create Freelance Contract with Milestones

```bash
sui client call \
  --package $PACKAGE_ID \
  --module escrow \
  --function create_contract \
  --args \
    $JOB_ID \
    $DAVE_ADDRESS \
    "E-commerce Website Development" \
    "Build full-stack e-commerce platform with payment integration" \
    '["Design Phase", "Frontend Development", "Backend Development", "Testing & Deployment"]' \
    '["UI/UX mockups and design system", "React frontend with shopping cart", "Node.js backend with database", "QA testing and production deployment"]' \
    '[3000, 4000, 5000, 3000]' \
    $PAYMENT_COIN \
    true \
    1738368000000 \
    "0x6" \
  --gas-budget 20000000
```

**Milestones:**
1. Design Phase - 3,000 SUI
2. Frontend Development - 4,000 SUI
3. Backend Development - 5,000 SUI
4. Testing & Deployment - 3,000 SUI
**Total:** 15,000 SUI (escrowed)

**Result:**
- Contract created (shared object)
- 15,000 SUI locked in escrow
- Status: ACTIVE

### Step 2: Dave Completes First Milestone

```bash
sui client call \
  --package $PACKAGE_ID \
  --module escrow \
  --function complete_milestone \
  --args \
    $CONTRACT_ID \
    0 \
    "0x6" \
  --gas-budget 5000000
```

**Result:**
- Milestone 0 status: COMPLETED
- Awaiting employer approval

### Step 3: Carol Releases Payment

```bash
sui client call \
  --package $PACKAGE_ID \
  --module escrow \
  --function release_payment \
  --args \
    $CONTRACT_ID \
    0 \
    "0x6" \
  --gas-budget 10000000
```

**Result:**
- 3,000 SUI transferred to Dave
- Milestone 0 status: PAID
- Remaining escrow: 12,000 SUI

### Step 4: Repeat for All Milestones

```bash
# Milestone 1
sui client call --package $PACKAGE_ID --module escrow --function complete_milestone --args $CONTRACT_ID 1 "0x6" --gas-budget 5000000
sui client call --package $PACKAGE_ID --module escrow --function release_payment --args $CONTRACT_ID 1 "0x6" --gas-budget 10000000

# Milestone 2
sui client call --package $PACKAGE_ID --module escrow --function complete_milestone --args $CONTRACT_ID 2 "0x6" --gas-budget 5000000
sui client call --package $PACKAGE_ID --module escrow --function release_payment --args $CONTRACT_ID 2 "0x6" --gas-budget 10000000

# Milestone 3
sui client call --package $PACKAGE_ID --module escrow --function complete_milestone --args $CONTRACT_ID 3 "0x6" --gas-budget 5000000
sui client call --package $PACKAGE_ID --module escrow --function release_payment --args $CONTRACT_ID 3 "0x6" --gas-budget 10000000
```

**Final Result:**
- All milestones paid
- Contract status: COMPLETED
- Total paid: 15,000 SUI
- Escrow balance: 0

---

## More examples in EXAMPLES_PART2.md...

