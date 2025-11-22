import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>About DolpGuild</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              DolpGuild connects Web3 professionals into skill-based pods, making it easier to find collaborators,
              opportunities, and on-chain reputation on Sui.
            </p>
            <p>
              This project is an early preview. Expect frequent updates as we refine onboarding, pod curation, and
              wallet integrations.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
