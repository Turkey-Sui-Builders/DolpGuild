"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubmitApplication } from "@/hooks/use-sui-transactions"
import { uploadCV } from "@/lib/walrus-client"
import { toast } from "sonner"
import { Upload, FileText, Loader2 } from "lucide-react"

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  onSuccess?: () => void
}

export function JobApplicationForm({ jobId, jobTitle, onSuccess }: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isUploadingCV, setIsUploadingCV] = useState(false)
  const { submitApplication, isLoading } = useSubmitApplication()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload PDF, DOC, DOCX, or TXT file.",
        })
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Maximum file size is 10MB.",
        })
        return
      }

      setCvFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!coverLetter.trim()) {
      toast.error("Cover letter is required")
      return
    }

    try {
      let cvBlobId: string | undefined

      // Upload CV to Walrus if provided
      if (cvFile) {
        setIsUploadingCV(true)
        toast.info("Uploading CV to Walrus...", {
          description: "This may take a few seconds",
        })

        cvBlobId = await uploadCV(cvFile)

        toast.success("CV uploaded to Walrus!", {
          description: `Blob ID: ${cvBlobId.substring(0, 20)}...`,
        })
      }

      // Submit application to blockchain
      await submitApplication(jobId, coverLetter, cvBlobId)

      // Reset form
      setCoverLetter("")
      setCvFile(null)

      onSuccess?.()
    } catch (error) {
      console.error("Application submission error:", error)
    } finally {
      setIsUploadingCV(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to {jobTitle}</CardTitle>
        <CardDescription>
          Submit your application with a cover letter and optional CV (stored on Walrus)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="cover-letter">
              Cover Letter <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cover-letter"
              placeholder="Tell us why you're a great fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              required
              disabled={isLoading || isUploadingCV}
            />
          </div>

          {/* CV Upload */}
          <div className="space-y-2">
            <Label htmlFor="cv-upload">CV / Resume (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={isLoading || isUploadingCV}
                className="cursor-pointer"
              />
              {cvFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{cvFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Your CV will be stored on Walrus decentralized storage. Max 10MB. Supported: PDF, DOC, DOCX, TXT
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading || isUploadingCV}>
            {isUploadingCV ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading CV to Walrus...
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

