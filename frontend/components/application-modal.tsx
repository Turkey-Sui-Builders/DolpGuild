"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Loader2, Wallet, Upload, FileText, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSubmitApplication } from "@/hooks/use-sui-transactions"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { toast as sonnerToast } from "sonner"
import { uploadCV } from "@/lib/walrus-client"
import { encryptCV } from "@/lib/seal-client"
import { getSuiscanTxUrl } from "@/lib/constants"

interface ApplicationModalProps {
  opportunityTitle: string
  podName: string
  jobId?: string
  podId?: string
}

export function ApplicationModal({ opportunityTitle, podName, jobId, podId }: ApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [contact, setContact] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { toast } = useToast()
  const account = useCurrentAccount()
  const { submitApplication, isLoading } = useSubmitApplication()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]

      if (!allowedTypes.includes(file.type)) {
        sonnerToast.error("Invalid file type. Please upload PDF, DOC, DOCX, or TXT file.")
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        sonnerToast.error("File too large. Maximum size is 10MB.")
        return
      }

      setCvFile(file)
    }
  }

  const handleRemoveFile = () => {
    setCvFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      sonnerToast.error("Please connect your wallet first")
      return
    }

    if (!jobId || !podId) {
      sonnerToast.error("Missing job or pod information")
      return
    }

    if (!coverLetter.trim()) {
      sonnerToast.error("Please provide a cover letter")
      return
    }

    setIsSubmitting(true)
    setIsUploading(true)

    try {
      let encryptedCvBlobId: string | undefined

      if (cvFile) {
        console.log("📄 Original CV file:", {
          name: cvFile.name,
          size: cvFile.size,
          type: cvFile.type,
        })

        sonnerToast.info("Encrypting CV with Seal...")

        const encryptedFile = await encryptCV(cvFile)

        console.log("🔐 Encrypted CV file:", {
          name: encryptedFile.name,
          size: encryptedFile.size,
          type: encryptedFile.type,
          sizeIncrease: `${((encryptedFile.size / cvFile.size - 1) * 100).toFixed(1)}%`,
        })

        sonnerToast.info("Uploading encrypted CV to Walrus...")

        encryptedCvBlobId = await uploadCV(encryptedFile)

        console.log("🐋 Walrus upload successful:", {
          blobId: encryptedCvBlobId,
          downloadUrl: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${encryptedCvBlobId}`,
        })

        sonnerToast.success(`CV uploaded! Blob ID: ${encryptedCvBlobId.substring(0, 8)}...`)
      }

      setIsUploading(false)
      sonnerToast.info("Submitting application to blockchain...")

      
      const result = await submitApplication(
        jobId,
        podId,
        coverLetter,
        undefined, 
        contact || undefined, 
        encryptedCvBlobId  
      )

      setIsSuccess(true)

      
      if (result?.digest) {
        const suiscanUrl = getSuiscanTxUrl(result.digest)

        
        window.open(suiscanUrl, "_blank")

        sonnerToast.success(
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Application submitted successfully!</span>
            <a
              href={suiscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-600 underline text-sm flex items-center gap-1"
            >
              View transaction on Suiscan →
            </a>
          </div>,
          { duration: 10000 }
        )
      } else {
        sonnerToast.success("Application submitted successfully!")
      }
    } catch (error) {
      console.error("Failed to submit application:", error)
      sonnerToast.error("Failed to submit application")
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      
      setTimeout(() => setIsSuccess(false), 300)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full sm:w-auto rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20"
        >
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8">
              The {podName} team has received your application. They will review it and contact you shortly.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Return to Opportunity
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="px-6 pt-6 pb-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
              <DialogTitle className="text-xl text-slate-900 dark:text-slate-100">
                Apply for {opportunityTitle}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Submit your profile to the {podName} for review.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Connected Wallet
                </Label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono text-sm truncate">
                    {account?.address ? `${account.address.substring(0, 8)}...${account.address.substring(account.address.length - 6)}` : "Not connected"}
                  </span>
                  {account && (
                    <span className="ml-auto text-xs bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      Connected
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email / Contact (Optional)
                </Label>
                <Input
                  id="email"
                  placeholder="discord_handle or email@example.com"
                  className="rounded-lg"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Why are you a good fit? *
                </Label>
                <Textarea
                  id="pitch"
                  placeholder="Briefly describe your relevant experience..."
                  className="min-h-[120px] resize-none rounded-lg"
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Upload CV
                  <span className="text-xs text-slate-400 ml-2">Encrypted with Seal, stored on Walrus</span>
                </Label>
                {cvFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <FileText className="h-5 w-5 text-sky-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {cvFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(cvFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-3 p-6 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                      <Upload className="h-5 w-5 text-slate-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Click to upload CV
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          PDF, DOC, DOCX, or TXT (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex sm:justify-between items-center">
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                By applying, you agree to the pod's terms.
              </span>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || isUploading || !account}
                className="w-full sm:w-auto rounded-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
              >
                {(isSubmitting || isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading
                  ? "Uploading CV..."
                  : isSubmitting || isLoading
                    ? "Sending..."
                    : !account
                      ? "Connect Wallet"
                      : "Send Application"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
