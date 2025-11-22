"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Users,
  Sparkles,
  Shield,
  Globe,
  Twitter,
  MessageSquare,
  Plus,
  X,
  Check,
  Loader2,
} from "lucide-react"
import { useCreatePod } from "@/hooks/use-sui-transactions"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { toast } from "sonner"

const CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Research",
  "Governance",
  "Gaming",
  "Content",
  "Community",
  "Security",
  "Other",
]

const SUGGESTED_TAGS = [
  "Move",
  "Smart Contracts",
  "DeFi",
  "NFT",
  "Gaming",
  "DAO",
  "Frontend",
  "Backend",
  "UI/UX",
  "Tokenomics",
  "Community",
  "Growth",
  "Security",
  "Auditing",
  "Research",
]

export default function CreatePodPage() {
  const router = useRouter()
  const account = useCurrentAccount()
  const { createPod, isLoading } = useCreatePod()

  const [step, setStep] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Form state
  const [podName, setPodName] = useState("")
  const [category, setCategory] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [fullDesc, setFullDesc] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreatePod = async () => {
    // Validation
    if (!account) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!podName.trim()) {
      toast.error("Pod name is required")
      return
    }

    if (!shortDesc.trim()) {
      toast.error("Short description is required")
      return
    }

    try {
      // Create description with all details
      const description = fullDesc.trim() || shortDesc.trim()

      // Use category or default to "Other"
      const podCategory = category || "Other"

      let logoUrl = ""

      // Upload image to Walrus if provided
      if (imageFile) {
        try {
          toast.info("Uploading image to Walrus...", {
            description: "This may take a few seconds",
          })

          const { uploadToWalrus } = await import("@/lib/walrus-client")
          const result = await uploadToWalrus(imageFile, { epochs: 10 })

          // Use Walrus aggregator URL as logo URL
          logoUrl = `https://aggregator.walrus-testnet.walrus.space/v1/${result.blobId}`

          toast.success("Image uploaded to Walrus!", {
            description: `Blob ID: ${result.blobId.substring(0, 20)}...`,
          })
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          toast.error("Failed to upload image", {
            description: "Continuing without image...",
          })
          // Continue without image
          logoUrl = ""
        }
      }

      // Call smart contract with all required arguments
      await createPod(podName, description, podCategory, logoUrl)

      // Success - redirect to pods page
      toast.success("Pod created successfully!", {
        description: "Redirecting to pods page...",
      })

      setTimeout(() => {
        router.push("/pods")
      }, 2000)
    } catch (error) {
      console.error("Failed to create pod:", error)
      // Error toast is already shown by the hook
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link
            href="/pods"
            className="inline-flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pods
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create a New Pod</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build your professional community on DolpGuild
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!account && (
          <Card className="mb-6 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Wallet Not Connected:</strong> Please connect your Sui wallet to create a pod.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 1
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {step > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Basic Info
            </span>
          </div>
          <div className="w-16 h-0.5 mx-2 bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full bg-sky-500 transition-all ${step >= 2 ? "w-full" : "w-0"}`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 2
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {step > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Details
            </span>
          </div>
          <div className="w-16 h-0.5 mx-2 bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full bg-sky-500 transition-all ${step >= 3 ? "w-full" : "w-0"}`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 3
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              3
            </div>
            <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Review
            </span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sky-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Let&apos;s start with the essentials about your pod
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pod Image */}
              <div className="space-y-2">
                <Label>Pod Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Pod preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="pod-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => document.getElementById("pod-image")?.click()}
                      type="button"
                    >
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    <p className="text-xs text-slate-500 mt-1">
                      Image will be uploaded to Walrus decentralized storage. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pod Name */}
              <div className="space-y-2">
                <Label htmlFor="podName">Pod Name *</Label>
                <Input
                  id="podName"
                  placeholder="e.g., Move Developers, NFT Creators"
                  className="text-lg"
                  value={podName}
                  onChange={(e) => setPodName(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Choose a clear, memorable name for your pod
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Textarea
                  id="shortDesc"
                  placeholder="Briefly describe what your pod is about..."
                  className="min-h-[100px]"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-slate-500">
                  {shortDesc.length}/200 characters
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-500" />
                Pod Details
              </CardTitle>
              <CardDescription>Add more details to help members find your pod</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Description */}
              <div className="space-y-2">
                <Label htmlFor="fullDesc">Full Description</Label>
                <Textarea
                  id="fullDesc"
                  placeholder="Tell potential members more about your pod, its goals, and what makes it special..."
                  className="min-h-[150px]"
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags (up to 5)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-sky-50 text-sky-700 border-sky-100 cursor-pointer hover:bg-sky-100 pr-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => addTag(newTag)}
                    disabled={tags.length >= 5}
                    className="bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-slate-500 mr-2">Suggestions:</span>
                  {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
                    .slice(0, 6)
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="text-xs text-sky-600 hover:text-sky-700 hover:underline"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label>Social Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-500 flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Website
                    </Label>
                    <Input placeholder="https://yoursite.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-500 flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter / X
                    </Label>
                    <Input placeholder="@yourpod" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-500 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Discord
                    </Label>
                    <Input placeholder="discord.gg/..." />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Membership Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="List any requirements for joining your pod..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-slate-500">
                  E.g., specific skills, experience level, or verification
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Review & Create
                </CardTitle>
                <CardDescription>
                  Review your pod details before creating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Pod logo" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {podName || "Your Pod Name"}
                      </h3>
                      {category && (
                        <Badge className="mt-1 bg-teal-100 text-teal-700 border-0 capitalize">
                          {category}
                        </Badge>
                      )}
                      <p className="text-sm text-slate-500 mt-2">
                        {shortDesc || "Your pod description will appear here..."}
                      </p>
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-sky-50 text-sky-700 border-sky-100"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> Creating a pod requires a small gas fee on the Sui
                    network. Make sure your wallet is connected and has sufficient SUI.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="bg-transparent"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleCreatePod}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8"
                disabled={isLoading || !account}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Pod...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Pod
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="border-slate-100 dark:border-slate-800 bg-sky-50/50 dark:bg-sky-900/10">
            <CardContent className="p-4 flex items-start gap-3">
              <Users className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  Build Your Community
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Attract skilled professionals who share your interests and goals.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 dark:border-slate-800 bg-teal-50/50 dark:bg-teal-900/10">
            <CardContent className="p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  On-Chain Reputation
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your pod&apos;s track record is stored transparently on Sui.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
