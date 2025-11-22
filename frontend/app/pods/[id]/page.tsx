import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  FolderKanban,
  ShieldCheck,
  MessageSquare,
  Globe,
  Twitter,
  Share2,
  Briefcase,
  ArrowRight,
} from "lucide-react"
import { suiClient, fetchPodJobs } from "@/lib/sui-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const JOB_TYPES: { [key: number]: string } = {
  0: "Full-time",
  1: "Part-time",
  2: "Contract",
  3: "Freelance",
}

const JOB_STATUS: { [key: number]: string } = {
  0: "Open",
  1: "In Progress",
  2: "Closed",
}

export default async function PodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch pod from blockchain
  let podData
  try {
    const result = await suiClient.getObject({
      id,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })
    podData = result
  } catch (error) {
    console.error("Error fetching pod:", error)
    notFound()
  }

  if (!podData.data) {
    notFound()
  }

  const pod = (podData.data.content as any)?.fields

  if (!pod) {
    notFound()
  }

  // Fetch jobs for this pod
  const podJobs = await fetchPodJobs(id)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-sky-900 dark:bg-slate-900 pb-24 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/underwater.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-900/90 dark:to-slate-900/90" />

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/pods" className="inline-flex items-center text-sky-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-sky-400 to-teal-500 p-1 shadow-xl shadow-sky-900/20 shrink-0 flex items-center justify-center">
              {pod.logo_url ? (
                <img
                  src={pod.logo_url}
                  alt={pod.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center">
                  <span className="text-4xl font-bold text-sky-600">{pod.name?.[0] || "P"}</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-white mb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{pod.name}</h1>
                <Badge className="bg-teal-500 hover:bg-teal-600 text-white border-0 capitalize">
                  {pod.category}
                </Badge>
                {pod.member_count > 100 && (
                  <Badge variant="outline" className="border-sky-400 text-sky-200 bg-sky-900/50">
                    Trending
                  </Badge>
                )}
              </div>
              <p className="text-sky-100 text-lg max-w-2xl leading-relaxed opacity-90">{pod.description}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-sky-400 text-sky-100 hover:bg-sky-800 hover:text-white bg-transparent"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-teal-400 hover:bg-teal-500 text-slate-900 font-semibold shadow-lg shadow-teal-900/20 border-0"
              >
                Join Pod
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <Users className="h-6 w-6 text-sky-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{pod.member_count || 0}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Members</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <FolderKanban className="h-6 w-6 text-teal-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Projects</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="h-6 w-6 text-indigo-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">⭐ {pod.reputation_score || 100}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Reputation</span>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
              <Tabs defaultValue="opportunities" className="w-full">
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 pt-6">
                  <TabsList className="bg-transparent p-0 gap-6 h-auto">
                    <TabsTrigger
                      value="opportunities"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      Opportunities{" "}
                      <Badge className="ml-2 bg-sky-100 text-sky-700 hover:bg-sky-100 border-0">
                        {podJobs.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="members"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      Members
                    </TabsTrigger>
                    <TabsTrigger
                      value="about"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      About
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="opportunities" className="p-6 space-y-4">
                  {podJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No open opportunities</h3>
                      <p className="text-slate-500">Check back later for new projects and bounties.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {podJobs.map((jobObj: any) => {
                        const job = jobObj.data?.content?.fields
                        const jobId = jobObj.data?.objectId

                        if (!job) return null

                        const jobType = JOB_TYPES[job.job_type as keyof typeof JOB_TYPES] || "Unknown"
                        const jobStatus = JOB_STATUS[job.status as keyof typeof JOB_STATUS] || "Unknown"
                        const salary = job.salary?.fields?.vec?.[0] || 0

                        return (
                          <Card key={jobId} className="border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {job.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {job.company_name || pod.name}
                                  </CardDescription>
                                </div>
                                <Badge
                                  className={
                                    job.status === 0
                                      ? "bg-green-100 text-green-700 hover:bg-green-100 border-0 dark:bg-green-900/30 dark:text-green-300"
                                      : job.status === 1
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 dark:bg-blue-900/30 dark:text-blue-300"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 dark:bg-slate-800 dark:text-slate-300"
                                  }
                                >
                                  {jobStatus}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                                {job.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    {jobType}
                                  </span>
                                  {salary > 0 && (
                                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                                      {(Number(salary) / 1_000_000_000).toFixed(2)} SUI
                                    </span>
                                  )}
                                </div>
                                <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600">
                                  <Link href={`/opportunities/${jobId}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="members" className="p-6">
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {pod.member_count || 0} Member{pod.member_count !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-slate-500">Creator: {pod.creator?.substring(0, 8)}...{pod.creator?.substring(pod.creator.length - 6)}</p>
                  </div>
                </TabsContent>

                <TabsContent value="about" className="p-6 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h4>
                    <p>{pod.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Category</h4>
                    <Badge className="bg-teal-100 text-teal-700 border-0 capitalize">{pod.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Created</h4>
                    <p className="text-sm">
                      {new Date(Number(pod.created_at)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Pod ID</h4>
                    <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      {id}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Connect Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-slate-100">Connect</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Website</span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-medium">Twitter / X</span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Discord</span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                </a>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="bg-sky-50 dark:bg-sky-950/30 rounded-3xl p-6 border border-sky-100 dark:border-sky-900">
              <h3 className="font-semibold text-lg mb-4 text-sky-900 dark:text-sky-100">Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sky-700 dark:text-sky-300 font-bold text-xs">1</span>
                  </div>
                  <span>Must hold a verified specialized skill badge (Developer, Designer, etc.)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sky-700 dark:text-sky-300 font-bold text-xs">2</span>
                  </div>
                  <span>Minimum 500 SUI staked in governance (optional but recommended)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sky-700 dark:text-sky-300 font-bold text-xs">3</span>
                  </div>
                  <span>Complete at least 1 successful bounty or project</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
