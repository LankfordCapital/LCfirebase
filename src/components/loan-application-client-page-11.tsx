
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoanApplicationClientPage11({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleSubmitApplication = () => {
    toast({
        title: "Application Submitted!",
        description: "Thank you. Your loan application has been received.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 11 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Final Review and Submission</CardTitle>
                <CardDescription>This is the final page.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for page 11 will go here. E-signature and final authorizations.</p>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 10
            </Button>
            <Button onClick={handleSubmitApplication}>
                Submit Final Application
            </Button>
        </div>
    </div>
  );
}
