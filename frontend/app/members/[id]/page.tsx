import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  Globe,
  Github,
  Twitter,
  MessageSquare,
  Star,
  ShieldCheck,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
} from "lucide-react"

// Mock member data - in production this would come from an API
const MEMBERS: Record<string, {
  id: string
  name: string
  role: string
  avatar: string
  title: string
  location: string
  bio: string
  skills: string[]
  reputation: number
  rating: number
  completedJobs: number
  memberSince: string
  pods: { id: string; name: string; role: string }[]
  portfolio: { title: string; description: string; link: string }[]
  badges: { name: string; color: string }[]
}> = {
  "1": {
    id: "1",
    name: "Alex Chen",
    role: "Lead Dev",
    avatar: "/placeholder.svg?key=alex",
    title: "Senior Move Developer",
    location: "Singapore",
    bio: "Building decentralized systems on Sui. 5+ years in blockchain development. Previously at major DeFi protocols.",
    skills: ["Move", "Rust", "Smart Contracts", "DeFi", "TypeScript"],
    reputation: 2450,
    rating: 4.9,
    completedJobs: 28,
    memberSince: "Jan 2024",
    pods: [
      { id: "rust-devs", name: "Rust Developers", role: "Lead Dev" },
      { id: "dao-architects", name: "DAO Architects", role: "Contributor" },
    ],
    portfolio: [
      { title: "DeFi Lending Protocol", description: "Built core lending logic in Move", link: "#" },
      { title: "NFT Marketplace", description: "Smart contracts for trading NFTs", link: "#" },
    ],
    badges: [
      { name: "Top Contributor", color: "bg-amber-50 text-amber-800 border-amber-100" },
      { name: "Verified Developer", color: "bg-emerald-50 text-emerald-800 border-emerald-100" },
    ],
  },
  "2": {
    id: "2",
    name: "Sarah Kim",
    role: "Contributor",
    avatar: "/placeholder.svg?key=sarah",
    title: "Full Stack Developer",
    location: "Seoul, Korea",
    bio: "Passionate about building user-friendly dApps. Focus on frontend excellence with Web3 integration.",
    skills: ["React", "Next.js", "TypeScript", "Sui SDK", "Tailwind"],
    reputation: 1820,
    rating: 4.8,
    completedJobs: 15,
    memberSince: "Mar 2024",
    pods: [{ id: "rust-devs", name: "Rust Developers", role: "Contributor" }],
    portfolio: [
      { title: "DEX Interface", description: "Frontend for decentralized exchange", link: "#" },
    ],
    badges: [{ name: "Rising Star", color: "bg-sky-50 text-sky-800 border-sky-100" }],
  },
  "3": {
    id: "3",
    name: "Mike Ross",
    role: "Auditor",
    avatar: "/placeholder.svg?key=mike",
    title: "Security Researcher",
    location: "New York, USA",
    bio: "Smart contract auditor with focus on DeFi security. Found vulnerabilities in major protocols.",
    skills: ["Security Auditing", "Move", "Formal Verification", "Penetration Testing"],
    reputation: 3100,
    rating: 5.0,
    completedJobs: 42,
    memberSince: "Dec 2023",
    pods: [
      { id: "rust-devs", name: "Rust Developers", role: "Auditor" },
      { id: "zero-knowledge", name: "Zero Knowledge", role: "Researcher" },
    ],
    portfolio: [
      { title: "Protocol Audit Reports", description: "Published security audits", link: "#" },
    ],
    badges: [
      { name: "Elite Auditor", color: "bg-purple-50 text-purple-800 border-purple-100" },
      { name: "Top Contributor", color: "bg-amber-50 text-amber-800 border-amber-100" },
    ],
  },
}

// Default member for unknown IDs
const DEFAULT_MEMBER = {
  id: "unknown",
  name: "DolpGuild Member",
  role: "Member",
  avatar: "/placeholder.svg",
  title: "Web3 Professional",
  location: "Global",
  bio: "Active member of the DolpGuild community, contributing to the Sui ecosystem.",
  skills: ["Web3", "Blockchain"],
  reputation: 100,
  rating: 4.5,
  completedJobs: 0,
  memberSince: "2024",
  pods: [],
  portfolio: [],
  badges: [],
}

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = MEMBERS[id] || { ...DEFAULT_MEMBER, id }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-24 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/underwater.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-900/90 dark:to-slate-900/90" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/pods"
            className="inline-flex items-center text-sky-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pods
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="h-32 w-32 border-4 border-white/20 shadow-xl">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-3xl bg-sky-600 text-white">
                {member.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{member.name}</h1>
                <Badge className="bg-teal-500 hover:bg-teal-600 text-white border-0">
                  {member.role}
                </Badge>
              </div>
              <p className="text-sky-100 text-lg mb-3">{member.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sky-200">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {member.memberSince}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="rounded-full bg-teal-400 hover:bg-teal-500 text-slate-900 font-semibold shadow-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Info */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <Star className="h-5 w-5 fill-amber-400" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {member.rating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Rating</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {member.reputation}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Reputation</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Briefcase className="h-5 w-5 text-sky-500" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {member.completedJobs}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Jobs</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            {member.badges.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.badges.map((badge) => (
                    <Badge
                      key={badge.name}
                      variant="secondary"
                      className={`${badge.color} dark:bg-opacity-20`}
                    >
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-500" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pods */}
            {member.pods.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-500" />
                  Pods
                </h3>
                <div className="space-y-3">
                  {member.pods.map((pod) => (
                    <Link
                      key={pod.id}
                      href={`/pods/${pod.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{pod.name}</p>
                        <p className="text-sm text-slate-500">{pod.role}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Connect</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Website</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHub</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-slate-600 dark:text-slate-300 hover:text-sky-600"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-medium">Twitter / X</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <Tabs defaultValue="about" className="w-full">
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 pt-6">
                  <TabsList className="bg-transparent p-0 gap-6 h-auto">
                    <TabsTrigger
                      value="about"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 data-[state=active]:text-sky-600 font-medium"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="about" className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Bio</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{member.bio}</p>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="p-6">
                  {member.portfolio.length > 0 ? (
                    <div className="grid gap-4">
                      {member.portfolio.map((item, index) => (
                        <Card
                          key={index}
                          className="border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-colors"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-500 dark:text-slate-400 mb-3">
                              {item.description}
                            </p>
                            <Button variant="outline" size="sm" className="bg-transparent" asChild>
                              <a href={item.link}>
                                View Project <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-500 dark:text-slate-400">No portfolio items yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-4">
                    {member.completedJobs > 0 ? (
                      <>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>RC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">
                                Rust Developers Pod
                              </span>
                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Excellent work on the DeFi protocol. Delivered ahead of schedule with
                              clean, well-documented code.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>DA</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">
                                DAO Architects
                              </span>
                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Great communication and technical expertise. Would definitely work with
                              again.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-slate-500 dark:text-slate-400">No reviews yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
