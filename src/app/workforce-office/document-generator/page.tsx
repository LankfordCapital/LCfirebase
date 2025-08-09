
import { DocumentGeneratorClient } from '@/components/document-generator-client';

export default function DocumentGeneratorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Document Generator</h1>
                <p className="text-muted-foreground">
                    Upload a template, provide the details, and let AI generate the customized document.
                </p>
            </div>
            <DocumentGeneratorClient />
        </div>
    )
}
