

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DealHistory } from './deal-history';

export function LoanApplicationClientPage5({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-6`);
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 5 of 8</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <DealHistory />

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 4
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 6 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
