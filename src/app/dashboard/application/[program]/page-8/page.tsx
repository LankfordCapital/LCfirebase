
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { ArrowLeft, ArrowRight, FileText, FileUp, Building, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

function LoanApplicationClientPage8({ loanProgram }: { loanProgram: string}) {
  const { documents, addDocument } = useDocumentContext();
  const router = useRouter();

  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: itemName,
            file,
        });
    }
  }, [addDocument]);

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
        <div className="flex items-center gap-3">
          {doc?.status === 'uploaded' && <FileUp className="h-5 w-5 text-blue-500" />}
          {!doc && <FileText className="h-5 w-5 text-muted-foreground" />}
          <Label htmlFor={fileInputId} className="font-medium">{name}</Label>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input id={fileInputId} type="file" className="w-full sm:w-auto" onChange={(e) => handleFileChange(name, e)} disabled={!!doc} />
        </div>
      </div>
    );
  };
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-9`);
  };

  const handleGoBack = () => {
    // For non-construction, page 5 links here, so we go back to 5.
    // For construction, page 7 links here, so we go back to 7.
    const isConstructionOrRehab = loanProgram.toLowerCase().includes('construction') || loanProgram.toLowerCase().includes('rehab');
     if (isConstructionOrRehab) {
        router.back(); // Goes back to page 7
     } else {
        const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
        router.push(`/dashboard/application/${programSlug}/page-5`);
     }
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 8 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /> Property Financials & Tax Returns</CardTitle>
                <CardDescription>Upload the property's financial statements and the required tax returns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Property Financials</h3>
                    <div className="space-y-3">
                        <DocumentUploadInput name="Trailing 12-Month Profit & Loss Statement" />
                        <DocumentUploadInput name="Previous Year 1 Profit & Loss Statement" />
                        <DocumentUploadInput name="Previous Year 2 Profit & Loss Statement" />
                    </div>
                </div>
                
                <Separator />
                
                <div>
                     <h3 className="text-lg font-semibold mb-2">Tax Returns</h3>
                    <div className="space-y-3">
                        <DocumentUploadInput name="Sponsor Personal Tax Returns (Last 2 Years)" />
                        <DocumentUploadInput name="Business Entity Tax Returns (Last 2 Years)" />
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 9 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}

export default function LoanApplicationPage8({ params }: { params: { program: string } }) {
    const loanProgram = decodeURIComponent(params.program.replace(/-/g, ' ').replace(/\band\b/g, '&')).replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    return <LoanApplicationClientPage8 loanProgram={loanProgram} />;
}
