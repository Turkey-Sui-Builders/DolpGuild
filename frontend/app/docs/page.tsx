import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocsPage() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Developer docs and user guides are being assembled. For now, explore pods and opportunities to understand
              the current flows, or reach out if you need implementation details.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
