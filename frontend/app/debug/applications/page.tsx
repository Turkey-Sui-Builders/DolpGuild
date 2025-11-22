"use client"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { useEffect, useState } from "react"
import { fetchUserApplications, fetchUserTransactions } from "@/lib/sui-client"
import { decryptFile } from "@/lib/seal-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Lock, Download, Eye, Clock } from "lucide-react"
import { WALRUS_CONFIG, getSuiscanTxUrl } from "@/lib/constants"
import { toast } from "sonner"

export default function DebugApplicationsPage() {
  const account = useCurrentAccount()
  const [applications, setApplications] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [decryptingBlobId, setDecryptingBlobId] = useState<string | null>(null)

  // Decrypt and view CV
  const handleDecryptCV = async (blobId: string) => {
    try {
      setDecryptingBlobId(blobId)
      toast.info("Downloading encrypted CV from Walrus...")

      // Download encrypted CV from Walrus
      const downloadUrl = `${WALRUS_CONFIG.AGGREGATOR_URL}/v1/blobs/${blobId}`
      const response = await fetch(downloadUrl)

      if (!response.ok) {
        throw new Error("Failed to download encrypted CV")
      }

      const encryptedBlob = await response.blob()
      console.log("📥 Downloaded encrypted CV:", {
        size: encryptedBlob.size,
        type: encryptedBlob.type,
      })

      toast.info("Decrypting CV with Seal...")

      // Decrypt the CV (assuming PDF, but could be other types)
      const decryptedBlob = await decryptFile(encryptedBlob, "application/pdf")
      console.log("🔓 Decrypted CV:", {
        size: decryptedBlob.size,
        type: decryptedBlob.type,
      })

      // Create object URL and open in new tab
      const objectUrl = URL.createObjectURL(decryptedBlob)
      window.open(objectUrl, "_blank")

      toast.success("CV decrypted successfully!", {
        description: "Opening in new tab...",
      })

      // Clean up object URL after a delay
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
    } catch (error) {
      console.error("Decryption error:", error)
      toast.error("Failed to decrypt CV", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setDecryptingBlobId(null)
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!account?.address) {
        setIsLoading(false)
        return
      }

      try {
        // Load applications
        const apps = await fetchUserApplications(account.address)
        console.log("🔍 Fetched applications:", apps)
        apps.forEach((app: any, index: number) => {
          console.log(`Application #${index + 1}:`, app.data?.content?.fields)
        })
        setApplications(apps)

        // Load transactions
        const txs = await fetchUserTransactions(account.address, 20)
        console.log("📜 Fetched transactions:", txs)
        setTransactions(txs)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [account?.address])

  if (!account) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-slate-600">Please connect your wallet to view applications</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Transaction History Section */}
      <div>
        <h1 className="text-3xl font-bold mb-8">📜 Recent Transactions</h1>

        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: any, index: number) => {
              const digest = tx.digest
              const timestamp = tx.timestampMs ? new Date(parseInt(tx.timestampMs)).toLocaleString() : "N/A"
              const status = tx.effects?.status?.status === "success" ? "Success" : "Failed"
              const gasUsed = tx.effects?.gasUsed?.computationCost || "N/A"

              return (
                <Card key={digest} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={status === "Success" ? "default" : "destructive"}>
                            {status}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-3 w-3" />
                            {timestamp}
                          </div>
                        </div>
                        <p className="text-xs font-mono text-slate-500 truncate">
                          {digest}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Gas: {gasUsed}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a
                          href={getSuiscanTxUrl(digest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 whitespace-nowrap"
                        >
                          View on Suiscan
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Applications Section */}
      <div>
        <h1 className="text-3xl font-bold mb-8">🔍 Your Applications</h1>

        {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((app: any, index: number) => {
            const appFields = app.data?.content?.fields
            const statusLabels = { 0: "Pending", 1: "Accepted", 2: "Rejected" }
            const status = appFields?.status || 0
            const appliedDate = appFields?.applied_at 
              ? new Date(Number(appFields.applied_at)).toLocaleString() 
              : "Unknown"
            
            const encryptedCvBlobId = typeof appFields?.encrypted_cv_blob_id === 'string'
              ? appFields.encrypted_cv_blob_id
              : appFields?.encrypted_cv_blob_id?.fields?.vec?.[0]

            const cvBlobId = typeof appFields?.cv_blob_id === 'string'
              ? appFields.cv_blob_id
              : appFields?.cv_blob_id?.fields?.vec?.[0]

            const portfolioUrl = typeof appFields?.portfolio_url === 'string'
              ? appFields.portfolio_url
              : appFields?.portfolio_url?.fields?.vec?.[0]

            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Application #{index + 1}</CardTitle>
                    <Badge>{statusLabels[status as keyof typeof statusLabels]}</Badge>
                  </div>
                  <CardDescription>Applied on {appliedDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Job ID:</p>
                    <p className="text-xs font-mono text-slate-500 break-all">
                      {appFields?.job_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Cover Letter:</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                      {appFields?.cover_letter || "N/A"}
                    </p>
                  </div>

                  {encryptedCvBlobId && (
                    <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Encrypted CV (Seal + Walrus)
                        </p>
                      </div>
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all mb-3">
                        {encryptedCvBlobId}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleDecryptCV(encryptedCvBlobId)}
                          disabled={decryptingBlobId === encryptedCvBlobId}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-3 w-3" />
                          {decryptingBlobId === encryptedCvBlobId ? "Decrypting..." : "Decrypt & View CV"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a
                            href={`${WALRUS_CONFIG.AGGREGATOR_URL}/v1/blobs/${encryptedCvBlobId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Download className="h-3 w-3" />
                            Download Encrypted
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  {cvBlobId && (
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm font-medium text-blue-700">Plain CV Blob ID:</p>
                      <p className="text-xs font-mono text-slate-500 break-all">{cvBlobId}</p>
                    </div>
                  )}

                  {portfolioUrl && (
                    <div>
                      <p className="text-sm font-medium text-slate-700">Portfolio URL:</p>
                      <a 
                        href={portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-sky-500 hover:text-sky-600 underline"
                      >
                        {portfolioUrl}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}

