import { AIPReUnderwriterClient } from "@/components/ai-pre-underwriter-client"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="font-headline text-3xl font-bold">Start a New Loan Application</h1>
          <p className="text-muted-foreground">Select a loan program to begin.</p>
        </div>

        <AIPReUnderwriterClient />
    </div>
  )
}
