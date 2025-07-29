
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEmail, type GenerateEmailOutput, type GenerateEmailInput } from '@/ai/flows/email-automation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const sampleUser: GenerateEmailInput['user'] = {
    userId: 'user-123',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'borrower',
    timeZone: 'America/New_York',
};


export function EmailAutomationClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateEmailOutput | null>(null);
    const [scenario, setScenario] = useState<GenerateEmailInput['scenario']>('missingDocuments');
    const [details, setDetails] = useState<GenerateEmailInput['details']>({
        missingDocuments: ['2023 Personal Tax Returns', 'Proof of Insurance'],
        appointmentTime: new Date().toLocaleString(),
        loanDetails: 'Loan for 123 Main St has been approved for $300,000.',
        adverseActionReason: 'Insufficient credit history.',
        customInstructions: ''
    });

    const { toast } = useToast();

    const handleGenerateEmail = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await generateEmail({ user: sampleUser, scenario, details });
            setResult(response);
            toast({
                title: 'Email Drafted',
                description: `Successfully generated email for scenario: ${scenario}`
            });
        } catch (error) {
            console.error('Email Automation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the email draft. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleDetailChange = (field: keyof typeof details, value: string | string[]) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    }

    const renderScenarioInputs = () => {
        switch (scenario) {
            case 'missingDocuments':
                return (
                     <div className="space-y-2">
                        <Label htmlFor="missingDocuments">Missing Documents (comma-separated)</Label>
                        <Input
                            id="missingDocuments"
                            value={details.missingDocuments?.join(', ')}
                            onChange={(e) => handleDetailChange('missingDocuments', e.target.value.split(',').map(s => s.trim()))}
                        />
                    </div>
                );
            case 'appointmentConfirmation':
                 return (
                     <div className="space-y-2">
                        <Label htmlFor="appointmentTime">Appointment Time</Label>
                        <Input
                            id="appointmentTime"
                            value={details.appointmentTime}
                            onChange={(e) => handleDetailChange('appointmentTime', e.target.value)}
                        />
                    </div>
                 );
             case 'loanApproval':
                 return (
                     <div className="space-y-2">
                        <Label htmlFor="loanDetails">Loan Approval Details</Label>
                        <Textarea
                            id="loanDetails"
                            placeholder="e.g., Loan for 123 Main St, $500,000"
                            value={details.loanDetails}
                            onChange={(e) => handleDetailChange('loanDetails', e.target.value)}
                        />
                    </div>
                 );
            case 'adverseAction':
                 return (
                     <div className="space-y-2">
                        <Label htmlFor="adverseActionReason">Reason for Adverse Action</Label>
                        <Textarea
                            id="adverseActionReason"
                            placeholder="Provide a clear and compliant reason for the loan denial."
                            value={details.adverseActionReason}
                            onChange={(e) => handleDetailChange('adverseActionReason', e.target.value)}
                        />
                    </div>
                 );
            case 'custom':
                 return (
                     <div className="space-y-2">
                        <Label htmlFor="customInstructions">Custom Email Instructions</Label>
                        <Textarea
                            id="customInstructions"
                            placeholder="Enter the specific instructions for the email content..."
                            value={details.customInstructions}
                            onChange={(e) => handleDetailChange('customInstructions', e.target.value)}
                            className="h-32"
                        />
                    </div>
                 );
            default:
                return null;
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Email Composer</CardTitle>
                <CardDescription>Generate personalized email drafts for various communication scenarios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>User</Label>
                        <div className="p-3 rounded-md border bg-muted text-sm">
                            {sampleUser.fullName} ({sampleUser.email})
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scenario">Email Scenario</Label>
                         <Select onValueChange={(value) => setScenario(value as any)} defaultValue={scenario}>
                            <SelectTrigger id="scenario">
                                <SelectValue placeholder="Select a scenario" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="missingDocuments">Missing Document Reminder</SelectItem>
                                <SelectItem value="appointmentConfirmation">Appointment Confirmation</SelectItem>
                                <SelectItem value="loanApproval">Loan Approval</SelectItem>
                                <SelectItem value="adverseAction">Adverse Action Notice</SelectItem>
                                <SelectItem value="custom">Custom Email</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    {renderScenarioInputs()}
                </div>

                <Button onClick={handleGenerateEmail} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Email Draft
                </Button>

                {result && result.draftedEmail && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold font-headline">Drafted Email</h3>
                        <Card className="bg-muted/50">
                             <CardHeader>
                                <CardTitle className="text-base">To: {result.draftedEmail.to}</CardTitle>
                                <CardDescription>Subject: {result.draftedEmail.subject}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none p-4 border rounded-md bg-background" dangerouslySetInnerHTML={{ __html: result.draftedEmail.body.replace(/\n/g, '<br />') }} />
                                    <div className="mt-4 flex justify-end">
                                    <Button size="sm">
                                        <Send className="mr-2 h-4 w-4" /> Send Email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
