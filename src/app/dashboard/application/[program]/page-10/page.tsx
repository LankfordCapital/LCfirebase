
import { Suspense } from 'react';
import { LoanApplicationClientPage10 } from '@/components/loan-application-client-page-10';
import { Skeleton } from '@/components/ui/skeleton';

function ApplicationSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}

export default function LoanApplicationPage10({ params }: { params: { program: string } }) {
    const loanProgram = decodeURIComponent(params.program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    return (
        <Suspense fallback={<ApplicationSkeleton />}>
            <LoanApplicationClientPage10 loanProgram={loanProgram} />
        </Suspense>
    )
}
