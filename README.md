# 🐬 DolpGuild - Ocean-Themed Web3 Professional Network

**Demo:** [dolpguild.osmannyildiz.cc](https://dolpguild.osmannyildiz.cc)


**Team:**
Batuhan Bayazıt 
github: https://github.com/Batuhan4
telegram: @batuhan4

Muhammed Akıncı 
github: https://github.com/MuhammedAkinci  
telegram name : @makinci77

Mehmet Berat Güngördü 
github: https://github.com/Expiyon  
telegram name : @Expitonn

Osman Nuri Yıldız 
Github : https://github.com/osmannyildiz
telegram name: @osmannyildiz

**Blockchain:** Sui Network
**Language:** Move
**Type:** Decentralized Professional Network with Pod-Based Communities

[![Deployed](https://img.shields.io/badge/Deployed-Sui%20Testnet%20V4-success)](https://testnet.suivision.xyz/package/0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0)

---

## 🌐 Frontend Application

**Next.js frontend is available in the [`frontend/`](./frontend) folder!**

- 🎨 Modern UI with shadcn/ui and Tailwind CSS
- 🔗 Full Sui Wallet integration (@mysten/dapp-kit)
- 🐋 Walrus CV upload/download
- 📊 Real-time blockchain data with React Query
- 🚀 Ready to deploy on Vercel

**[📖 Frontend Documentation](./frontend/README.md)**

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) folder:

- [📖 Complete System Overview](./docs/COMPLETE_SYSTEM_OVERVIEW.md) - Full feature list and capabilities
- [🚀 Deployment V3 Info](./docs/DEPLOYMENT_V3_INFO.md) - Latest deployment details
- [🏗️ Architecture](./docs/ARCHITECTURE.md) - System architecture and design
- [📋 API Reference](./docs/API_REFERENCE.md) - Function signatures and usage
- [💡 Examples](./docs/EXAMPLES.md) - Code examples and use cases
- [🔐 Seal + Walrus Integration](./docs/SEAL_WALRUS_INTEGRATION.md) - Privacy features
- [🐋 Walrus Test Results](./docs/WALRUS_TEST_RESULTS.md) - Live Walrus integration test
- [✅ Feature Verification](./docs/FEATURE_VERIFICATION.md) - Feature checklist
- [🧪 Test Results](./docs/TEST_RESULTS.md) - Test coverage and results

---

## 🚀 Live Deployment (Sui Testnet V4)

**Status**: ✅ **LIVE ON TESTNET**
**Version**: 4.0 (Shared Objects Fix + Full Hiring System)

### 📦 Package Information
- **Package ID**: `0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0`
- **Transaction Hash**: `9YwGg1DvyknNoT2Yx9B8q122u4Moiez5BCjyfS3VJBts`
- **Network**: Sui Testnet
- **Deployed**: 2025-11-22
- **Modules**: `dolphguild`, `employment_badge`, `escrow`, `reputation`, `admin`, `featured`, `dynamic_applications`

### ✨ What's New in V4
- ✅ **Shared Object Architecture**: JobPosting and ReputationProfile are now shared objects
- ✅ **Full Hiring System**: Complete hire workflow with automatic NFT badge minting
- ✅ **Multi-User Access**: Candidates can apply to jobs, employers can hire from any wallet
- ✅ **Reputation Profiles**: Shared reputation system accessible by all users

### 🌐 Shared Objects (Global State)
- **GlobalRegistry**: `0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b`
  - Platform-wide registry for pods and jobs
- **BadgeRegistry**: `0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc`
  - Registry for employment badges
- **VersionRegistry**: `0xb505652ce5b9ae65c3a9f9deaa27e66dfa2ac75351134e1e16369d7e7c91aa5c`
  - Contract version management
- **FeaturedJobRegistry**: `0xb9662b9a96d9027c20bc733966311d2410765cff00fb75a58c1f5fe68ed315b8`
  - Featured jobs and lottery system

### 🔗 Explorer Links
- [📦 View Package on SuiVision](https://testnet.suivision.xyz/package/0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0)
- [📝 Deployment Transaction](https://testnet.suivision.xyz/txblock/9YwGg1DvyknNoT2Yx9B8q122u4Moiez5BCjyfS3VJBts)
- [🌐 GlobalRegistry Object](https://testnet.suivision.xyz/object/0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b)
- [🏅 BadgeRegistry Object](https://testnet.suivision.xyz/object/0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc)

### 💡 Quick Start with Deployed Contracts

```bash
# Set package ID as environment variable
export PACKAGE_ID=0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0
export GLOBAL_REGISTRY=0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b
export BADGE_REGISTRY=0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc
export VERSION_REGISTRY=0xb505652ce5b9ae65c3a9f9deaa27e66dfa2ac75351134e1e16369d7e7c91aa5c
export FEATURED_REGISTRY=0xb9662b9a96d9027c20bc733966311d2410765cff00fb75a58c1f5fe68ed315b8

# Create a pod
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function create_pod \
  --args $GLOBAL_REGISTRY "Tech Innovators" "Blockchain developers" 0x6

# Post a job
sui client call \
  --package $PACKAGE_ID \
  --module dolphguild \
  --function post_job \
  --args $GLOBAL_REGISTRY <POD_ID> "Senior Move Developer" \
    "We need an experienced Move developer" "Move,Rust,Blockchain" \
    0 100000 true 1735000000 true 0x6
```

---

## 🎯 Overview

DolpGuild is an innovative blockchain-based professional network that organizes talent into specialized "pods" inspired by dolphin communities. The platform enables trustless hiring, reputation building, and milestone-based payments through Sui smart contracts.

### Key Features

✅ **Pod-Based Communities** - Professionals organize into specialized groups (Developer Pod, Designer Pod, etc.)
✅ **Smart Contract Hiring** - Transparent, on-chain job postings and applications
✅ **Reputation System** - Two-sided ratings for employers and candidates with achievement badges
✅ **Employment Badge NFTs** - Soulbound credentials for verified work history
✅ **Smart Escrow** - Milestone-based payments for freelance projects
✅ **Privacy-Preserving** - **ACTIVE** Seal-encrypted CV storage with access control
✅ **Decentralized Storage** - **ACTIVE** Walrus integration for encrypted document storage

---

## 📦 Project Structure

```
DolpGuild/
├── sources/
│   ├── dolphguild.move          # Main module with core functionality
│   ├── reputation.move          # Two-sided rating system
│   ├── employment_badge.move    # Soulbound NFT credentials
│   └── escrow.move              # Milestone-based payment system
├── tests/
│   └── dolphguild_tests.move    # Comprehensive test suite
├── Move.toml                     # Package configuration
└── README.md
```

---

## 🔧 Smart Contract Features

### Mandatory Requirements ✅

1. **Vector Usage** - Application storage, job collections, skill lists
2. **Option<T> Usage** - Optional salary, deadlines, hired candidates
3. **Shared Objects** - GlobalRegistry accessible by all users
4. **Events** - Complete event system for all major actions
5. **Access Control** - Role-based permissions for hiring and management

### Bonus Features ⭐

6. **Display Object** - NFT-like visualization for jobs and badges
7. **Clock Object** - Timestamps, deadlines, time-based filtering
8. **Dynamic Fields** - Ready for unlimited scalability (can replace vectors)
9. **Walrus Integration** - CV and document storage support
10. **Random Object** - Ready for featured job selection

### Advanced Features 🚀

11. **Seal Integration** - ✅ **ACTIVE** Privacy-preserving encrypted CV storage with access control
12. **Employment Badge NFT** - Soulbound credentials with Display Object
13. **Reputation System** - Two-sided ratings with achievement badges
14. **Smart Escrow** - Milestone-based payments with automatic releases

---

## 🏗️ Core Modules

### 1. DolpGuild Main Module (`dolphguild.move`)

**Core Structs:**
- `GlobalRegistry` - Shared object tracking platform statistics
- `Pod` - Professional community with members and reputation
- `JobPosting` - Job listings with applications and hiring status
- `Application` - Candidate applications with **encrypted CV** (Seal + Walrus)

**Key Functions:**
- `create_pod()` - Create professional communities
- `join_pod()` - Join existing pods
- `post_job()` - Create job postings with optional salary/deadline
- `submit_application()` - Apply to jobs with **Seal-encrypted CV** stored on Walrus
- `hire_candidate()` - Hire with access control
- `close_job()` - Close job postings
- `get_encrypted_cv_blob_id()` - **NEW** Access encrypted CV (employer/candidate only)
- `get_cv_blob_id()` - **NEW** Access regular CV (employer/candidate only)

### 2. Reputation Module (`reputation.move`)

**Features:**
- Employer ratings (by candidates)
- Candidate ratings (by employers)
- Achievement badges (Top Employer, Rising Star, Fast Responder, Early Adopter)
- Behavioral metrics tracking

**Badge Types:**
- 🏆 **Top Employer** - 4.5+ rating, 10+ hires
- ⭐ **Rising Star** - 4.5+ rating, 3+ jobs completed
- ⚡ **Fast Responder** - <24h average response time
- 🌟 **Early Adopter** - First 1000 users

### 3. Employment Badge Module (`employment_badge.move`)

**Soulbound NFT Credentials:**
- Non-transferable employment verification
- Company branding with logos
- Display Object integration for beautiful visualization
- Permanent on-chain work history
- Revocable by employer (marks inactive, doesn't delete)

### 4. Escrow Module (`escrow.move`)

**Milestone-Based Payments:**
- Employer stakes total payment upfront
- Funds held in smart contract escrow
- Freelancer completes milestones
- Employer releases payments per milestone
- Automatic refunds on cancellation

**Milestone Workflow:**
```
1. Create contract → Funds escrowed
2. Freelancer completes milestone
3. Employer verifies and releases payment
4. Repeat until project complete
5. Contract automatically closes when all milestones paid
```

---

## 🧪 Testing

### Test Coverage

The project includes comprehensive tests covering:

✅ **Pod Creation & Management**
- Create pods with metadata
- Join pods and track membership
- Reputation tracking

✅ **Job Posting Workflow**
- Post jobs with optional fields (Option<T>)
- Vector storage for applications
- Shared object access

✅ **Application System**
- Submit applications with **Seal-encrypted CV** stored on Walrus
- Track application count
- Deadline validation
- Privacy-preserving CV access control

✅ **Hiring Process**
- Successful hiring flow
- Access control enforcement
- Status updates and events

✅ **Access Control**
- Unauthorized hire attempts (expected failure)
- Role-based permissions

### Running Tests

```bash
# Run all tests
sui move test

# Run specific test
sui move test test_create_pod

# Run with verbose output
sui move test --verbose
```

---

## 🚀 Deployment

### Prerequisites

1. Install Sui CLI: https://docs.sui.io/build/install
2. Create Sui wallet: `sui client new-address ed25519`
3. Get testnet SUI: https://discord.com/channels/916379725201563759/971488439931392130

### Build & Deploy

```bash
# Build the package
sui move build

# Run tests
sui move test

# Deploy to testnet
sui client publish --gas-budget 100000000

# Deploy to mainnet
sui client publish --gas-budget 100000000 --network mainnet
```

### Post-Deployment

After deployment, you'll receive:
- Package ID
- Module addresses
- Shared object IDs (GlobalRegistry)

Save these for frontend integration.

---

## 📊 Data Flow

### Job Posting Flow
```
Employer → create_pod() → Pod Created
       ↓
Employer → post_job() → JobPosting Created (Shared)
       ↓
Candidate → Encrypt CV with Seal → Upload to Walrus → Get blob_id
       ↓
Candidate → submit_application(encrypted_cv_blob_id) → Application Created
       ↓
Employer → get_encrypted_cv_blob_id() → Download from Walrus → Decrypt with Seal
       ↓
Employer → hire_candidate() → Job Filled + Badge Issued
       ↓
Both → submit_rating() → Reputation Updated
```

### Freelance Flow
```
Employer → create_contract() → Funds Escrowed
       ↓
Freelancer → complete_milestone() → Milestone Marked Complete
       ↓
Employer → release_payment() → Payment Released
       ↓
Repeat until all milestones paid → Contract Complete
```

---

## 🔐 Security Features

- **Access Control** - Only authorized users can perform sensitive actions
- **Soulbound NFTs** - Employment badges cannot be transferred
- **Escrow Protection** - Funds locked until milestone completion
- **Event Transparency** - All actions emit events for auditability
- **Privacy Protection** - ✅ **ACTIVE** Seal-encrypted CVs with access control (only employer & candidate)
- **Decentralized Storage** - ✅ **ACTIVE** Walrus integration for encrypted document storage

---

## 🌊 Ocean Theme Integration

The platform uses ocean/dolphin metaphors throughout:

- **Pods** - Professional communities (like dolphin pods)
- **DolpGuild** - Guild of dolphins (professionals)
- **Ecosystem Flow** - Natural collaboration patterns
- **Deep-Sea Privacy** - Encrypted data with Seal
- **Tide Economics** - Sustainable, low-cost model

---

## 🔒 Seal + Walrus Integration (ACTIVE)

### How It Works

1. **Candidate Side - CV Upload:**
```bash
# 1. Encrypt CV with Seal
seal encrypt cv.pdf --output encrypted_cv.seal

# 2. Upload to Walrus
walrus upload encrypted_cv.seal
# Returns: blob_id = "seal_encrypted_walrus_blob_xyz123"

# 3. Submit application with encrypted blob ID
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function submit_application \
  --args <REGISTRY_ID> <JOB_ID> <POD_ID> \
    "I'm perfect for this role!" \
    "" false \
    "" false \
    "seal_encrypted_walrus_blob_xyz123" true \
    <CLOCK_ID>
```

2. **Employer Side - CV Access:**
```bash
# 1. Get encrypted CV blob ID (access control enforced)
sui client call \
  --package <PACKAGE_ID> \
  --module dolphguild \
  --function get_encrypted_cv_blob_id \
  --args <APPLICATION_ID> <JOB_ID>
# Returns: "seal_encrypted_walrus_blob_xyz123"

# 2. Download from Walrus
walrus download seal_encrypted_walrus_blob_xyz123 --output encrypted_cv.seal

# 3. Decrypt with Seal
seal decrypt encrypted_cv.seal --output cv.pdf
```

### Privacy Guarantees

✅ **End-to-End Encryption** - CV encrypted with Seal before upload
✅ **Access Control** - Only employer and candidate can access
✅ **Decentralized Storage** - Stored on Walrus (no central server)
✅ **On-Chain Verification** - Blob IDs stored on Sui blockchain
✅ **No Plaintext** - CV never stored unencrypted

---

## 📈 Future Enhancements

- [x] Walrus file upload integration ✅ **DONE**
- [x] Seal encryption for CVs ✅ **DONE**
- [ ] Dynamic Fields for unlimited scalability
- [ ] Random featured job selection
- [ ] Advanced search and filtering
- [ ] Pod governance mechanisms
- [ ] Staking for premium features
- [ ] Cross-pod collaboration tools

---

## 🌐 Deployment Information

### Testnet Deployment V4 (Latest)

**Package ID**: `0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0`

**Shared Objects**:
- GlobalRegistry: `0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b`
- BadgeRegistry: `0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc`
- VersionRegistry: `0xb505652ce5b9ae65c3a9f9deaa27e66dfa2ac75351134e1e16369d7e7c91aa5c`
- FeaturedJobRegistry: `0xb9662b9a96d9027c20bc733966311d2410765cff00fb75a58c1f5fe68ed315b8`

**Transaction**: `9YwGg1DvyknNoT2Yx9B8q122u4Moiez5BCjyfS3VJBts`

**Explorer Links**:
- Package: https://testnet.suivision.xyz/package/0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0
- Transaction: https://testnet.suivision.xyz/txblock/9YwGg1DvyknNoT2Yx9B8q122u4Moiez5BCjyfS3VJBts
- GlobalRegistry: https://testnet.suivision.xyz/object/0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b
- BadgeRegistry: https://testnet.suivision.xyz/object/0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc

**Deployment Cost**: ~0.5 SUI

### How to Interact with Deployed Contracts

```bash
# Example: Create a pod
sui client call \
  --package 0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0 \
  --module dolphguild \
  --function create_pod \
  --args 0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b \
    "My Pod" "Description" 0x6

# Example: Post a job
sui client call \
  --package 0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0 \
  --module dolphguild \
  --function post_job \
  --args 0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b \
    <POD_ID> "Job Title" "Description" "Skills" 0 \
    100000 true 1735000000 true 0x6

# Example: Submit application with encrypted CV
sui client call \
  --package 0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0 \
  --module dolphguild \
  --function submit_application \
  --args 0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b \
    <JOB_ID> <POD_ID> "Cover letter" "" false "" false \
    "seal_encrypted_walrus_blob_id" true 0x6
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

---

**Built with 🐬 for the Sui Ecosystem**
**Deployed on Sui Testnet** ✅

