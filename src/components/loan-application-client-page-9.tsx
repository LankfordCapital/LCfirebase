

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { ArrowLeft, ArrowRight, User, FileText, FileUp, Shield, ClipboardCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoanApplicationClientPage9({ loanProgram }: { loanProgram: string}) {
  const [gcName, setGcName] = useState('');
  const [gcCompanyName, setGcCompanyName] = useState('');
  const [gcPhone, setGcPhone] = useState('');
  const [gcEmail, setGcEmail] = useState('');
  
  const { documents, addDocument } = useDocumentContext();
  const router = useRouter();

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
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
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
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> General Contractor Details</CardTitle>
                <CardDescription>Provide the contact information and required documents for your General Contractor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gcName">GC Name</Label>
                        <Input id="gcName" value={gcName} onChange={e => setGcName(e.target.value)} placeholder="John Builder" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gcCompanyName">GC Company Name</Label>
                        <Input id="gcCompanyName" value={gcCompanyName} onChange={e => setGcCompanyName(e.target.value)} placeholder="Builder Co." />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gcPhone">GC Phone</Label>
                        <Input id="gcPhone" type="tel" value={gcPhone} onChange={e => setGcPhone(e.target.value)} placeholder="(555) 555-5555" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gcEmail">GC Email</Label>
                        <Input id="gcEmail" type="email" value={gcEmail} onChange={e => setGcEmail(e.target.value)} placeholder="john@builderco.com" />
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <DocumentUploadInput name="General Contractor's Contract to Build" />
                    <DocumentUploadInput name="General Contractor License" />
                    <DocumentUploadInput name="General Contractor Bond" />
                    <DocumentUploadInput name="General Contractor Insurance" />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-primary"/> Plans & Permits</CardTitle>
                <CardDescription>Upload your project plans and any approved permits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <DocumentUploadInput name="Approved or Pre-approved Plans" />
                <DocumentUploadInput name="Approved Permits" />
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
