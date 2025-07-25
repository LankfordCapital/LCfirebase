
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComparableSales } from './comparable-sales';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { CheckCircle } from 'lucide-react';

export function LoanApplicationClientPage3({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { addDocument, documents } = useDocumentContext();
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-4`);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: 'Subject Property Photos',
            file,
            status: 'uploaded',
        });
    }
  };

  const propertyPhotosDoc = documents['Subject Property Photos'];

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 4</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <ComparableSales />

        <Card>
            <CardHeader>
                <CardTitle>Subject Property Photos</CardTitle>
                <CardDescription>Upload photos of the subject property. You can upload multiple files.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="property-photos-upload">Property Photos</Label>
                     <div className="flex items-center gap-2">
                        <Input id="property-photos-upload" type="file" onChange={handleFileChange} multiple disabled={!!propertyPhotosDoc}/>
                        {propertyPhotosDoc && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 2
            </Button>
            <Button onClick={handleContinue}>
                Save & Continue to Page 4 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
