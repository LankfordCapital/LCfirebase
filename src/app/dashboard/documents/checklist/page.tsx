import { DocumentChecklistClient } from "@/components/document-checklist-client";
import { Suspense } from "react";

export default function DocumentChecklistPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocumentChecklistClient />
        </Suspense>
    )
}
