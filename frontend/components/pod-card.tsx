import Link from "next/link"
import { Users, FolderKanban, ArrowRight } from "lucide-react"
import type { Pod } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PodCardProps {
  pod: Pod
}

export function PodCard({ pod }: PodCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className="h-16 w-16 rounded-2xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-sky-200 dark:border-sky-800">
          <img src={pod.image || "/placeholder.svg"} alt={pod.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Badge
              variant="secondary"
              className="bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 hover:bg-sky-100 border-sky-200 dark:border-sky-800"
            >
              {pod.category}
            </Badge>
          </div>
          <h3 className="font-bold text-xl truncate text-slate-900 dark:text-slate-50">{pod.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{pod.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-sky-500" />
            <span>{pod.memberCount} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderKanban className="h-4 w-4 text-teal-500" />
            <span>{pod.projectCount} projects</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pod.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          asChild
          className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-200 dark:shadow-none rounded-full"
        >
          <Link href={`/pods/${pod.id}`}>
            View Pod <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
