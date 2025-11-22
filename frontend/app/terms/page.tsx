import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              DolpGuild is provided for demonstration purposes. Do not submit sensitive information or rely on this
              preview for production agreements.
            </p>
            <p>
              By using the site, you acknowledge that smart contract interactions, wallet connections, and payments are
              not active in this demo build.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
