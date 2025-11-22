"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  Coins,
  Eye,
  UserCheck,
  Loader2
} from "lucide-react"
import { useJobs } from "@/hooks/use-sui-data"
import { useCurrentAccount } from "@mysten/dapp-kit"

// Job type mapping
const JOB_TYPES = {
  0: "Project",
  1: "Bounty",
  2: "Full-time",
}

// Job status mapping
const JOB_STATUS = {
  0: "Open",
  1: "In Progress",
  2: "Completed",
  3: "Cancelled",
}

export default function MyJobsPage() {
  const account = useCurrentAccount()
  const { data: allJobs, isLoading } = useJobs()
  
  // Filter jobs posted by current user
  const myJobs = allJobs?.filter((jobObj: any) => {
    const job = jobObj.data?.content?.fields
    return job?.employer === account?.address
  }) || []

  if (!account) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Please connect your wallet to view your posted jobs and applications.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            My Posted Jobs
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your job postings and review applications
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            <span className="ml-3 text-slate-600 dark:text-slate-400">Loading your jobs...</span>
          </div>
        ) : myJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No jobs posted yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Start by posting your first job opportunity
              </p>
              <Button asChild className="rounded-full bg-sky-500 hover:bg-sky-600">
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myJobs.map((jobObj: any) => {
              const job = jobObj.data?.content?.fields
              const jobId = jobObj.data?.objectId
              
              if (!job) return null

              const jobType = JOB_TYPES[job.job_type as keyof typeof JOB_TYPES] || "Unknown"
              const jobStatus = JOB_STATUS[job.status as keyof typeof JOB_STATUS] || "Unknown"
              const salary = job.salary?.fields?.vec?.[0] || 0
              const applicationCount = job.applications?.length || 0

              return (
                <Card key={jobId} className="hover:border-sky-200 dark:hover:border-sky-800 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                            {jobType}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              jobStatus === "Open" 
                                ? "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/30"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                            }
                          >
                            {jobStatus}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                      </div>
                      {salary > 0 && (
                        <div className="text-right">
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Reward</div>
                          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                            {salary} SUI
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{applicationCount} Application{applicationCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(Number(job.created_at)).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1 rounded-full">
                      <Link href={`/opportunities/${jobId}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Job
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-full bg-sky-500 hover:bg-sky-600">
                      <Link href={`/my-jobs/${jobId}/applications`}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Review Applications
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

