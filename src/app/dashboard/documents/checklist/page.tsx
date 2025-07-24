import { Suspense } from 'react';
import { DocumentChecklistClient } from '@/components/document-checklist-client';
import { Skeleton } from '@/components/ui/skeleton';

function ChecklistSkeleton() {
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


export default function DocumentChecklistPage() {
    return (
        <Suspense fallback={<ChecklistSkeleton />}>
            <DocumentChecklistClient />
        </Suspense>
    )
}
