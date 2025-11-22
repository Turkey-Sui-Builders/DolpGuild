"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletActionsCard } from "@/components/wallet-actions"
import {
  Edit,
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Award,
  Briefcase,
  Clock,
  ShieldCheck,
  Star,
  TrendingUp,
  Settings,
  LogOut,
  Wallet,
  Loader2,
} from "lucide-react"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useEffect, useState } from "react"
import { fetchUserReputation, fetchUserApplications, fetchUserJobs, fetchUserBadges, fetchUserPods } from "@/lib/sui-client"
import { Transaction } from "@mysten/sui/transactions"
import { PACKAGE_ID, MODULES, CLOCK_OBJECT } from "@/lib/constants"
import { toast } from "sonner"

export default function ProfilePage() {
  const account = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [reputation, setReputation] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [badges, setBadges] = useState<any[]>([])
  const [pods, setPods] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      if (!account?.address) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const [repData, appsData, jobsData, badgesData, podsData] = await Promise.all([
          fetchUserReputation(account.address),
          fetchUserApplications(account.address),
          fetchUserJobs(account.address),
          fetchUserBadges(account.address),
          fetchUserPods(account.address),
        ])

        setReputation(repData)
        setApplications(appsData)
        setJobs(jobsData)
        setBadges(badgesData)
        setPods(podsData)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [account?.address])

  const handleCreateProfile = async () => {
    if (!account?.address) return

    setIsCreatingProfile(true)
    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULES.REPUTATION}::create_reputation_profile`,
        arguments: [tx.object(CLOCK_OBJECT)],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("✅ Reputation profile created:", result)
            toast.success("🎉 Reputation profile created successfully!")

            // Reload data
            setTimeout(async () => {
              const repData = await fetchUserReputation(account.address)
              setReputation(repData)
              setIsCreatingProfile(false)
            }, 2000)
          },
          onError: (error) => {
            console.error("❌ Failed to create profile:", error)
            toast.error("Failed to create reputation profile")
            setIsCreatingProfile(false)
          },
        }
      )
    } catch (error) {
      console.error("Error creating profile:", error)
      toast.error("Failed to create reputation profile")
      setIsCreatingProfile(false)
    }
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Connect Your Wallet</h2>
          <p className="text-slate-500 dark:text-slate-400">Please connect your wallet to view your profile</p>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 mx-auto mb-4 text-sky-500 animate-spin" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Loading Profile...</h2>
          <p className="text-slate-500 dark:text-slate-400">Fetching your data from blockchain</p>
        </div>
      </main>
    )
  }

  const repFields = reputation?.data?.content?.fields
  const employerRating = repFields?.employer_rating_count > 0
    ? (Number(repFields.employer_rating_sum) / Number(repFields.employer_rating_count)).toFixed(1)
    : "N/A"
  const candidateRating = repFields?.candidate_rating_count > 0
    ? (Number(repFields.candidate_rating_sum) / Number(repFields.candidate_rating_count)).toFixed(1)
    : "N/A"
  const totalHires = repFields?.total_hires || 0
  const totalJobsCompleted = repFields?.total_jobs_completed || 0

  // Calculate Activity Score
  const podsCreated = pods.length
  const applicationsCount = applications.length
  const jobsPostedCount = jobs.length
  const badgesCount = badges.length

  const activityScore =
    (podsCreated * 10) +
    (applicationsCount * 5) +
    (jobsPostedCount * 15) +
    (totalHires * 20) +
    (totalJobsCompleted * 25) +
    (badgesCount * 30)

  // Determine level
  const getLevel = (score: number) => {
    if (score >= 1001) return { name: "Expert", emoji: "💎", color: "text-purple-600" }
    if (score >= 501) return { name: "Advanced", emoji: "🥇", color: "text-yellow-600" }
    if (score >= 101) return { name: "Intermediate", emoji: "🥈", color: "text-slate-600" }
    return { name: "Beginner", emoji: "🥉", color: "text-orange-600" }
  }

  const level = getLevel(activityScore)

  // Check if reputation profile exists
  const hasReputationProfile = reputation !== null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Create Profile Banner */}
        {!hasReputationProfile && (
          <div className="mb-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Create Your Reputation Profile</h3>
                <p className="text-sky-100">
                  You need a reputation profile to hire candidates, get hired, and earn badges!
                </p>
              </div>
              <Button
                onClick={handleCreateProfile}
                disabled={isCreatingProfile}
                className="bg-white text-sky-600 hover:bg-sky-50 font-semibold"
                size="lg"
              >
                {isCreatingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Create Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: User Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="h-32 w-32 border-4 border-slate-50 dark:border-slate-800">
                  <AvatarImage src="/placeholder.svg?key=user-avatar" />
                  <AvatarFallback className="text-2xl bg-sky-100 text-sky-700">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-md h-8 w-8 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {account.address.substring(0, 8)}...{account.address.substring(account.address.length - 6)}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4">DolpGuild Member</p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {badges.length > 0 ? (
                  badges.slice(0, 3).map((badge: any, index: number) => {
                    const badgeFields = badge.data?.content?.fields
                    return (
                      <Badge key={index} variant="secondary" className="bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300">
                        {badgeFields?.title || "Badge"}
                      </Badge>
                    )
                  })
                ) : (
                  <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-slate-100">
                    No badges yet
                  </Badge>
                )}
              </div>

              <div className="space-y-3 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Wallet className="h-4 w-4 text-slate-400" />
                  <span className="font-mono text-xs truncate">{account.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span>{totalJobsCompleted} Jobs Completed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Award className="h-4 w-4 text-slate-400" />
                  <span>{totalHires} Hires Made</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full border-slate-200 bg-transparent" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>

            {/* Activity Score */}
            <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sky-200 text-sm font-medium mb-1">Activity Score</h3>
                <div className="flex items-baseline gap-3 mb-2">
                  <div className="text-4xl font-bold">{activityScore}</div>
                  <div className={`text-lg font-semibold ${level.color.replace('text-', 'text-white/80')}`}>
                    {level.emoji} {level.name}
                  </div>
                </div>

                <div className="space-y-2 mt-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">🏢 Pods Created</span>
                    <span className="font-semibold">{podsCreated} × 10 = {podsCreated * 10}pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">📝 Applications</span>
                    <span className="font-semibold">{applicationsCount} × 5 = {applicationsCount * 5}pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">💼 Jobs Posted</span>
                    <span className="font-semibold">{jobsPostedCount} × 15 = {jobsPostedCount * 15}pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">✅ Hires Made</span>
                    <span className="font-semibold">{totalHires} × 20 = {totalHires * 20}pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">🎯 Jobs Completed</span>
                    <span className="font-semibold">{totalJobsCompleted} × 25 = {totalJobsCompleted * 25}pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300">🏆 Badges Earned</span>
                    <span className="font-semibold">{badgesCount} × 30 = {badgesCount * 30}pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reputation & Badges */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Ratings</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {repFields ? `${employerRating}` : "N/A"}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">/ 5</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span>As Employer</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-sm text-amber-500">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {repFields ? `${candidateRating}` : "N/A"} / 5
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">As Candidate</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {badges.length > 0 ? (
                  badges.slice(0, 3).map((badge: any, index: number) => {
                    const badgeFields = badge.data?.content?.fields
                    const colors = [
                      "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40",
                      "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/40",
                      "bg-sky-50 text-sky-800 border-sky-100 dark:bg-sky-900/20 dark:text-sky-200 dark:border-sky-900/40",
                    ]
                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border px-3 py-2 text-center text-xs font-semibold ${colors[index % 3]}`}
                      >
                        {badgeFields?.title || "Badge"}
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-3 text-center text-sm text-slate-400 py-4">
                    No badges earned yet
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">Statistics</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Total Hires</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{totalHires}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Jobs Completed</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{totalJobsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Employer Ratings</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {repFields?.employer_rating_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Candidate Ratings</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {repFields?.candidate_rating_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <WalletActionsCard />
          </div>

          {/* Right Content: Tabs & Dashboard */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 rounded-full h-auto">
                  <TabsTrigger
                    value="active"
                    className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
                  >
                    Active Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="applications"
                    className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
                  >
                    Applications
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job: any, index: number) => {
                    const jobFields = job.data?.content?.fields
                    const jobTypes = { 0: "Project", 1: "Bounty", 2: "Full-time" }
                    const jobType = jobTypes[jobFields?.job_type as keyof typeof jobTypes] || "Unknown"
                    const salary = jobFields?.salary?.fields?.vec?.[0] || 0

                    return (
                      <Card key={index} className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {jobFields?.title || "Untitled Job"}
                              </CardTitle>
                              <CardDescription>{jobFields?.company_name || "DolpGuild"}</CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 dark:bg-green-900/30 dark:text-green-300">
                              {jobFields?.status === 0 ? "Open" : jobFields?.status === 1 ? "In Progress" : "Closed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-6 mb-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>{jobType}</span>
                            </div>
                            {salary > 0 && (
                              <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                <span>{salary} SUI</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{jobFields?.applications?.length || 0} applications</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="rounded-full" asChild>
                              <Link href={`/opportunities/${job.data?.objectId}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                    <CardContent className="py-12 text-center">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                      <p className="text-slate-500 dark:text-slate-400">No active jobs posted yet</p>
                      <Button variant="outline" size="sm" className="rounded-full mt-4" asChild>
                        <Link href="/post-job">Post Your First Job</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app: any, index: number) => {
                    const appFields = app.data?.content?.fields
                    const statusLabels = { 0: "Pending", 1: "Accepted", 2: "Rejected" }
                    const statusColors = {
                      0: "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30",
                      1: "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
                      2: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
                    }
                    const status = appFields?.status || 0
                    const appliedDate = appFields?.applied_at ? new Date(Number(appFields.applied_at)).toLocaleDateString() : "Unknown"

                    return (
                      <Card key={index} className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                                <Award className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                  Application #{index + 1}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Applied {appliedDate}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                                  Job: {appFields?.job_id?.substring(0, 8)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto">
                              <Badge
                                variant="secondary"
                                className={statusColors[status as keyof typeof statusColors]}
                              >
                                {statusLabels[status as keyof typeof statusLabels]}
                              </Badge>
                              <Button variant="outline" size="sm" className="rounded-full" asChild>
                                <Link href={`/opportunities/${appFields?.job_id}`}>View Job</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                    <CardContent className="py-12 text-center">
                      <Award className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                      <p className="text-slate-500 dark:text-slate-400 mb-4">No applications submitted yet</p>
                      <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <Link href="/opportunities">Browse Opportunities</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <p className="text-slate-500 dark:text-slate-400">
                      Completed jobs: {totalJobsCompleted}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                      Total hires made: {totalHires}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
