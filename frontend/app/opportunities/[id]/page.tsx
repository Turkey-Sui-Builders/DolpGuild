import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Coins, CheckCircle, ShieldCheck, Globe } from "lucide-react"
import { ApplicationModal } from "@/components/application-modal"
import { suiClient } from "@/lib/sui-client"

// Job type mapping
const JOB_TYPES = {
  0: "Project",
  1: "Bounty",
  2: "Full-time",
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch job from blockchain
  let jobData
  try {
    const result = await suiClient.getObject({
      id,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })
    jobData = result
  } catch (error) {
    console.error("Error fetching job:", error)
    notFound()
  }

  if (!jobData.data) {
    notFound()
  }

  const job = (jobData.data.content as any)?.fields

  if (!job) {
    notFound()
  }

  // Fetch pod data
  let podData
  try {
    const podResult = await suiClient.getObject({
      id: job.pod_id,
      options: {
        showContent: true,
        showType: true,
      },
    })
    podData = (podResult.data?.content as any)?.fields
  } catch (error) {
    console.error("Error fetching pod:", error)
  }

  const jobType = JOB_TYPES[job.job_type as keyof typeof JOB_TYPES] || "Unknown"
  const salary = job.salary?.fields?.vec?.[0] || 0
  const createdAt = job.created_at ? new Date(Number(job.created_at)) : null
  const requirements = job.requirements ? job.requirements.split("; ").filter((r: string) => r.trim()) : []
  const skills = job.required_skills || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Link
          href="/opportunities"
          className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge
                  variant="outline"
                  className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300 px-3 py-1 text-sm"
                >
                  {jobType}
                </Badge>
                {salary > 0 && (
                  <Badge
                    variant="outline"
                    className="border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-300 px-3 py-1 text-sm"
                  >
                    <Coins className="w-3 h-3 mr-1.5" />
                    {salary} SUI
                  </Badge>
                )}
                {createdAt && (
                  <span className="flex items-center text-xs text-slate-400 ml-auto font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Posted {createdAt.toLocaleDateString()}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {job.title}
              </h1>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Description</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
                  {job.description}
                </p>

                {requirements.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Requirements</h3>
                    <ul className="space-y-3 mb-8 list-none pl-0">
                      {requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                          <CheckCircle className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {skills.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Company</h4>
                    <p className="text-slate-900 dark:text-white font-semibold">{job.company_name || "DolpGuild"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h4>
                    <p className="text-slate-900 dark:text-white font-semibold">{job.location || "Remote"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pod Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Posted By</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center border border-sky-200 dark:border-sky-800 overflow-hidden">
                  {podData?.logo_url ? (
                    <img src={podData.logo_url} alt={podData.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{podData?.name?.[0] || "P"}</span>
                  )}
                </div>
                <div>
                  {podData ? (
                    <Link
                      href={`/pods/${job.pod_id}`}
                      className="font-bold text-lg text-slate-900 dark:text-white hover:underline decoration-sky-500 underline-offset-4 decoration-2"
                    >
                      {podData.name}
                    </Link>
                  ) : (
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Pod</span>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {podData?.category || "Community"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Reputation</span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-teal-500" />
                    ⭐ {podData?.reputation_score || 100}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Members</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {podData?.member_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Employer</span>
                  <span className="font-mono text-xs font-medium text-slate-900 dark:text-white">
                    {job.employer?.substring(0, 8)}...
                  </span>
                </div>
              </div>

              {podData && (
                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300 bg-transparent"
                  >
                    <Link href={`/pods/${job.pod_id}`}>View Pod Profile</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Sticky Apply Box (Mobile/Desktop hybrid) */}
            <div className="sticky top-24 bg-sky-900 dark:bg-sky-950 rounded-3xl p-6 shadow-xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                <Coins className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sky-200 text-sm font-medium mb-1">Reward</h3>
                <div className="text-3xl font-bold mb-6 flex items-baseline gap-1">
                  {salary > 0 ? `${salary} SUI` : "Negotiable"}
                </div>

                <ApplicationModal
                  opportunityTitle={job.title}
                  podName={podData?.name || "Pod"}
                  jobId={id}
                  podId={job.pod_id}
                />

                <p className="text-xs text-sky-300/80 mt-4 text-center">Payment is held in escrow until completion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
