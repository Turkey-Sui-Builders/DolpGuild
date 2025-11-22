import { JobPostingForm } from "@/components/job-posting-form"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Post a New Opportunity</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Create a bounty or project for the DolpGuild community. Top talent is ready to contribute.
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 rounded-3xl">
          <JobPostingForm />
        </Card>
      </div>
    </main>
  )
}
