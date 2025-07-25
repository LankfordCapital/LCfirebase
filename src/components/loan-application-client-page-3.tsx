

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { ArrowLeft, ArrowRight, Briefcase, FileText, FileUp, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function LoanApplicationClientPage3({ loanProgram }: { loanProgram: string}) {
  const [managementType, setManagementType] = useState('self');
  const [managementCompanyName, setManagementCompanyName] = useState('');
  const [managementCompanyPhone, setManagementCompanyPhone] = useState('');
  const [managementCompanyEmail, setManagementCompanyEmail] = useState('');

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
  
  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-4`);
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 7</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Management Details</CardTitle>
                <CardDescription>Specify how the property will be managed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup value={managementType} onValueChange={setManagementType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self" id="self" />
                        <Label htmlFor="self">Self Managed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Professionally Managed</Label>
                    </div>
                </RadioGroup>

                {managementType === 'professional' && (
                    <div className="space-y-4 pt-4 border-t mt-4">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="managementCompanyName">Management Company Name</Label>
                                <Input id="managementCompanyName" value={managementCompanyName} onChange={e => setManagementCompanyName(e.target.value)} placeholder="Management Co." />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="managementCompanyPhone">Management Company Phone</Label>
                                <Input id="managementCompanyPhone" type="tel" value={managementCompanyPhone} onChange={e => setManagementCompanyPhone(e.target.value)} placeholder="(555) 123-4567" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="managementCompanyEmail">Management Company Email</Label>
                            <Input id="managementCompanyEmail" type="email" value={managementCompanyEmail} onChange={e => setManagementCompanyEmail(e.target.value)} placeholder="contact@managementco.com"/>
                        </div>
                        <DocumentUploadInput name="Management Contract" />
                    </div>
                )}
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 2
            </Button>
            <Button onClick={handleNextPage}>
                Continue to Page 4 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
