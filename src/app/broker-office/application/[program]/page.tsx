import { Suspense } from 'react';
import { LoanApplicationClient } from '@/components/loan-application-client';
import { Skeleton } from '@/components/ui/skeleton';

function ApplicationSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    )
}

interface BrokerLoanApplicationPageProps {
    params: Promise<{ program: string }>;
    searchParams: Promise<{ applicationId?: string; borrowerId?: string }>;
}

export default async function BrokerLoanApplicationPage({ params, searchParams }: BrokerLoanApplicationPageProps) {
    const { program } = await params;
    const { applicationId, borrowerId } = await searchParams;
    
    const loanProgram = decodeURIComponent(program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    // Use the original component for all loan types
    return (
        <Suspense fallback={<ApplicationSkeleton />}>
            <LoanApplicationClient 
                loanProgram={loanProgram} 
                officeContext="broker"
                applicationId={applicationId}
                borrowerId={borrowerId}
            />
        </Suspense>
    )
}
