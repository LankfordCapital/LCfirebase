
'use client';

import { EmailAutomationClient } from '@/components/workforce-office/email-automation-client';

export default function EmailAutomationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Email Automation</h1>
                <p className="text-muted-foreground">
                    Generate and send automated email drafts for various user scenarios.
                </p>
            </div>
            <EmailAutomationClient />
        </div>
    )
}
