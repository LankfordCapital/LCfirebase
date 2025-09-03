
import { Suspense } from 'react';
import { LoanApplicationClientPage4 } from '@/components/loan-application-client-page-4';
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
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
}

export default async function LoanApplicationPage4({ params }: { params: Promise<{ program: string }> }) {
    const { program } = await params;
    const loanProgram = decodeURIComponent(program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    return (
        <Suspense fallback={<ApplicationSkeleton />}>
            <LoanApplicationClientPage4 loanProgram={loanProgram} />
        </Suspense>
    )
}
