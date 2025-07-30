
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

export default function LoanApplicationPage({ params }: { params: { program: string } }) {
    const loanProgram = decodeURIComponent(params.program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    return (
        <Suspense fallback={<ApplicationSkeleton />}>
            <LoanApplicationClient loanProgram={loanProgram} />
        </Suspense>
    )
}
