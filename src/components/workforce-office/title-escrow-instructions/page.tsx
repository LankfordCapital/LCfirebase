
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, BookCopy } from 'lucide-react';
import { generateTitleEscrowInstructions } from '@/ai/flows/generate-title-escrow-instructions-flow';
import { type GenerateTitleEscrowInstructionsOutput } from '@/ai/flows/title-escrow-instructions-types';
import { Textarea } from '@/components/ui/textarea';
import { CustomLoader } from '@/components/ui/custom-loader';

export default function TitleEscrowInstructionsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<GenerateTitleEscrowInstructionsOutput | null>(null);
    const { toast } = useToast();

    const [subjectPropertyAddress, setSubjectPropertyAddress] = useState('');
    const [dealType, setDealType] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [loanAmount, setLoanAmount] = useState<number>(0);
    const [borrowerName, setBorrowerName] = useState('');
    const [purchasePrice, setPurchasePrice] = useState<number | undefined>(undefined);
    const [additionalNotes, setAdditionalNotes] = useState('');

    const handleGenerate = async () => {
        if (!subjectPropertyAddress || !dealType || !propertyType || !loanAmount || !borrowerName) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill in all required fields.',
            });
            return;
        }
        setIsLoading(true);
        setResults(null);

        try {
            const response = await generateTitleEscrowInstructions({
                subjectPropertyAddress,
                dealType,
                propertyType,
                loanAmount,
                borrowerName,
                purchasePrice,
                additionalNotes,
            });
            setResults(response);
            toast({
                title: 'Instructions Generated',
                description: 'Title and Escrow instructions are ready.',
            });
        } catch (error) {
            console.error('Instruction Generation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the instructions.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string, type: 'Title' | 'Escrow') => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied to Clipboard',
            description: `${type} instructions have been copied.`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Title & Escrow Instructions Generator</h1>
                <p className="text-muted-foreground">
                    Generate custom order instructions for title and escrow companies using AI.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Deal Parameters</CardTitle>
                    <CardDescription>Provide the details of the transaction to generate accurate instructions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="address">Subject Property Address</Label>
                            <Input
                                id="address"
                                placeholder="e.g., 123 Main St, Anytown, USA"
                                value={subjectPropertyAddress}
                                onChange={(e) => setSubjectPropertyAddress(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="borrowerName">Borrower Name / Entity</Label>
                            <Input
                                id="borrowerName"
                                placeholder="e.g., John Doe or ABC Holdings LLC"
                                value={borrowerName}
                                onChange={(e) => setBorrowerName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="dealType">Deal Type</Label>
                            <Input
                                id="dealType"
                                placeholder="e.g., Commercial Acquisition"
                                value={dealType}
                                onChange={(e) => setDealType(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="propertyType">Property Type</Label>
                            <Input
                                id="propertyType"
                                placeholder="e.g., Retail Strip Center"
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount</Label>
                            <Input
                                id="loanAmount"
                                type="number"
                                placeholder="e.g., 1500000"
                                value={loanAmount || ''}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Purchase Price (Optional)</Label>
                            <Input
                                id="purchasePrice"
                                type="number"
                                placeholder="e.g., 2000000"
                                value={purchasePrice || ''}
                                onChange={(e) => setPurchasePrice(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                    
                     <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Notes / Instructions</Label>
                        <Textarea
                            id="additionalNotes"
                            placeholder="Provide any other specific requirements for this deal..."
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                        />
                    </div>


                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Instructions
                    </Button>

                    {results && (
                        <div className="space-y-6 pt-6">
                             <h3 className="font-headline text-2xl font-bold flex items-center gap-2"><BookCopy />Generated Instructions</h3>
                             <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-lg">Title Company Instructions</h4>
                                        <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(results.titleInstructions, 'Title')}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea value={results.titleInstructions} readOnly className="h-96 font-mono text-xs" />
                                </div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-lg">Escrow Company Instructions</h4>
                                         <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(results.escrowInstructions, 'Escrow')}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea value={results.escrowInstructions} readOnly className="h-96 font-mono text-xs" />
                                </div>
                             </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
