
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CreditCard, FileText, FileUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComparableSales } from './comparable-sales';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useDocumentContext } from '@/contexts/document-context';
import { useCallback } from 'react';
import { ComparableRentals } from './comparable-rentals';

export function LoanApplicationClientPage7({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { documents, addDocument } = useDocumentContext();

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-8`);
  }

  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        await addDocument({
            name: itemName,
            file,
            status: 'uploaded',
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

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 7 of 8</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <ComparableSales />
        <ComparableRentals />

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Authorization
                </CardTitle>
                <CardDescription>Please upload images of the credit card to be used for the due diligence fees (credit report, background check, CDA, etc.).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <DocumentUploadInput name="Credit Card (Front)" />
                <DocumentUploadInput name="Credit Card (Back)" />
            </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 6
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 8 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
