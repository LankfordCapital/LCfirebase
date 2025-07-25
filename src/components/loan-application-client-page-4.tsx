
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoanApplicationClientPage4({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [creditAuth, setCreditAuth] = useState(false);
  const [backgroundAuth, setBackgroundAuth] = useState(false);
  const [appraisalAuth, setAppraisalAuth] = useState(false);
  
  const allConsentsGiven = creditAuth && backgroundAuth && appraisalAuth;

  const handleSubmitApplication = () => {
    if (!allConsentsGiven) {
        toast({
            variant: 'destructive',
            title: 'Authorizations Required',
            description: 'Please check all disclosure boxes to continue.',
        });
        return;
    }

    // Here you would typically submit all the collected data
    toast({
        title: "Application Submitted!",
        description: "Thank you. Your loan application has been received.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 4 of 4</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Disclosures and Authorizations</CardTitle>
                <CardDescription>Please review and acknowledge the following authorizations to complete your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Checkbox id="credit-auth" checked={creditAuth} onCheckedChange={(checked) => setCreditAuth(!!checked)} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="credit-auth" className="text-base font-medium">
                      Credit Report Authorization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I hereby authorize Lankford Capital and/or its assigns to obtain a copy of my credit report and to verify the information contained in this application for the purpose of obtaining a loan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Checkbox id="background-auth" checked={backgroundAuth} onCheckedChange={(checked) => setBackgroundAuth(!!checked)} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="background-auth" className="text-base font-medium">
                      Background Check Authorization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I hereby authorize Lankford Capital and/or its assigns to conduct a background check for the purpose of evaluating my loan application.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Checkbox id="appraisal-auth" checked={appraisalAuth} onCheckedChange={(checked) => setAppraisalAuth(!!checked)} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="appraisal-auth" className="text-base font-medium">
                      Appraisal and Collateral Analysis Agreement
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand and agree that I am responsible for ordering and paying for a third-party appraisal and a desktop collateral analysis for the subject property as required for this loan application.
                    </p>
                  </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 3
            </Button>
            <Button onClick={handleSubmitApplication} disabled={!allConsentsGiven}>
                Submit Final Application
            </Button>
        </div>
    </div>
  );
}
