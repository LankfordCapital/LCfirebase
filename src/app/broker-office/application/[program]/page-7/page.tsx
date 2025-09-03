import { Suspense } from 'react';
import { LoanApplicationClientPage7 } from '@/components/loan-application-client-page-7';
import { Skeleton } from '@/components/ui/skeleton';

function Page7Skeleton() {
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

export default async function BrokerOfficepage7Page({ params }: { params: Promise<{ program: string }> }) {
    const { program } = await params;
    const loanProgram = decodeURIComponent(program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    return (
        <Suspense fallback={<Page7Skeleton />}>
            <LoanApplicationClientPage7 loanProgram={loanProgram} officeContext="broker" />
        </Suspense>
    )
}
