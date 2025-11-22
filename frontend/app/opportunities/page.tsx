import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Briefcase, Clock, Coins, ShieldCheck } from "lucide-react"
import { suiClient } from "@/lib/sui-client"
import { PACKAGE_ID, MODULES } from "@/lib/constants"

// Job type mapping
const JOB_TYPES = {
  0: "Project",
  1: "Bounty",
  2: "Full-time",
}

export default async function OpportunitiesPage() {
  // Fetch jobs from blockchain
  let jobs: any[] = []
  try {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::JobPostedEvent`,
      },
      limit: 50,
      order: "descending",
    })

    const jobIds = events.data.map((event: any) => event.parsedJson.job_id)

    if (jobIds.length > 0) {
      const jobObjects = await suiClient.multiGetObjects({
        ids: jobIds,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      })

      jobs = jobObjects.filter((job: any) => job.data !== null)
    }
  } catch (error) {
    console.error("Error fetching jobs:", error)
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <section className="relative overflow-hidden bg-sky-900 text-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[url('/vast-blue-ocean.png')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 to-sky-800/60 dark:from-slate-950 dark:to-slate-900/60" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sky-100 text-sm mb-4">
            <ShieldCheck className="h-4 w-4" />
            Curated by DolpGuild pods
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Open Opportunities</h1>
          <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto">
            Browse bounties, projects, and roles posted by trusted pods across the Sui ecosystem.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {jobs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No opportunities posted yet
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Check back soon or post a new one.</p>
            <Button asChild className="rounded-full bg-sky-500 hover:bg-sky-600 text-white">
              <Link href="/post-job">Post an Opportunity</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {jobs.map((jobObj: any) => {
              const job = jobObj.data?.content?.fields
              const jobId = jobObj.data?.objectId

              if (!job) return null

              const jobType = JOB_TYPES[job.job_type as keyof typeof JOB_TYPES] || "Unknown"
              const salary = job.salary?.fields?.vec?.[0] || 0
              const createdAt = job.created_at ? new Date(Number(job.created_at)) : null

              return (
                <Card
                  key={jobId}
                  className="bg-white/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-colors"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800"
                      >
                        {jobType}
                      </Badge>
                      {salary > 0 && (
                        <Badge
                          variant="outline"
                          className="border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200"
                        >
                          <Coins className="h-4 w-4 mr-1" />
                          {salary} SUI
                        </Badge>
                      )}
                      {createdAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                          <Clock className="h-4 w-4" />
                          {createdAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-2xl text-slate-900 dark:text-white">{job.title}</CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-300 line-clamp-2">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white font-bold">
                        {job.company_name?.[0] || "D"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {job.company_name || "DolpGuild"}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs truncate">
                          {job.location || "Remote"}
                        </div>
                      </div>
                      {job.required_skills && job.required_skills.length > 0 && (
                        <Badge className="ml-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0">
                          {job.required_skills.length} skills
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      Posted by <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {job.employer?.substring(0, 8)}...
                      </span>
                    </div>
                    <Button asChild className="rounded-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Link href={`/opportunities/${jobId}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
