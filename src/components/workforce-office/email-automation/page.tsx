
import { EmailAutomationClient } from '@/components/email-automation-client';

export default function EmailAutomationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Email Automation</h1>
                <p className="text-muted-foreground">
                    Generate automated email drafts for users with missing documents.
                </p>
            </div>
            <EmailAutomationClient />
        </div>
    )
}
