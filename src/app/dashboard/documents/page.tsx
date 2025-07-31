
'use client';

import { AIPReUnderwriterClient } from "@/components/ai-pre-underwriter-client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUI } from "@/contexts/ui-context";
import { AlertCircle, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";

const missingDocuments = [
    { id: "doc1", name: "2023 Personal Tax Returns", note: "Please provide the complete, signed return including all schedules." },
    { id: "doc2", name: "2023 Business Tax Returns", note: "Must be the final version filed with the IRS." },
    { id: "doc3", name: "Signed Purchase Agreement", note: null },
    { id: "doc4", name: "Driver's License", note: "Ensure the image is clear and not expired." },
];

export default function DocumentsPage() {
  const { openAssistant } = useUI();
  
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
       <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Missing Documents
                  </CardTitle>
                  <CardDescription>Please upload the following documents to proceed. Notes from our team are included below each item.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {missingDocuments.map((doc) => (
                       <div key={doc.id} className="p-3 rounded-md border bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Checkbox id={doc.id} />
                                <Label htmlFor={doc.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{doc.name}</Label>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAssistant(`I have a question about the "${doc.name}" document.`)}>
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">Ask a question about {doc.name}</span>
                            </Button>
                          </div>
                          {doc.note && (
                            <p className="mt-2 ml-7 text-xs text-muted-foreground bg-background p-2 rounded-md border">{doc.note}</p>
                          )}
                      </div>
                  ))}
                   <Button className="w-full mt-4" asChild>
                      <Link href="/dashboard/profile">Upload Documents</Link>
                  </Button>
              </CardContent>
          </Card>
       </div>
    </div>
  )
}
