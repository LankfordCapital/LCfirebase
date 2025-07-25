
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComparableSales } from './comparable-sales';

export function LoanApplicationClientPage6({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-7`);
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 6 of 7</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <ComparableSales />

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 5
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 7 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
