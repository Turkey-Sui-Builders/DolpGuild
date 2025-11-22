# 🐬 DolpGuild Frontend

Next.js frontend for DolpGuild - Ocean-Themed Web3 Professional Network on Sui

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

The `.env.local` file is already pre-configured with DolpGuild V3 deployment on Sui Testnet:

```env
NEXT_PUBLIC_PACKAGE_ID=0xaa9dbbfee2854076b13c555d96a0f0e5acc9af3672501c1b8799e784147b04f2
NEXT_PUBLIC_GLOBAL_REGISTRY=0x182e7e394354ede36523d35c0732ce98248c4cdd152074385072fdc0d394ee37
# ... other configs
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── pods/                # Pod pages
│   ├── opportunities/       # Job listings
│   ├── profile/             # User profile
│   └── ...
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── job-application-form.tsx
│   ├── navigation.tsx
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── use-sui-transactions.ts  # Transaction hooks
│   └── use-sui-data.ts          # Data fetching hooks
├── lib/                     # Utility libraries
│   ├── constants.ts         # Contract addresses & constants
│   ├── sui-client.ts        # Sui blockchain client
│   ├── walrus-client.ts     # Walrus storage client
│   └── utils.ts             # Helper functions
└── public/                  # Static assets
```

---

## 🔧 Key Features

### ✅ Sui Wallet Integration

- Connect with Sui Wallet, Suiet, Ethos, etc.
- Automatic network detection (Testnet/Mainnet)
- Transaction signing and execution

### ✅ Smart Contract Integration

All DolpGuild V3 features are integrated:

- **Create & Join Pods**: Professional communities
- **Post Jobs**: Employers can post opportunities
- **Submit Applications**: With Walrus CV upload
- **Hire Candidates**: Auto-mints employment badges
- **Reputation System**: On-chain reputation tracking
- **Featured Jobs**: Random selection using Sui Random object
- **Lottery System**: Fair lottery for job positions

### ✅ Walrus Storage Integration

- Upload CVs to decentralized storage
- Download CVs from Walrus
- Privacy-preserving (only blob ID on-chain)
- Support for PDF, DOC, DOCX, TXT files

### ✅ Real-time Data

- React Query for data fetching
- Auto-refresh every 10 seconds
- Optimistic updates
- Error handling with toast notifications

---

## 🎨 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:

- Modern, responsive design
- Dark mode support
- Accessible components
- Ocean-themed styling

---

## 🔗 Smart Contract Functions

### Pod Management

```typescript
import { useCreatePod, useJoinPod } from "@/hooks/use-sui-transactions"

const { createPod, isLoading } = useCreatePod()
await createPod("Rust Developers", "Elite Rust devs on Sui")

const { joinPod } = useJoinPod()
await joinPod(podId)
```

### Job Posting

```typescript
import { usePostJob } from "@/hooks/use-sui-transactions"

const { postJob } = usePostJob()
await postJob(
  "Senior Move Developer",
  "Build DeFi protocols on Sui",
  "5+ years Rust, Move experience",
  "150k-200k USD",
  "Remote"
)
```

### Application Submission

```typescript
import { useSubmitApplication } from "@/hooks/use-sui-transactions"
import { uploadCV } from "@/lib/walrus-client"

// Upload CV to Walrus
const cvBlobId = await uploadCV(cvFile)

// Submit application with CV blob ID
const { submitApplication } = useSubmitApplication()
await submitApplication(jobId, coverLetter, cvBlobId)
```

### Hiring

```typescript
import { useHireCandidate } from "@/hooks/use-sui-transactions"

const { hireCandidate } = useHireCandidate()
await hireCandidate(
  jobId,
  applicationId,
  candidateAddress,
  "Mysten Labs",
  "https://logo.url"
)
// Auto-mints employment badge & updates reputation!
```

---

## 📊 Data Fetching

```typescript
import { usePods, useJobs, useUserBadges } from "@/hooks/use-sui-data"

// Fetch all pods
const { data: pods, isLoading } = usePods()

// Fetch all jobs
const { data: jobs } = useJobs()

// Fetch user's employment badges
const { data: badges } = useUserBadges()
```

---

## 🌐 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel

```bash
vercel deploy
```

Make sure to set environment variables in Vercel dashboard.

---

## 🔐 Security

- All transactions require wallet signature
- CV files stored on decentralized Walrus (not centralized servers)
- Only blob IDs stored on-chain (privacy-preserving)
- Access control enforced by smart contracts

---

## 🧪 Testing

The frontend integrates with the deployed V3 contracts on Sui Testnet. Make sure you have:

1. Sui Wallet installed
2. Testnet SUI tokens (get from [faucet](https://faucet.testnet.sui.io/))
3. WAL tokens for Walrus uploads (optional)

---

## 📚 Documentation

- [DolpGuild Docs](../docs/) - Full system documentation
- [Sui Documentation](https://docs.sui.io/) - Sui blockchain docs
- [Walrus Documentation](https://docs.wal.app/) - Walrus storage docs
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework docs

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

---

## 📄 License

Apache 2.0

