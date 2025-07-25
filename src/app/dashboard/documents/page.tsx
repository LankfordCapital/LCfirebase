import { AIPReUnderwriterClient } from "@/components/ai-pre-underwriter-client"
import { DocumentOptimizerClient } from "@/components/document-optimizer-client"
import { FileUp, Sparkles } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="font-headline text-3xl font-bold">Document Center</h1>
          <p className="text-muted-foreground">Manage your documents and leverage our AI tools.</p>
        </div>

        <AIPReUnderwriterClient />
    </div>
  )
}
