
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, FileUp, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocumentContext } from '@/contexts/document-context';
import { Label } from './ui/label';
import { Input } from './ui/input';

export function LoanApplicationClientPage9({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { documents, addDocument } = useDocumentContext();
  const docName = "Work Sunk Report";
  const doc = documents[docName];

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: docName,
            file,
        });
    }
  }, [addDocument, docName]);

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-10`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 9 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Work Sunk Report</CardTitle>
                <CardDescription>If any work has already been completed and paid for, please upload your Work Sunk Report below. You can upload formats like PDF, Excel, or Word documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    {doc ? (
                        <div className="flex flex-col items-center gap-2 text-green-600">
                           <FileText className="h-12 w-12" />
                           <p className="font-semibold">File Uploaded:</p>
                           <p className="text-sm text-muted-foreground">{doc.name}</p>
                           <Button variant="outline" size="sm" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Change File
                                </Label>
                           </Button>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center gap-2">
                            <FileUp className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Drag and drop your file here, or click to upload.</p>
                             <Button variant="outline" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Select File
                                </Label>
                           </Button>
                        </div>
                    )}
                     <Input id="work-sunk-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.doc,.docx" />
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 8
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 10 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
