import { Suspense } from 'react';
import { LoanApplicationClientPage2Enhanced } from '@/components/loan-application-client-page-2-enhanced';
import { Skeleton } from '@/components/ui/skeleton';

function Page2Skeleton() {
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

export default async function BrokerOfficepage2Page({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ program: string }>;
    searchParams: Promise<{ applicationId?: string; borrowerId?: string }>;
}) {
    const { program } = await params;
    const { applicationId, borrowerId } = await searchParams;
    
    const loanProgram = decodeURIComponent(program.replace(/-/g, ' ').replace(/\band\b/g, '&'))
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        .replace(/Noo/g, 'NOO')
        .replace(/Dscr/g, 'DSCR');

    // Use the original component for all loan types
    return (
        <Suspense fallback={<Page2Skeleton />}>
            <LoanApplicationClientPage2Enhanced 
                loanProgram={loanProgram} 
                officeContext="broker"
                applicationId={applicationId}
                borrowerId={borrowerId}
            />
        </Suspense>
    )
}
