"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Loader2, UserCheck, Download, FileText } from "lucide-react"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { suiClient, fetchJobApplications } from "@/lib/sui-client"
import { Transaction } from "@mysten/sui/transactions"
import { PACKAGE_ID, MODULES, GLOBAL_REGISTRY, BADGE_REGISTRY, CLOCK_OBJECT, WALRUS_CONFIG } from "@/lib/constants"
import { toast } from "sonner"

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const account = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  
  const jobId = params.jobId as string
  
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hiringCandidateId, setHiringCandidateId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!account?.address || !jobId) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch job
        const jobData = await suiClient.getObject({
          id: jobId,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        })
        setJob(jobData)

        // Fetch applications
        const apps = await fetchJobApplications(jobId)
        console.log("📋 Fetched applications:", apps)
        setApplications(apps)
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load applications")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [account?.address, jobId])

  const handleHireCandidate = async (candidateAddress: string) => {
    if (!account?.address) {
      toast.error("Please connect your wallet")
      return
    }

    console.log("🎯 Starting hire process for candidate:", candidateAddress)
    setHiringCandidateId(candidateAddress)

    try {
      // Fetch reputation profiles
      console.log("📋 Fetching reputation profiles...")
      const [employerRep, candidateRep] = await Promise.all([
        suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${PACKAGE_ID}::${MODULES.REPUTATION}::ReputationProfile` },
          options: { showContent: true },
        }),
        suiClient.getOwnedObjects({
          owner: candidateAddress,
          filter: { StructType: `${PACKAGE_ID}::${MODULES.REPUTATION}::ReputationProfile` },
          options: { showContent: true },
        }),
      ])

      console.log("👔 Employer reputation:", employerRep)
      console.log("👤 Candidate reputation:", candidateRep)

      let employerRepId = employerRep.data[0]?.data?.objectId
      let candidateRepId = candidateRep.data[0]?.data?.objectId

      console.log("🆔 Employer Rep ID:", employerRepId)
      console.log("🆔 Candidate Rep ID:", candidateRepId)

      // Create reputation profiles if they don't exist
      if (!employerRepId) {
        console.log("📝 Creating employer reputation profile...")
        toast.info("Creating your reputation profile...")

        const createEmployerTx = new Transaction()
        createEmployerTx.moveCall({
          target: `${PACKAGE_ID}::${MODULES.REPUTATION}::create_reputation_profile`,
          arguments: [createEmployerTx.object(CLOCK_OBJECT)],
        })

        const employerResult = await signAndExecute(
          { transaction: createEmployerTx },
          { onError: (error) => console.error("Failed to create employer profile:", error) }
        )

        if (!employerResult) {
          toast.error("Failed to create employer reputation profile")
          setHiringCandidateId(null)
          return
        }

        console.log("✅ Employer profile created:", employerResult)

        // Wait a bit and fetch again
        await new Promise(resolve => setTimeout(resolve, 2000))
        const newEmployerRep = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${PACKAGE_ID}::${MODULES.REPUTATION}::ReputationProfile` },
          options: { showContent: true },
        })
        employerRepId = newEmployerRep.data[0]?.data?.objectId
      }

      if (!candidateRepId) {
        console.log("📝 Creating candidate reputation profile...")
        toast.info("Creating candidate's reputation profile...")

        const createCandidateTx = new Transaction()
        createCandidateTx.moveCall({
          target: `${PACKAGE_ID}::${MODULES.REPUTATION}::create_reputation_profile`,
          arguments: [createCandidateTx.object(CLOCK_OBJECT)],
        })

        // Note: This will fail because we can't create profile for another user
        // The candidate needs to create their own profile
        toast.error("Candidate must create their own reputation profile first. Ask them to visit the platform and create a profile.")
        setHiringCandidateId(null)
        return
      }

      if (!employerRepId || !candidateRepId) {
        console.error("❌ Reputation profiles still not found!")
        toast.error("Reputation profiles not found. Both users must have reputation profiles.")
        setHiringCandidateId(null)
        return
      }

      console.log("📝 Building transaction...")
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::hire_candidate`,
        arguments: [
          tx.object(GLOBAL_REGISTRY),
          tx.object(BADGE_REGISTRY),
          tx.object(employerRepId),
          tx.object(candidateRepId),
          tx.object(jobId),
          tx.pure.address(candidateAddress),
          tx.object(CLOCK_OBJECT),
        ],
      })

      console.log("🚀 Executing transaction...")
      toast.info("⏳ Waiting for wallet approval...")

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("✅ Candidate hired successfully!")
            console.log("📄 Transaction result:", result)
            toast.success("🎉 Candidate hired successfully! Badge sent to their wallet.")

            // Open Suiscan
            const digest = result.digest
            const suiscanUrl = `https://suiscan.xyz/testnet/tx/${digest}`
            console.log("🔗 Opening Suiscan:", suiscanUrl)
            window.open(suiscanUrl, "_blank")

            // Reload page
            setTimeout(() => {
              console.log("🔄 Reloading page...")
              router.refresh()
            }, 2000)
          },
          onError: (error) => {
            console.error("❌ Transaction failed:", error)
            toast.error(`Failed to hire candidate: ${error.message || "Unknown error"}`)
            setHiringCandidateId(null)
          },
        }
      )
    } catch (error: any) {
      console.error("❌ Error in hire process:", error)
      toast.error(`Error: ${error.message || "Failed to hire candidate"}`)
      setHiringCandidateId(null)
    }
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400">Please connect your wallet</p>
        </div>
      </main>
    )
  }

  const jobFields = job?.data?.content?.fields

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/my-jobs" className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Jobs
          </Link>

          {jobFields && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {jobFields.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {applications.length} Application{applications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        )}

        {/* Applications List */}
        {!isLoading && applications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No applications yet
              </h3>
              <p className="text-slate-500">
                Applications will appear here once candidates apply to this job.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((appObj: any) => {
              const app = appObj.data?.content?.fields
              const appId = appObj.data?.objectId

              if (!app) return null

              const isHiring = hiringCandidateId === app.candidate
              const isHired = jobFields?.hired_candidate?.fields?.vec?.[0] === app.candidate

              return (
                <Card key={appId} className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-sky-100 text-sky-700">
                            {app.candidate.substring(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {app.candidate.substring(0, 8)}...{app.candidate.substring(app.candidate.length - 6)}
                          </CardTitle>
                          <CardDescription>
                            Applied {new Date(Number(app.applied_at)).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>

                      {isHired ? (
                        <Badge className="bg-green-100 text-green-700 border-0">
                          ✅ Hired
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleHireCandidate(app.candidate)}
                          disabled={isHiring || jobFields?.status !== 0}
                          className="bg-sky-500 hover:bg-sky-600"
                        >
                          {isHiring ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Hiring...
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Hire Candidate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                          Cover Letter
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {app.cover_letter}
                        </p>
                      </div>

                      {app.encrypted_cv_blob_id && (
                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                            Encrypted CV
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={`${WALRUS_CONFIG.AGGREGATOR_URL}/v1/blobs/${app.encrypted_cv_blob_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-3 w-3 mr-2" />
                              Download Encrypted CV
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

