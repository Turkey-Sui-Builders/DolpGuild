# 🌐 Frontend Integration Guide

## ✅ Integration Complete!

DolpGuild V3 frontend is fully integrated with the deployed smart contracts on Sui Testnet.

---

## 🎯 What's Integrated

### 1. Sui Wallet Connection ✅

**Provider Setup**: `frontend/components/app-providers.tsx`
```typescript
<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
  <WalletProvider>{children}</WalletProvider>
</SuiClientProvider>
```

**Supported Wallets**:
- Sui Wallet
- Suiet
- Ethos Wallet
- Martian Wallet
- All @mysten/dapp-kit compatible wallets

### 2. Smart Contract Integration ✅

**Constants**: `frontend/lib/constants.ts`
- Package ID: `0xaa9dbbfee2854076b13c555d96a0f0e5acc9af3672501c1b8799e784147b04f2`
- All shared objects (GlobalRegistry, BadgeRegistry, etc.)
- System objects (Clock, Random)

**Transaction Functions**: `frontend/lib/sui-client.ts`
- `createPodTx()` - Create new pod
- `joinPodTx()` - Join existing pod
- `postJobTx()` - Post job listing
- `submitApplicationTx()` - Submit application with CV
- `hireCandidateTx()` - Hire candidate (auto-mints badge)
- `getFeaturedJobTx()` - Get featured job (uses Random)
- `enterLotteryTx()` - Enter job lottery

### 3. React Hooks ✅

**Transaction Hooks**: `frontend/hooks/use-sui-transactions.ts`
```typescript
const { createPod, isLoading } = useCreatePod()
const { joinPod } = useJoinPod()
const { postJob } = usePostJob()
const { submitApplication } = useSubmitApplication()
const { hireCandidate } = useHireCandidate()
```

**Data Fetching Hooks**: `frontend/hooks/use-sui-data.ts`
```typescript
const { data: pods } = usePods()
const { data: jobs } = useJobs()
const { data: badges } = useUserBadges()
const { data: applications } = useUserApplications()
```

### 4. Walrus Storage Integration ✅

**Walrus Client**: `frontend/lib/walrus-client.ts`

**Upload CV**:
```typescript
import { uploadCV } from "@/lib/walrus-client"

const blobId = await uploadCV(cvFile)
// Returns: "0KFx79rNdKYbQNMFbW8Jyox9080aAoQxEjg3qStfO4c"
```

**Download CV**:
```typescript
import { downloadFromWalrus } from "@/lib/walrus-client"

const blob = await downloadFromWalrus(blobId)
const url = URL.createObjectURL(blob)
```

**Configuration**:
- Publisher URL: `https://publisher.walrus-testnet.walrus.space`
- Aggregator URL: `https://aggregator.walrus-testnet.walrus.space`

### 5. UI Components ✅

**Job Application Form**: `frontend/components/job-application-form.tsx`
- Cover letter input
- CV file upload (with Walrus integration)
- Automatic validation
- Transaction submission
- Toast notifications

**Features**:
- File type validation (PDF, DOC, DOCX, TXT)
- File size validation (max 10MB)
- Upload progress indicator
- Error handling
- Success feedback

---

## 🚀 Usage Examples

### Create a Pod

```typescript
"use client"

import { useCreatePod } from "@/hooks/use-sui-transactions"
import { Button } from "@/components/ui/button"

export function CreatePodButton() {
  const { createPod, isLoading } = useCreatePod()

  const handleCreate = async () => {
    await createPod(
      "Rust Developers",
      "Elite Rust developers building on Sui"
    )
  }

  return (
    <Button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Pod"}
    </Button>
  )
}
```

### Submit Application with CV

```typescript
"use client"

import { JobApplicationForm } from "@/components/job-application-form"

export function ApplyPage({ jobId }: { jobId: string }) {
  return (
    <JobApplicationForm
      jobId={jobId}
      jobTitle="Senior Move Developer"
      onSuccess={() => {
        console.log("Application submitted!")
      }}
    />
  )
}
```

### Display User's Badges

```typescript
"use client"

import { useUserBadges } from "@/hooks/use-sui-data"
import { Card } from "@/components/ui/card"

export function BadgesList() {
  const { data: badges, isLoading } = useUserBadges()

  if (isLoading) return <div>Loading badges...</div>

  return (
    <div className="grid gap-4">
      {badges?.map((badge) => (
        <Card key={badge.data.objectId}>
          <h3>{badge.data.content.fields.job_title}</h3>
          <p>{badge.data.content.fields.company_name}</p>
        </Card>
      ))}
    </div>
  )
}
```

---

## 🔧 Configuration

### Environment Variables

All environment variables are pre-configured in `frontend/.env.local`:

```env
NEXT_PUBLIC_PACKAGE_ID=0xaa9dbbfee2854076b13c555d96a0f0e5acc9af3672501c1b8799e784147b04f2
NEXT_PUBLIC_GLOBAL_REGISTRY=0x182e7e394354ede36523d35c0732ce98248c4cdd152074385072fdc0d394ee37
NEXT_PUBLIC_BADGE_REGISTRY=0x9d46b72400567b28c7fc4bee71766dfd64189daeb566a271911dab0e7cc13df8
# ... etc
```

No additional configuration needed!

---

## 📊 Data Flow

### Application Submission Flow

1. **User uploads CV** → Walrus storage
2. **Walrus returns blob ID** → `"0KFx79rNdKYbQNMFbW8Jyox9080aAoQxEjg3qStfO4c"`
3. **Frontend submits transaction** → Sui blockchain
4. **Smart contract stores**:
   - Cover letter (on-chain)
   - Blob ID (on-chain)
   - CV content (off-chain on Walrus)
5. **Employer downloads CV** → Walrus aggregator

### Hiring Flow

1. **Employer selects candidate** → Frontend
2. **Frontend calls `hireCandidateTx()`** → Sui blockchain
3. **Smart contract executes**:
   - Updates application status
   - Mints employment badge NFT
   - Updates reputation score
   - Emits events
4. **Frontend shows success** → Toast notification
5. **Badge appears in wallet** → Sui Wallet

---

## 🎨 UI/UX Features

✅ **Responsive Design** - Mobile, tablet, desktop
✅ **Dark Mode** - Automatic theme switching
✅ **Loading States** - Skeleton loaders, spinners
✅ **Error Handling** - Toast notifications
✅ **Optimistic Updates** - Instant UI feedback
✅ **Real-time Data** - Auto-refresh every 10s
✅ **Wallet Integration** - Connect button, account display
✅ **Transaction Feedback** - Success/error messages with explorer links

---

## 🧪 Testing

### Local Testing

1. **Start frontend**:
   ```bash
   cd frontend
   pnpm dev
   ```

2. **Open browser**: http://localhost:3000

3. **Connect wallet**: Click "Connect Wallet"

4. **Test features**:
   - Create a pod
   - Post a job
   - Submit application with CV
   - View badges

### Requirements

- Sui Wallet extension installed
- Testnet SUI tokens ([faucet](https://faucet.testnet.sui.io/))
- WAL tokens for Walrus uploads (optional)

---

## 🚀 Deployment

### Vercel Deployment

```bash
cd frontend
vercel deploy
```

### Environment Variables in Vercel

All variables from `.env.local` need to be added to Vercel dashboard:
- `NEXT_PUBLIC_PACKAGE_ID`
- `NEXT_PUBLIC_GLOBAL_REGISTRY`
- etc.

---

## ✅ Integration Checklist

- [x] Sui wallet connection
- [x] Smart contract transaction functions
- [x] React hooks for transactions
- [x] React hooks for data fetching
- [x] Walrus CV upload
- [x] Walrus CV download
- [x] Job application form
- [x] Toast notifications
- [x] Error handling
- [x] Loading states
- [x] Environment configuration
- [x] Build successful
- [x] Dev server running
- [x] Documentation complete

**Status**: ✅ **100% COMPLETE**

---

## 📚 Additional Resources

- [Frontend README](../frontend/README.md)
- [Sui dApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit)
- [Walrus Docs](https://docs.wal.app/)
- [Next.js Docs](https://nextjs.org/docs)

