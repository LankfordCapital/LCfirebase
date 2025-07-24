import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

      <Tabs defaultValue="pre-underwriter" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="pre-underwriter">
            <FileUp className="mr-2 h-4 w-4" />
            AI Pre-Underwriter
          </TabsTrigger>
          <TabsTrigger value="optimizer">
            <Sparkles className="mr-2 h-4 w-4" />
            Document Optimizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pre-underwriter">
          <AIPReUnderwriterClient />
        </TabsContent>
        <TabsContent value="optimizer">
          <DocumentOptimizerClient />
        </TabsContent>
      </Tabs>
    </div>
  )
}
