"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowRight, PlusCircle, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { usePostJob } from "@/hooks/use-sui-transactions"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { usePods } from "@/hooks/use-sui-data"
import { toast as sonnerToast } from "sonner"

export function JobPostingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([""])
  const [skills, setSkills] = useState<string[]>([""])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [jobType, setJobType] = useState("0")
  const [salary, setSalary] = useState("")
  const [hasSalary, setHasSalary] = useState(true)
  const [deadline, setDeadline] = useState("")
  const [hasDeadline, setHasDeadline] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [location, setLocation] = useState("")
  const [selectedPodId, setSelectedPodId] = useState("")

  const { toast } = useToast()
  const router = useRouter()
  const account = useCurrentAccount()
  const { postJob, isLoading } = usePostJob()
  const { data: pods } = usePods()

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index)
    setRequirements(newRequirements)
  }

  const handleAddSkill = () => {
    setSkills([...skills, ""])
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = value
    setSkills(newSkills)
  }

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index)
    setSkills(newSkills)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      sonnerToast.error("Please connect your wallet first")
      return
    }

    if (!selectedPodId) {
      sonnerToast.error("Please select a pod")
      return
    }

    if (!title.trim()) {
      sonnerToast.error("Job title is required")
      return
    }

    if (!description.trim()) {
      sonnerToast.error("Job description is required")
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty requirements and skills
      const filteredRequirements = requirements.filter(r => r.trim())
      const filteredSkills = skills.filter(s => s.trim())

      // Combine requirements into a single string
      const requirementsStr = filteredRequirements.join("; ")

      // Parse salary
      const salaryAmount = hasSalary && salary ? parseInt(salary) : 0

      // Parse deadline (convert to milliseconds)
      const deadlineMs = hasDeadline && deadline
        ? new Date(deadline).getTime()
        : 0

      // Parse job type (0 = project, 1 = bounty, 2 = full-time)
      const jobTypeNum = parseInt(jobType)

      await postJob(
        selectedPodId,
        title,
        description,
        requirementsStr,
        salaryAmount,
        hasSalary,
        deadlineMs,
        hasDeadline,
        jobTypeNum,
        companyName || "DolpGuild",
        "", // company logo URL
        location || "Remote",
        filteredSkills
      )

      sonnerToast.success("Job posted successfully!")

      setTimeout(() => {
        router.push("/opportunities")
      }, 2000)
    } catch (error) {
      console.error("Failed to post job:", error)
      sonnerToast.error("Failed to post job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pod">Select Pod</Label>
          <Select value={selectedPodId} onValueChange={setSelectedPodId}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select a pod" />
            </SelectTrigger>
            <SelectContent>
              {pods && pods.length > 0 ? (
                pods.map((pod: any) => {
                  const podFields = pod.data?.content?.fields
                  const podId = pod.data?.objectId
                  return (
                    <SelectItem key={podId} value={podId}>
                      {podFields?.name || "Unnamed Pod"}
                    </SelectItem>
                  )
                })
              ) : (
                <SelectItem value="none" disabled>
                  No pods available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g. Senior Smart Contract Engineer"
            required
            className="h-12 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Opportunity Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Project</SelectItem>
                <SelectItem value="1">Bounty</SelectItem>
                <SelectItem value="2">Full-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Reward Amount (SUI)</Label>
            <div className="relative">
              <Input
                id="reward"
                placeholder="e.g. 5000"
                type="number"
                className="h-12 rounded-xl pl-12"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">SUI</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="e.g. Mysten Labs"
              className="h-12 rounded-xl"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Remote"
              className="h-12 rounded-xl"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the project scope, goals, and deliverables..."
            className="min-h-[150px] rounded-xl resize-none"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Requirement #${index + 1}`}
                  className="rounded-xl"
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRequirement(index)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRequirement}
              className="w-full rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 bg-transparent"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Requirement
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Required Skills</Label>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Skill #${index + 1} (e.g. Move, Rust, TypeScript)`}
                  className="rounded-xl"
                />
                {skills.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              className="w-full rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 bg-transparent"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">Posting Fee</h4>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Platform Fee (1%)</span>
          <span className="font-mono text-slate-900 dark:text-slate-100">~ 50 SUI</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Fee is deducted from the reward escrow upon successful completion.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading || !account}
        className="w-full h-12 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-lg font-semibold shadow-lg shadow-teal-500/20 disabled:opacity-50"
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Posting...
          </>
        ) : !account ? (
          <>Connect Wallet First</>
        ) : (
          <>
            Post Opportunity <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  )
}
