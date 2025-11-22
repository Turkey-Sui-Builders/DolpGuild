"use client"

import Link from "next/link"
import { PODS } from "@/lib/data"
import { PodCard } from "@/components/pod-card"
import { Search, Filter, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePods } from "@/hooks/use-sui-data"
import { Card, CardContent } from "@/components/ui/card"

export default function PodsPage() {
  const { data: blockchainPods, isLoading, error } = usePods()
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-sky-900 dark:bg-slate-950 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/vast-blue-ocean.png')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 to-sky-800/50 dark:from-slate-950 dark:to-slate-900/50" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-sans">Discover Pods</h1>
          <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto mb-8">
            Join specialized guilds, collaborate on projects, and grow your professional network in the Sui ecosystem.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search pods by name or skill..."
                className="pl-10 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-sky-200 focus:bg-white/20 focus:border-white/30 transition-all"
              />
            </div>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-teal-500 hover:bg-teal-400 text-white border-0 shrink-0"
            >
              <Filter className="h-5 w-5" />
              <span className="sr-only">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Pods Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            All Pods ({blockchainPods?.length || PODS.length})
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800"
            >
              Most Popular
            </Button>
            <Button variant="ghost" className="rounded-full text-slate-600 dark:text-slate-400">
              Newest
            </Button>
            <Button variant="ghost" className="rounded-full text-slate-600 dark:text-slate-400">
              Development
            </Button>
            <Button variant="ghost" className="rounded-full text-slate-600 dark:text-slate-400">
              Design
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">Loading pods from blockchain...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Error loading blockchain pods:</strong> {error.message}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                Showing mock data instead.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Pods */}
        {!isLoading && blockchainPods && blockchainPods.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              🔗 On-Chain Pods ({blockchainPods.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blockchainPods.map((podData: any) => {
                const pod = podData.data?.content?.fields
                if (!pod) return null

                return (
                  <Card key={podData.data.objectId} className="border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                          {pod.name?.[0] || "P"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white">{pod.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                            {pod.category || "Other"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                        {pod.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{pod.member_count || 0} members</span>
                        <span>⭐ {pod.reputation_score || 100}</span>
                      </div>
                      <Button asChild className="w-full mt-4 bg-sky-500 hover:bg-sky-600">
                        <Link href={`/pods/${podData.data.objectId}`}>View Pod</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Mock Pods (fallback) */}
        {!isLoading && (!blockchainPods || blockchainPods.length === 0) && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              📋 Example Pods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {PODS.map((pod) => (
                <PodCard key={pod.id} pod={pod} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/30 bg-transparent"
          >
            Load More Pods
          </Button>
          <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 w-full max-w-md">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Don&apos;t see what you&apos;re looking for?
            </p>
            <Button
              asChild
              className="rounded-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Link href="/create-pod">
                <Plus className="h-4 w-4 mr-2" />
                Create Your Own Pod
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
