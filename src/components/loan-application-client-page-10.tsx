
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function LoanApplicationClientPage10({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const [otherDetails, setOtherDetails] = useState('');
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-12`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 10 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Other Important Details</CardTitle>
                <CardDescription>Use this space to provide any other important details about the subject property or the deal that we should know.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="otherDetails">Narrative</Label>
                    <Textarea
                        id="otherDetails"
                        placeholder="Provide any additional information here..."
                        value={otherDetails}
                        onChange={(e) => setOtherDetails(e.target.value)}
                        className="h-48 resize-none"
                    />
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 9
            </Button>
            <Button onClick={handleContinue}>
                Continue to Final Submission <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
