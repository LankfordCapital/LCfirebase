
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMissingDocumentReminders, type GenerateMissingDocumentRemindersOutput, type GenerateMissingDocumentRemindersInput } from '@/ai/flows/email-automation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const sampleUsers: GenerateMissingDocumentRemindersInput['users'] = [
    {
        userId: 'user-123',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        role: 'borrower',
        timeZone: 'America/New_York',
        missingDocuments: ['2023 Personal Tax Returns', 'Proof of Insurance']
    },
    {
        userId: 'user-456',
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        role: 'borrower',
        timeZone: 'America/Los_Angeles',
        missingDocuments: ["Builder's Risk Insurance Quote"]
    },
    {
        userId: 'broker-789',
        email: 'bob.wilson@broker.com',
        fullName: 'Bob Wilson',
        role: 'broker',
        timeZone: 'America/Chicago',
        missingDocuments: []
    }
];

export function EmailAutomationClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateMissingDocumentRemindersOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateEmails = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await generateMissingDocumentReminders({ users: sampleUsers });
            setResult(response);
            toast({
                title: 'Emails Drafted',
                description: `Successfully generated ${response.draftedEmails.length} email reminders.`
            });
        } catch (error) {
            console.error('Email Automation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating email drafts. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Missing Document Reminders</CardTitle>
                <CardDescription>Click the button to generate personalized email drafts for all users who have outstanding documents on their checklist.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Button onClick={handleGenerateEmails} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Email Drafts
                    </Button>
                    {result && (
                        <div className="text-sm text-muted-foreground">
                            <p><strong>{result.draftedEmails.length} emails drafted.</strong> Review below before sending.</p>
                        </div>
                    )}
                </div>


                {result && result.draftedEmails.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold font-headline">Drafted Emails</h3>
                        <Accordion type="single" collapsible className="w-full">
                            {result.draftedEmails.map((email, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-4">
                                            <span className="font-medium">To: {email.to}</span>
                                            <span className="text-muted-foreground">{email.subject}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Card className="bg-muted/50">
                                            <CardContent className="pt-6">
                                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: email.body.replace(/\n/g, '<br />') }} />
                                                 <div className="mt-4 flex justify-end">
                                                    <Button size="sm">
                                                        <Send className="mr-2 h-4 w-4" /> Send Email
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                         <div className="flex justify-end pt-4 border-t">
                            <Button variant="outline">
                                <Mail className="mr-2 h-4 w-4" /> Send All Drafts
                            </Button>
                        </div>
                    </div>
                )}

                 {result && result.draftedEmails.length === 0 && (
                    <div className="pt-4 text-center text-muted-foreground">
                        <p>No missing documents found for any users. No emails were drafted.</p>
                    </div>
                 )}
            </CardContent>
        </Card>
    )
}
