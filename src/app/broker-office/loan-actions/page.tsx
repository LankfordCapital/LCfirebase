
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUI } from "@/contexts/ui-context";
import { AlertCircle, HelpCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const loanFiles = [
    { 
        id: "LL-00124", 
        property: "123 Main St, Anytown",
        type: "Fix and Flip",
        missingDocuments: [
            { id: "doc1", name: "2023 Personal Tax Returns", note: "Please provide the complete, signed return including all schedules." },
            { id: "doc4", name: "Driver's License", note: "Ensure the image is clear and not expired." },
        ]
    },
    { 
        id: "LL-00127",
        property: "789 Pine Ln, Otherville",
        type: "Ground Up Construction",
        missingDocuments: [
            { id: "doc2", name: "2023 Business Tax Returns", note: "Must be the final version filed with the IRS." },
            { id: "doc3", name: "Signed Purchase Agreement", note: null },
            { id: "doc5", name: "Approved Plans", note: "Must be stamped by the city." },
        ]
    }
];


export default function DocumentsPage() {
  const { openAssistant } = useUI();
  
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
        </div>
        <Button asChild>
            <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
        </Button>
       </div>
       <div className="space-y-6">
        {loanFiles.map(loan => (
          <Card key={loan.id}>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Missing Documents for {loan.property}
                  </CardTitle>
                  <CardDescription>
                      Loan ID: {loan.id} | Type: <Badge variant="secondary">{loan.type}</Badge>
                      <br/>
                      Please upload the following documents to proceed. Notes from our team are included below each item.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {loan.missingDocuments.map((doc) => (
                       <div key={doc.id} className="p-3 rounded-md border bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" alt="Lankford Capital Icon" width={28} height={28} />
                                <Label htmlFor={`${loan.id}-${doc.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{doc.name}</Label>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAssistant(`I have a question about the "${doc.name}" document for my loan on ${loan.property}.`)}>
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">Ask a question about {doc.name}</span>
                            </Button>
                          </div>
                          {doc.note && (
                            <p className="mt-2 ml-11 text-xs text-muted-foreground bg-background p-2 rounded-md border">{doc.note}</p>
                          )}
                      </div>
                  ))}
                   <Button className="w-full mt-4" asChild>
                      <Link href="/dashboard/profile">Upload Documents</Link>
                  </Button>
              </CardContent>
          </Card>
        ))}
       </div>
    </div>
  )
}
