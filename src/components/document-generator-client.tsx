
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDocument, type GenerateDocumentOutput, type GenerateDocumentInput } from '@/ai/flows/document-generator';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, FileUp, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomLoader } from './ui/custom-loader';

const sampleBorrowers: GenerateDocumentInput['borrower'][] = [
    { fullName: 'John Doe', email: 'john.doe@example.com' },
    { fullName: 'Jane Smith', email: 'jane.smith@example.com' },
];

const sampleBrokers: NonNullable<GenerateDocumentInput['broker']>[] = [
    { fullName: 'Alice Broker', email: 'alice.broker@example.com' },
    { fullName: 'Bob Agent', email: 'bob.agent@example.com' },
];

type CustomTerm = {
    id: string;
    key: string;
    value: string;
};

const sampleTemplates = [
    {
        name: 'Loan Commitment Letter',
        content: `
[Date]

[Borrower Name]
[Borrower Address]

Subject: Loan Commitment for Property at [Property Address]

Dear [Borrower Name],

Lankford Capital is pleased to inform you that your application for a loan has been approved, subject to the terms and conditions outlined below.

Loan Amount: [Loan Amount]
Interest Rate: [Interest Rate]
Loan Term: [Loan Term]
Points: [Points]

This commitment is valid until [Commitment Expiry Date].

We look forward to working with you.

Sincerely,
The Lankford Capital Team
        `
    },
    {
        name: 'Promissory Note',
        content: `
PROMISSORY NOTE

Principal Amount: [Loan Amount]
Date: [Date]

FOR VALUE RECEIVED, the undersigned, [Borrower Name] (the "Borrower"), promises to pay to the order of Lankford Capital (the "Lender"), the principal sum of [Loan Amount], together with interest thereon at the rate of [Interest Rate] per annum.

This note is secured by the property located at [Property Address].

Borrower:
_________________________
[Borrower Name]
        `
    }
];


export function DocumentGeneratorClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateDocumentOutput | null>(null);
    const [templateContent, setTemplateContent] = useState('');
    const [templateFileName, setTemplateFileName] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState<GenerateDocumentInput['borrower'] | null>(null);
    const [selectedBroker, setSelectedBroker] = useState<GenerateDocumentInput['broker'] | null>(null);
    const [customTerms, setCustomTerms] = useState<CustomTerm[]>([{ id: `term-0`, key: '', value: '' }]);

    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setTemplateContent(text);
                setTemplateFileName(file.name);
            };
            reader.readAsText(file);
        }
    };
    
    const handleTemplateSelect = (templateName: string) => {
        const template = sampleTemplates.find(t => t.name === templateName);
        if (template) {
            setTemplateContent(template.content);
            setTemplateFileName(template.name);
        } else {
            setTemplateContent('');
            setTemplateFileName('');
        }
    };
    
    const handleAddTerm = () => {
        setCustomTerms([...customTerms, { id: `term-${customTerms.length}`, key: '', value: '' }]);
    };

    const handleRemoveTerm = (id: string) => {
        setCustomTerms(customTerms.filter(term => term.id !== id));
    };

    const handleTermChange = (id: string, field: 'key' | 'value', value: string) => {
        setCustomTerms(customTerms.map(term => (term.id === id ? { ...term, [field]: value } : term)));
    };


    const handleGenerateDocument = async () => {
        if (!templateContent) {
            toast({ variant: 'destructive', title: 'Missing Template', description: 'Please upload or select a document template.' });
            return;
        }
        if (!selectedBorrower) {
            toast({ variant: 'destructive', title: 'Missing Borrower', description: 'Please select a borrower.' });
            return;
        }

        setIsLoading(true);
        setResult(null);
        
        const filteredCustomTerms = customTerms.filter(term => term.key && term.value).map(({key, value}) => ({key, value}));

        try {
            const response = await generateDocument({
                templateContent,
                borrower: selectedBorrower,
                broker: selectedBroker || undefined,
                customTerms: filteredCustomTerms,
            });
            setResult(response);
            toast({ title: 'Document Generated', description: 'The document has been successfully customized.' });
        } catch (error) {
            console.error('Document Generation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the document.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Generator</CardTitle>
                <CardDescription>Select a template, choose the parties, add custom terms, and let the AI do the rest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="template-select">Document Template</Label>
                    <div className="flex items-center gap-2">
                        <Select onValueChange={handleTemplateSelect}>
                            <SelectTrigger id="template-select">
                                <SelectValue placeholder="Select a pre-defined template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleTemplates.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">OR</span>
                        <Button asChild variant="outline">
                            <Label htmlFor="template-upload" className="cursor-pointer flex items-center">
                                <FileUp className="mr-2" /> Upload Custom
                            </Label>
                        </Button>
                        <Input id="template-upload" type="file" className="hidden" accept=".txt,.md" onChange={handleFileChange} />
                    </div>
                     {templateFileName && <span className="text-sm text-muted-foreground">Selected: {templateFileName}</span>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Borrower</Label>
                        <Select onValueChange={(value) => setSelectedBorrower(sampleBorrowers.find(b => b.email === value) || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a borrower..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleBorrowers.map(b => <SelectItem key={b.email} value={b.email}>{b.fullName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Broker (Optional)</Label>
                        <Select onValueChange={(value) => setSelectedBroker(sampleBrokers.find(b => b.email === value) || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a broker..." />
                            </SelectTrigger>
                            <SelectContent>
                                 <SelectItem value="none">None</SelectItem>
                                {sampleBrokers.map(b => <SelectItem key={b.email} value={b.email}>{b.fullName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="space-y-4">
                    <Label className="font-semibold">Custom Loan Terms</Label>
                    {customTerms.map(term => (
                        <div key={term.id} className="flex items-center gap-2">
                            <Input placeholder="Key (e.g., Loan Amount)" value={term.key} onChange={e => handleTermChange(term.id, 'key', e.target.value)} />
                            <Input placeholder="Value (e.g., $500,000)" value={term.value} onChange={e => handleTermChange(term.id, 'value', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveTerm(term.id)} disabled={customTerms.length === 1}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddTerm}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Term
                    </Button>
                </div>


                <Button onClick={handleGenerateDocument} disabled={isLoading || !templateContent}>
                    {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Document
                </Button>

                {result && result.generatedDocument && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold font-headline">Generated Document</h3>
                        <Textarea 
                            readOnly
                            value={result.generatedDocument}
                            className="h-96 text-sm font-mono"
                        />
                         <Button onClick={() => navigator.clipboard.writeText(result.generatedDocument)}>Copy to Clipboard</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
