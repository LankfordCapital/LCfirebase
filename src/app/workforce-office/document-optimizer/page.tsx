
import { DocumentOptimizerClient } from '@/components/document-optimizer-client';

export default function DocumentOptimizerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Document Optimizer</h1>
                <p className="text-muted-foreground">
                    Leverage AI to analyze and improve financial documents for better loan approval chances.
                </p>
            </div>
            <DocumentOptimizerClient />
        </div>
    )
}
