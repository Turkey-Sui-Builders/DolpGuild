import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, Briefcase, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { HeroCTA, CTASection } from "@/components/hero-cta"

const FEATURED_PODS = [
  {
    id: "rust-devs",
    name: "Rust Developers",
    icon: "💻",
    description: "Elite Rust developers building core infrastructure and DeFi protocols on Sui",
    members: 128,
    color: "from-blue-400/20 to-cyan-400/20",
  },
  {
    id: "nft-artists",
    name: "NFT Creators",
    icon: "🎨",
    description: "Digital artists and designers creating the next generation of NFTs on Sui",
    members: 85,
    color: "from-purple-400/20 to-pink-400/20",
  },
  {
    id: "sui-marketing",
    name: "Sui Growth",
    icon: "📢",
    description: "Marketing experts and community managers helping projects launch and grow",
    members: 210,
    color: "from-orange-400/20 to-red-400/20",
  },
  {
    id: "game-fi",
    name: "GameFi Guild",
    icon: "🎮",
    description: "Building the future of gaming on chain with developers and economy experts",
    members: 95,
    color: "from-green-400/20 to-emerald-400/20",
  },
  {
    id: "dao-architects",
    name: "DAO Architects",
    icon: "🏛️",
    description: "Governance specialists designing robust DAO structures and voting systems",
    members: 45,
    color: "from-indigo-400/20 to-blue-400/20",
  },
  {
    id: "zero-knowledge",
    name: "Zero Knowledge",
    icon: "🔬",
    description: "Privacy researchers and ZK-proof implementers pushing blockchain boundaries",
    members: 30,
    color: "from-violet-400/20 to-purple-400/20",
  },
]

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Connect Wallet",
    description: "Link your Sui wallet to join the DolpGuild network",
    icon: "🔗",
  },
  {
    step: "2",
    title: "Join Your Pods",
    description: "Select skill-based pods that match your expertise",
    icon: "🐬",
  },
  {
    step: "3",
    title: "Apply to Opportunities",
    description: "Browse and apply to jobs and projects from companies",
    icon: "📋",
  },
  {
    step: "4",
    title: "Build Reputation",
    description: "Earn on-chain badges and grow your professional profile",
    icon: "🏆",
  },
]

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            src="/animasyon.mp4"
          />
        </div>
        {/* Gradient Overlay - darker for better text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/40 to-background/80 pointer-events-none" />
        {/* Bubble Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl bubble-float" />
          <div
            className="absolute top-40 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl bubble-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full bg-primary/10 blur-3xl bubble-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32 z-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-white drop-shadow-lg">
              Dive Deep, Rise Together
              Your Career, Your Data, Your Ocean
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-balance mb-8 max-w-2xl leading-relaxed drop-shadow-md">
              Join skill-based guilds like dolphin pods. Connect with opportunities, build on-chain reputation, and swim
              together in the Web3 ocean.
            </p>
            <HeroCTA />
            <div className="flex items-center gap-6 mt-12 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-300" />
                <span className="font-medium drop-shadow">Built on Sui</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-sky-300" />
                <span className="font-medium drop-shadow">Move Smart Contracts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">How DolpGuild Works</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Four simple steps to start your Web3 professional journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} className="relative border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pods */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Explore Skill-Based Pods</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Find your pod and connect with like-minded professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURED_PODS.map((pod) => (
              <Card
                key={pod.id}
                className="group hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <div className={`h-2 w-full rounded-t-lg bg-gradient-to-r ${pod.color}`} />
                <CardHeader>
                  <div className="text-5xl mb-4">{pod.icon}</div>
                  <CardTitle className="text-2xl">{pod.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed mb-4">{pod.description}</CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{pod.members.toLocaleString()} members</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full font-semibold bg-transparent" variant="outline" asChild>
                    <Link href={`/pods/${pod.id}`}>
                      View Pod
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="font-semibold bg-transparent" asChild>
              <Link href="/pods">
                View All Pods
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 shadow-2xl">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Ready to Dive In?</h2>
              <p className="text-lg text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of Web3 professionals building their reputation on-chain. Connect your Sui wallet to get
                started.
              </p>
              <CTASection />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
