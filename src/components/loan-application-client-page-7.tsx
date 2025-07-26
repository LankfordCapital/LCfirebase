

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Briefcase, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { useDocumentContext } from '@/contexts/document-context';

export function LoanApplicationClientPage7({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const [numberOfCompanies, setNumberOfCompanies] = useState(1);
  const { documents, addDocument } = useDocumentContext();

  const handleFileChange = async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: itemName,
            file,
            status: 'uploaded',
        });
    }
  };

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor={fileInputId} className="font-medium">{name}</Label>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input id={fileInputId} type="file" className="w-full sm:w-auto" onChange={(e) => handleFileChange(name, e)} disabled={!!doc} />
        </div>
      </div>
    );
  };
  
  const CompanyTaxSection = ({ companyIndex }: { companyIndex: number }) => (
    <div key={companyIndex} className="space-y-4 pt-4 mt-4 border-t">
      <h4 className="font-semibold text-lg">Company #{companyIndex + 1} Business Tax Returns</h4>
      <DocumentUploadInput name={`Business Tax Returns - Year 1 (Company ${companyIndex + 1})`} />
      <DocumentUploadInput name={`Business Tax Returns - Year 2 (Company ${companyIndex + 1})`} />
      <DocumentUploadInput name={`Business Tax Returns - Year 3 (Company ${companyIndex + 1})`} />
    </div>
  );

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-8`);
  };

  const handleGoBack = () => {
    router.back();
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 7 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Business Tax Returns
                </CardTitle>
                <CardDescription>Please upload the last 3 years of business tax returns for each relevant company.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full sm:w-1/2 md:w-1/3">
                    <Label htmlFor="num-companies">Number of Companies</Label>
                    <Select value={String(numberOfCompanies)} onValueChange={(value) => setNumberOfCompanies(Number(value))}>
                        <SelectTrigger id="num-companies">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                {Array.from({ length: numberOfCompanies }).map((_, index) => (
                    <CompanyTaxSection key={index} companyIndex={index} />
                ))}
            </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 6
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 8 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
