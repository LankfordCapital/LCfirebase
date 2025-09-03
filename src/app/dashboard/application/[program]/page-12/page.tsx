
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LoanApplicationClientPage12 } from '@/components/loan-application-client-page-12';

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

export default async function LoanApplicationPage12({ params }: { params: Promise<{ program: string }> }) {
    const { program } = await params;
    const loanProgram = decodeURIComponent(program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    return (
        <Suspense fallback={<ApplicationSkeleton />}>
            <LoanApplicationClientPage12 loanProgram={loanProgram} />
        </Suspense>
    )
}
