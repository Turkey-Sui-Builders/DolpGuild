# 🚀 DolpGuild Deployment Guide

Complete guide for deploying DolpGuild smart contracts to Sui blockchain.

---

## 📋 Prerequisites

### 1. Install Sui CLI

**macOS/Linux:**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

**Verify installation:**
```bash
sui --version
```

### 2. Create Wallet

```bash
# Create new wallet
sui client new-address ed25519

# Check active address
sui client active-address

# List all addresses
sui client addresses
```

### 3. Get Testnet SUI

**Option 1: Discord Faucet**
1. Join Sui Discord: https://discord.gg/sui
2. Go to #testnet-faucet channel
3. Request tokens: `!faucet <YOUR_ADDRESS>`

**Option 2: CLI Faucet**
```bash
sui client faucet
```

**Check balance:**
```bash
sui client gas
```

---

## 🏗️ Build & Test

### Build the Package

```bash
# Navigate to project directory
cd DolpGuild

# Build
sui move build

# Expected output:
# BUILDING DolpGuild
# Successfully built package
```

### Run Tests

```bash
# Run all tests
sui move test

# Run with verbose output
sui move test --verbose

# Run specific test
sui move test test_create_pod

# Run with gas profiling
sui move test --gas-limit 100000000
```

**Expected test results:**
```
Running Move unit tests
[ PASS    ] dolphguild::dolphguild_tests::test_create_pod
[ PASS    ] dolphguild::dolphguild_tests::test_join_pod
[ PASS    ] dolphguild::dolphguild_tests::test_post_job
[ PASS    ] dolphguild::dolphguild_tests::test_submit_application
[ PASS    ] dolphguild::dolphguild_tests::test_hire_candidate
[ PASS    ] dolphguild::dolphguild_tests::test_unauthorized_hire
Test result: OK. Total tests: 6; passed: 6; failed: 0
```

---

## 📦 Deploy to Testnet

### 1. Deploy Package

```bash
sui client publish --gas-budget 100000000
```

### 2. Save Deployment Info

After successful deployment, you'll see output like:

```
----- Transaction Digest ----
<TRANSACTION_HASH>

----- Transaction Data ----
...

----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0x1234... , Owner: Immutable
  - ID: 0x5678... , Owner: Shared    <- GlobalRegistry
  - ID: 0x9abc... , Owner: Account(<YOUR_ADDRESS>)

----- Events ----
...

----- Object Changes ----
Created Objects:
  - ObjectID: 0x1234...
    Digest: ...
    ObjectType: 0xPACKAGE_ID::dolphguild::DOLPHGUILD
```

**Save these values:**
```bash
# Create deployment info file
cat > deployment.json << EOF
{
  "network": "testnet",
  "packageId": "0x1234...",
  "globalRegistryId": "0x5678...",
  "modules": {
    "dolphguild": "0x1234::dolphguild::dolphguild",
    "reputation": "0x1234::dolphguild::reputation",
    "employment_badge": "0x1234::dolphguild::employment_badge",
    "escrow": "0x1234::dolphguild::escrow"
  },
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "deployer": "$(sui client active-address)"
}
EOF
```

---

## 🧪 Interact with Deployed Contract

### Create a Pod

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function create_pod \
  --args \
    <GLOBAL_REGISTRY_ID> \
    "Developer Pod" \
    "Community of blockchain developers" \
    "Engineering" \
    "https://dolphguild.io/pods/dev.png" \
    <CLOCK_OBJECT_ID> \
  --gas-budget 10000000
```

### Post a Job

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function post_job \
  --args \
    <GLOBAL_REGISTRY_ID> \
    <POD_ID> \
    "Senior Move Developer" \
    "Build smart contracts on Sui" \
    "5+ years experience" \
    100000 \
    true \
    0 \
    false \
    0 \
    "Mysten Labs" \
    "https://mystenlabs.com/logo.png" \
    "Remote" \
    '["Move","Rust"]' \
    <CLOCK_OBJECT_ID> \
  --gas-budget 10000000
```

### Query Objects

```bash
# Get all objects owned by your address
sui client objects

# Get specific object details
sui client object <OBJECT_ID>

# Get dynamic fields
sui client dynamic-fields <OBJECT_ID>
```

---

## 🌐 Deploy to Mainnet

### 1. Switch to Mainnet

```bash
# Add mainnet environment
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443

# Switch to mainnet
sui client switch --env mainnet

# Verify
sui client active-env
```

### 2. Get Mainnet SUI

You'll need real SUI tokens for mainnet deployment:
- Buy from exchanges (Binance, OKX, etc.)
- Transfer to your Sui address

### 3. Deploy

```bash
# Deploy to mainnet
sui client publish --gas-budget 100000000

# Save mainnet deployment info
cat > deployment-mainnet.json << EOF
{
  "network": "mainnet",
  "packageId": "<MAINNET_PACKAGE_ID>",
  "globalRegistryId": "<MAINNET_REGISTRY_ID>",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

---

## 🔍 Verify Deployment

### 1. Check on Sui Explorer

**Testnet:**
https://suiexplorer.com/?network=testnet

**Mainnet:**
https://suiexplorer.com/?network=mainnet

Search for your package ID or transaction hash.

### 2. Verify Contract Code

```bash
# Get package info
sui client object <PACKAGE_ID> --json

# Verify module bytecode
sui move verify-bytecode --package-path . --package-id <PACKAGE_ID>
```

---

## 📊 Monitor Contract

### View Events

```bash
# Query events by transaction
sui client events --tx-digest <TX_DIGEST>

# Query events by event type
sui client events --event-type <PACKAGE_ID>::dolphguild::JobPostedEvent
```

### Track Gas Usage

```bash
# Get transaction details
sui client transaction <TX_DIGEST>

# View gas costs
sui client gas
```

---

## 🛠️ Troubleshooting

### Build Errors

**Error: "Package not found"**
```bash
# Ensure you're in the correct directory
pwd  # Should show .../DolpGuild

# Check Move.toml exists
ls Move.toml
```

**Error: "Dependency resolution failed"**
```bash
# Update Sui framework
sui move build --fetch-deps-only
```

### Deployment Errors

**Error: "Insufficient gas"**
```bash
# Increase gas budget
sui client publish --gas-budget 200000000
```

**Error: "Address not found"**
```bash
# Check active address
sui client active-address

# Get testnet tokens
sui client faucet
```

### Test Failures

```bash
# Run tests with verbose output
sui move test --verbose

# Check specific test
sui move test test_name --verbose
```

---

## 📝 Post-Deployment Checklist

- [ ] Package deployed successfully
- [ ] GlobalRegistry shared object created
- [ ] Package ID saved
- [ ] Deployment info documented
- [ ] Contract verified on explorer
- [ ] Test transactions executed
- [ ] Events emitting correctly
- [ ] Frontend integration ready

---

## 🔗 Useful Links

- **Sui Documentation:** https://docs.sui.io
- **Sui Explorer:** https://suiexplorer.com
- **Sui Discord:** https://discord.gg/sui
- **Move Language:** https://move-language.github.io/move/

---

## 🆘 Support

For issues or questions:
1. Check Sui documentation
2. Join Sui Discord
3. Review transaction on explorer
4. Check gas and balance

---

**Deployment Guide Version:** 1.0  
**Last Updated:** 2025-11-22

