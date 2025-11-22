# 🚀 DolpGuild Deployment Checklist

## Pre-Deployment Verification

### ✅ Code Quality
- [x] All modules compile successfully
- [x] No compilation errors
- [x] Warnings documented and acceptable
- [x] Code follows Move best practices
- [x] Access control implemented correctly
- [x] Events emit for all major actions

### ✅ Feature Completeness
- [x] Core platform functionality (pods, jobs, applications)
- [x] Reputation system with ratings and badges
- [x] Employment badge NFTs (soulbound)
- [x] Smart escrow with milestones
- [x] Walrus integration for CV storage
- [x] Clock integration for timestamps
- [x] Display Object for NFT visualization

### ✅ Documentation
- [x] README.md - Project overview
- [x] DEPLOYMENT.md - Deployment guide
- [x] ARCHITECTURE.md - Technical architecture
- [x] API_REFERENCE.md - API documentation
- [x] EXAMPLES.md - Usage examples
- [x] PROJECT_SUMMARY.md - Implementation summary

---

## Deployment Steps

### 1. Environment Setup

```bash
# Check Sui CLI version
sui --version

# Check active network
sui client active-env

# Switch to testnet
sui client switch --env testnet

# Check active address
sui client active-address

# Check balance (need at least 1 SUI for deployment)
sui client gas
```

### 2. Build Verification

```bash
# Navigate to project directory
cd /Users/muhammedakinci/Desktop/DolpGuild

# Clean build
rm -rf build/

# Build project
sui move build

# Expected output: "BUILDING DolpGuild" with warnings (acceptable)
```

### 3. Testnet Deployment

```bash
# Deploy to testnet
sui client publish --gas-budget 100000000

# Save the output! You'll need:
# - Package ID
# - GlobalRegistry object ID
# - BadgeRegistry object ID
# - Transaction digest
```

### 4. Post-Deployment Verification

```bash
# Verify package deployment
sui client object <PACKAGE_ID>

# Verify GlobalRegistry
sui client object <GLOBAL_REGISTRY_ID>

# Verify BadgeRegistry
sui client object <BADGE_REGISTRY_ID>

# Check transaction
sui client transaction <TX_DIGEST>
```

---

## Testing on Testnet

### Test Scenario 1: Create Pod

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function create_pod \
  --args <GLOBAL_REGISTRY_ID> "Developer Pod" "Community for developers" \
  --gas-budget 10000000
```

### Test Scenario 2: Join Pod

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function join_pod \
  --args <POD_ID> <GLOBAL_REGISTRY_ID> \
  --gas-budget 10000000
```

### Test Scenario 3: Post Job

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function post_job \
  --args <POD_ID> <GLOBAL_REGISTRY_ID> "Senior Move Developer" "Looking for experienced Move developer" "Remote" "0" "100000" "1735689600000" <CLOCK_ID> \
  --gas-budget 10000000
```

### Test Scenario 4: Submit Application

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function submit_application \
  --args <JOB_ID> <POD_ID> "I have 5 years of Move experience" "walrus_blob_id_123" <CLOCK_ID> \
  --gas-budget 10000000
```

### Test Scenario 5: Create Reputation Profile

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module reputation \
  --function create_reputation_profile \
  --args <CLOCK_ID> \
  --gas-budget 10000000
```

---

## Mainnet Deployment

### Prerequisites
- [ ] All testnet tests passed
- [ ] No critical issues found
- [ ] Gas costs estimated
- [ ] Sufficient SUI balance (recommend 2-3 SUI)
- [ ] Backup of all deployment data

### Deployment Command

```bash
# Switch to mainnet
sui client switch --env mainnet

# Verify balance
sui client gas

# Deploy
sui client publish --gas-budget 100000000

# IMPORTANT: Save all output immediately!
```

---

## Post-Deployment Tasks

### 1. Documentation Update
- [ ] Update README with package ID
- [ ] Update EXAMPLES with real object IDs
- [ ] Create deployment report
- [ ] Document gas costs

### 2. Object ID Registry

Create a file `DEPLOYED_OBJECTS.md`:

```markdown
# Deployed Objects

## Testnet
- Package ID: 0x...
- GlobalRegistry: 0x...
- BadgeRegistry: 0x...
- Deployment TX: 0x...
- Deployment Date: YYYY-MM-DD

## Mainnet
- Package ID: 0x...
- GlobalRegistry: 0x...
- BadgeRegistry: 0x...
- Deployment TX: 0x...
- Deployment Date: YYYY-MM-DD
```

### 3. Verification
- [ ] Verify on SuiScan/Suivision
- [ ] Check Display Object rendering
- [ ] Test all public functions
- [ ] Verify events emission
- [ ] Test escrow system

---

## Troubleshooting

### Issue: Insufficient Gas
**Solution**: Request testnet SUI from faucet
```bash
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
  --header 'Content-Type: application/json' \
  --data-raw '{"FixedAmountRequest":{"recipient":"<YOUR_ADDRESS>"}}'
```

### Issue: Build Fails
**Solution**: Check Sui version compatibility
```bash
sui --version  # Should be 1.0.0 or higher
sui move build --dump-bytecode-as-base64  # Debug build
```

### Issue: Transaction Fails
**Solution**: Increase gas budget
```bash
# Try with higher gas budget
--gas-budget 200000000
```

---

## Security Checklist

- [x] Access control on all sensitive functions
- [x] Input validation implemented
- [x] No hardcoded addresses
- [x] Proper error handling
- [x] Event emission for auditing
- [x] Escrow protection
- [x] Soulbound NFT enforcement

---

## Monitoring

### After Deployment

1. **Monitor Events**
   - Track PodCreatedEvent
   - Track JobPostedEvent
   - Track ApplicationSubmittedEvent
   - Track CandidateHiredEvent

2. **Monitor Gas Usage**
   - Track average gas per function
   - Optimize high-cost operations

3. **Monitor Object Creation**
   - Track total pods created
   - Track total jobs posted
   - Track total applications

---

## Rollback Plan

If critical issues found:

1. **Stop promoting the package**
2. **Document the issue**
3. **Fix the code**
4. **Deploy new version**
5. **Migrate data if needed**

Note: Move packages are immutable, so you'll need to deploy a new version.

---

## Success Criteria

- [x] Package deploys successfully
- [ ] All test scenarios pass on testnet
- [ ] Events emit correctly
- [ ] Display Objects render properly
- [ ] Gas costs are reasonable (<$1 per transaction)
- [ ] No security vulnerabilities
- [ ] Documentation is complete

---

## Contact & Support

- **Sui Discord**: https://discord.gg/sui
- **Sui Docs**: https://docs.sui.io
- **SuiScan**: https://suiscan.xyz
- **Suivision**: https://suivision.xyz

---

**Status**: Ready for Deployment ✅  
**Last Updated**: 2025-11-22  
**Version**: 1.0.0

