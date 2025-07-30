

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEmail, type GenerateEmailOutput, type GenerateEmailInput } from '@/ai/flows/email-automation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentContext } from '@/contexts/document-context';
import { Checkbox } from '../ui/checkbox';
import { CustomLoader } from '../ui/custom-loader';

const sampleUsers: GenerateEmailInput['recipient'][] = [
    { userId: 'user-123', email: 'john.doe@example.com', fullName: 'John Doe', role: 'borrower', timeZone: 'America/New_York' },
    { userId: 'user-456', email: 'jane.smith@example.com', fullName: 'Jane Smith', role: 'borrower', timeZone: 'America/Chicago' },
    { userId: 'user-789', email: 'sam.wilson@example.com', fullName: 'Sam Wilson', role: 'borrower', timeZone: 'America/Los_Angeles' },
];

const sampleBrokers = [
    { userId: 'broker-111', email: 'alice.broker@example.com', fullName: 'Alice Broker', role: 'broker' as const },
    { userId: 'broker-222', email: 'bob.agent@example.com', fullName: 'Bob Agent', role: 'broker' as const, },
    { userId: 'broker-333', email: 'charlie.capital@example.com', fullName: 'Charlie Capital', role: 'broker' as const, },
];


export function EmailAutomationClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateEmailOutput | null>(null);
    const [scenario, setScenario] = useState<GenerateEmailInput['scenario']>('missingDocuments');
    const { documents } = useDocumentContext();

    const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(null);
    const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

    const [fromWorkforceName, setFromWorkforceName] = useState('Your Name');
    const [ccBroker, setCcBroker] = useState(false);

    const [details, setDetails] = useState<GenerateEmailInput['details']>({
        loanProgram: '',
        uploadedDocumentNames: [],
        appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
        loanDetails: 'Loan for 123 Main St has been approved for $300,000.',
        adverseActionReason: 'Insufficient credit history.',
        customInstructions: ''
    });

    const { toast } = useToast();

    const handleGenerateEmail = async () => {
        if (!selectedBorrowerId) {
            toast({
                variant: 'destructive',
                title: 'No Recipient',
                description: 'Please select a borrower to send the email to.',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        const uploadedDocumentNames = Object.keys(documents);
        const recipient = sampleUsers.find(u => u.userId === selectedBorrowerId);
        const broker = ccBroker ? sampleBrokers.find(b => b.userId === selectedBrokerId) : undefined;
        
        if (!recipient) {
             toast({
                variant: 'destructive',
                title: 'Invalid Recipient',
                description: 'The selected borrower could not be found.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await generateEmail({ 
                recipient,
                fromWorkforceName,
                scenario, 
                details: {
                    ...details,
                    uploadedDocumentNames
                },
                ccBroker: ccBroker && !!broker,
                broker: broker,
            });
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
                        <Label htmlFor="loanProgram">Loan Program</Label>
                        <Select onValueChange={(value) => handleDetailChange('loanProgram', value)} value={details.loanProgram}>
                            <SelectTrigger id="loanProgram">
                                <SelectValue placeholder="Select a program to find missing docs..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Residential NOO</SelectLabel>
                                    <SelectItem value="Residential NOO - Ground Up Construction">Ground Up Construction</SelectItem>
                                    <SelectItem value="Residential NOO - Fix and Flip">Fix and Flip</SelectItem>
                                    <SelectItem value="Residential NOO - DSCR">DSCR Loan</SelectItem>
                                    <SelectItem value="Residential NOO - Bridge">Bridge Loan</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Commercial</SelectLabel>
                                    <SelectItem value="Commercial - Ground Up Construction">Ground Up Construction</SelectItem>
                                    <SelectItem value="Commercial - Rehab Loans">Rehab Loans</SelectItem>
                                    <SelectItem value="Commercial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                                    <SelectItem value="Commercial - Conventional Long Term Debt">Conventional Long Term Debt</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Industrial</SelectLabel>
                                    <SelectItem value="Industrial - Ground Up Construction">Ground Up Construction</SelectItem>
                                    <SelectItem value="Industrial - Rehab & Expansion">Rehab & Expansion</SelectItem>
                                    <SelectItem value="Industrial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                                    <SelectItem value="Industrial - Long Term Debt">Long Term Debt</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Other</SelectLabel>
                                    <SelectItem value="Land Acquisition">Land Acquisition</SelectItem>
                                    <SelectItem value="Mezzanine Loans">Mezzanine Loans</SelectItem>
                                    <SelectItem value="Mobilization Funding">Mobilization Funding</SelectItem>
                                    <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">The AI will automatically find which documents are missing for the selected program.</p>
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
                        <Label htmlFor="fromWorkforceName">From (Workforce Member)</Label>
                        <Input
                            id="fromWorkforceName"
                            value={fromWorkforceName}
                            onChange={(e) => setFromWorkforceName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>To (Borrower)</Label>
                         <Select onValueChange={setSelectedBorrowerId} value={selectedBorrowerId ?? ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a borrower..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleUsers.map(user => (
                                    <SelectItem key={user.userId} value={user.userId}>{user.fullName} ({user.email})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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


                <div className="space-y-4">
                    {renderScenarioInputs()}
                </div>

                
                <div className="flex items-center space-x-2">
                    <Checkbox id="cc-broker" checked={ccBroker} onCheckedChange={(checked) => setCcBroker(checked as boolean)} />
                    <label
                        htmlFor="cc-broker"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        CC Broker on this email
                    </label>
                </div>

                {ccBroker && (
                     <div className="space-y-2 pl-6">
                        <Label>CC (Broker)</Label>
                         <Select onValueChange={setSelectedBrokerId} value={selectedBrokerId ?? ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a broker to CC..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleBrokers.map(broker => (
                                    <SelectItem key={broker.userId} value={broker.userId}>{broker.fullName} ({broker.email})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}


                <Button onClick={handleGenerateEmail} disabled={isLoading}>
                    {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Email Draft
                </Button>

                {result && result.draftedEmail && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold font-headline">Drafted Email</h3>
                        <Card className="bg-muted/50">
                             <CardHeader>
                                <CardTitle className="text-base">To: {result.draftedEmail.to}</CardTitle>
                                {result.draftedEmail.cc && <CardDescription>CC: {result.draftedEmail.cc}</CardDescription>}
                                <CardDescription>Subject: {result.draftedEmail.subject}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none p-4 border rounded-md bg-background" dangerouslySetInnerHTML={{ __html: result.draftedEmail.body.replace(/\\n/g, '<br />') }} />
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
