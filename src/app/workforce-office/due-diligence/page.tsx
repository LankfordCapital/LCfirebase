
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, FileText, FileUp, Map, History, Shield, BookCopy } from 'lucide-react';
import { generateMarketAnalysis } from '@/ai/flows/market-analysis-flow';
import { generateComparablePropertyReport } from '@/ai/flows/generate-comparable-property-report-flow';
import { generateConstructionFeasibilityReport } from '@/ai/flows/construction-feasibility-flow';
import { generateMapReport } from '@/ai/flows/generate-map-report-flow';
import { generateSalesHistoryReport } from '@/ai/flows/generate-sales-history-report-flow';
import { generateTitleEscrowInstructions } from '@/ai/flows/generate-title-escrow-instructions-flow';
import { generateInsuranceInstructions } from '@/ai/flows/generate-insurance-instructions-flow';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

type ReportType = 'marketAnalysis' | 'zoning' | 'comparableProperty' | 'constructionFeasibility' | 'mapReport' | 'salesHistory' | 'titleEscrow' | 'insurance';

const reportOptions: { id: ReportType; label: string, description: string }[] = [
    { id: 'marketAnalysis', label: 'Market Analysis', description: 'Demographics, economic drivers, and traffic study.' },
    { id: 'zoning', label: 'Zoning Report', description: 'Zoning designation, permitted uses, and permit history.' },
    { id: 'comparableProperty', label: 'Comparable Property Report', description: 'Sales & lease comps, and proforma validation.' },
    { id: 'constructionFeasibility', label: 'Construction Feasibility', description: 'Budget vs. local costs and architectural plan analysis.' },
    { id: 'mapReport', label: 'Map Report', description: 'Text-based map describing nearby attractions and comps.' },
    { id: 'salesHistory', label: 'Sales History Report', description: 'Recorded sales history for the subject property.' },
    { id: 'titleEscrow', label: 'Title & Escrow Instructions', description: 'Generate instructions for closing agents.' },
    { id: 'insurance', label: 'Insurance Instructions', description: 'Generate coverage requirements for the insurance agent.' },
];

// Mock loan data - in a real app this would be fetched from your database
const activeLoans = [
    { id: "LL-00125", borrower: { name: "John Doe" }, property: "123 Main St, Anytown, CA 90210", type: "Fix and Flip", loanAmount: 350000, purchasePrice: 280000, constructionBudget: 50000 },
    { id: "LL-00127", borrower: { name: "Sam Wilson" }, property: "789 Pine Ln, Otherville, TX 75001", type: "Ground Up Construction", loanAmount: 1200000, purchasePrice: 300000, constructionBudget: 900000 },
    { id: "LL-00128", borrower: { name: "Alpha Corp" }, property: "101 Factory Rd, Industry, IL 60607", type: "Industrial Rehab", loanAmount: 2500000, purchasePrice: 1500000, constructionBudget: 1000000 },
];

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export default function DueDiligenceHubPage() {
    // Shared state
    const [address, setAddress] = useState('');
    const [dealType, setDealType] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [borrowerName, setBorrowerName] = useState('');
    const [loanAmount, setLoanAmount] = useState<number | undefined>();
    const [purchasePrice, setPurchasePrice] = useState<number | undefined>();
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Specific state
    const [proformaText, setProformaText] = useState('');
    const [constructionBudgetText, setConstructionBudgetText] = useState('');
    const [workSunkText, setWorkSunkText] = useState('');
    const [plansFile, setPlansFile] = useState<File | null>(null);

    const [selectedReports, setSelectedReports] = useState<ReportType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    const handleLoanSelect = (loanId: string) => {
        const selectedLoan = activeLoans.find(loan => loan.id === loanId);
        if (selectedLoan) {
            setAddress(selectedLoan.property);
            setBorrowerName(selectedLoan.borrower.name);
            setDealType(selectedLoan.type);
            setPropertyType(selectedLoan.type); // Or a more specific type if available
            setLoanAmount(selectedLoan.loanAmount);
            setPurchasePrice(selectedLoan.purchasePrice);
            setConstructionBudgetText(selectedLoan.constructionBudget?.toString() || '');
        }
    };


    const handleReportSelection = (reportId: ReportType) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const handleGenerateReports = async () => {
        if (!address || !dealType || selectedReports.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide an address, deal type, and select at least one report.',
            });
            return;
        }
        setIsLoading(true);
        
        try {
            const reportPromises = selectedReports.map(async (reportType) => {
                switch(reportType) {
                    case 'marketAnalysis':
                        return { type: reportType, data: await generateMarketAnalysis({ subjectPropertyAddress: address, dealType, reportTypes: ['demographics', 'economicDrivers', 'trafficStudy'] }) };
                    case 'zoning':
                        return { type: reportType, data: await generateMarketAnalysis({ subjectPropertyAddress: address, dealType, reportTypes: ['zoning'] }) };
                    case 'comparableProperty':
                        if (!proformaText) throw new Error("Proforma text is required for Comparable Property Report.");
                        return { type: reportType, data: await generateComparablePropertyReport({ subjectPropertyAddress: address, propertyType, proformaText }) };
                    case 'constructionFeasibility':
                        if (!constructionBudgetText) throw new Error("Construction budget is required for Feasibility Report.");
                        const plansDataUri = plansFile ? await fileToDataUri(plansFile) : undefined;
                        return { type: reportType, data: await generateConstructionFeasibilityReport({ subjectPropertyAddress: address, dealType, constructionBudgetText, workSunkText, plansDataUri }) };
                    case 'mapReport':
                        return { type: reportType, data: await generateMapReport({ subjectPropertyAddress: address }) };
                    case 'salesHistory':
                        return { type: reportType, data: await generateSalesHistoryReport({ subjectPropertyAddress: address }) };
                    case 'titleEscrow':
                        if (!borrowerName || !loanAmount) throw new Error("Borrower name and loan amount required for Title/Escrow instructions.");
                        return { type: reportType, data: await generateTitleEscrowInstructions({ subjectPropertyAddress: address, dealType, propertyType, loanAmount, borrowerName, purchasePrice, additionalNotes }) };
                    case 'insurance':
                        if (!borrowerName || !loanAmount) throw new Error("Borrower name and loan amount required for Insurance instructions.");
                        return { type: reportType, data: await generateInsuranceInstructions({ subjectPropertyAddress: address, dealType, propertyType, loanAmount, borrowerName, purchasePrice, constructionBudget: parseFloat(constructionBudgetText) || undefined, additionalNotes }) };
                    default:
                        return null;
                }
            });

            const settledResults = await Promise.allSettled(reportPromises);
            
            const finalResults: Record<string, any> = {};
            settledResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    finalResults[result.value.type as keyof typeof finalResults] = result.value.data as any;
                } else if (result.status === 'rejected') {
                    console.error('A report failed to generate:', result.reason);
                     toast({
                        variant: 'destructive',
                        title: 'Report Generation Error',
                        description: (result.reason as Error).message || 'One or more reports failed to generate.',
                    });
                }
            });

            // Store results in sessionStorage to pass to the results page
            sessionStorage.setItem('dueDiligenceResults', JSON.stringify({
                results: finalResults,
                address,
                selectedReports
            }));
            
            toast({
                title: 'Reports Generated',
                description: 'Redirecting to results page...',
            });

            router.push('/workforce-office/due-diligence/results');

        } catch (error) {
             console.error('Due Diligence Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the reports.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Due Diligence Hub</h1>
                <p className="text-muted-foreground">
                    Order a complete package of AI-powered due diligence reports for any deal.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>New Due Diligence Request</CardTitle>
                    <CardDescription>Select an active loan to auto-fill details or enter them manually.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="loan-select">Select Active Loan</Label>
                        <Select onValueChange={handleLoanSelect}>
                            <SelectTrigger id="loan-select">
                                <SelectValue placeholder="Select a loan to begin..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activeLoans.map(loan => (
                                    <SelectItem key={loan.id} value={loan.id}>
                                        {loan.id} - {loan.borrower.name} - {loan.property}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Subject Property Address</Label>
                            <Input id="address" placeholder="e.g., 123 Main St, Anytown, USA" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dealType">Deal Type</Label>
                            <Input id="dealType" placeholder="e.g., Fix and Flip, Commercial Acquisition" value={dealType} onChange={(e) => setDealType(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="propertyType">Property Type</Label>
                            <Input id="propertyType" placeholder="e.g., Multi-Family, Retail, Industrial" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="borrowerName">Borrower Name / Entity</Label>
                            <Input id="borrowerName" placeholder="e.g., John Doe or ABC Holdings LLC" value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount</Label>
                            <Input id="loanAmount" type="number" placeholder="e.g., 1500000" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Purchase Price (Optional)</Label>
                            <Input id="purchasePrice" type="number" placeholder="e.g., 2000000" value={purchasePrice || ''} onChange={(e) => setPurchasePrice(e.target.value ? Number(e.target.value) : undefined)} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Select Reports to Generate</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {reportOptions.map(option => (
                                <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-md has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                                    <Checkbox id={option.id} checked={selectedReports.includes(option.id)} onCheckedChange={() => handleReportSelection(option.id)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <label htmlFor={option.id} className="font-semibold cursor-pointer">{option.label}</label>
                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedReports.includes('comparableProperty') && (
                        <div className="space-y-2">
                            <Label htmlFor="proformaText">Property Proforma (for Comparable Property Report)</Label>
                            <Textarea id="proformaText" placeholder="Paste the property's proforma, rent roll, or financial summary here..." value={proformaText} onChange={(e) => setProformaText(e.target.value)} className="h-32 font-mono text-xs" />
                        </div>
                    )}

                    {selectedReports.includes('constructionFeasibility') && (
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="constructionBudgetText">Construction Budget (for Feasibility Report)</Label>
                                <Textarea id="constructionBudgetText" placeholder="Paste the full construction budget here..." value={constructionBudgetText} onChange={(e) => setConstructionBudgetText(e.target.value)} className="h-32 font-mono text-xs"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workSunkText">Work Sunk Report (Optional)</Label>
                                <Textarea id="workSunkText" placeholder="Paste work already completed..." value={workSunkText} onChange={(e) => setWorkSunkText(e.target.value)} className="h-32 font-mono text-xs"/>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                               <Label htmlFor="plansFile">Architectural Plans (Optional)</Label>
                               <Input id="plansFile" type="file" onChange={(e) => setPlansFile(e.target.files?.[0] || null)} />
                           </div>
                        </div>
                    )}
                    
                     {(selectedReports.includes('titleEscrow') || selectedReports.includes('insurance')) && (
                        <div className="space-y-2">
                            <Label htmlFor="additionalNotes">Additional Notes (for Instructions)</Label>
                            <Textarea id="additionalNotes" placeholder="Provide any other specific requirements for this deal..." value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                        </div>
                     )}


                    <Button onClick={handleGenerateReports} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Due Diligence Package
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
