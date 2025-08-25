
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, FileText, FileUp } from 'lucide-react';
import { generateMarketAnalysis, type GenerateMarketAnalysisOutput } from '@/ai/flows/market-analysis-flow';
import { generateComparablePropertyReport, type GenerateComparablePropertyReportOutput } from '@/ai/flows/generate-comparable-property-report-flow';
import { generateConstructionFeasibilityReport, type GenerateConstructionFeasibilityOutput } from '@/ai/flows/construction-feasibility-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ReportType = 'marketAnalysis' | 'comparableProperty' | 'constructionFeasibility';

const reportOptions: { id: ReportType; label: string, description: string }[] = [
    { id: 'marketAnalysis', label: 'Market Analysis', description: 'Demographics, economic drivers, zoning, etc.' },
    { id: 'comparableProperty', label: 'Comparable Property Report', description: 'Sales comps, rental market, and proforma validation.' },
    { id: 'constructionFeasibility', label: 'Construction Feasibility', description: 'Budget vs. local costs analysis.' },
];

interface ReportResults {
    marketAnalysis?: GenerateMarketAnalysisOutput;
    comparableProperty?: GenerateComparablePropertyReportOutput;
    constructionFeasibility?: GenerateConstructionFeasibilityOutput;
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export default function DueDiligenceHubPage() {
    const [address, setAddress] = useState('');
    const [dealType, setDealType] = useState('');
    const [proformaText, setProformaText] = useState('');
    const [constructionBudgetText, setConstructionBudgetText] = useState('');
    const [workSunkText, setWorkSunkText] = useState('');
    const [plansFile, setPlansFile] = useState<File | null>(null);

    const [selectedReports, setSelectedReports] = useState<ReportType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ReportResults | null>(null);
    const { toast } = useToast();
    const reportContainerRef = useRef<HTMLDivElement>(null);

    const handleReportSelection = (reportId: ReportType) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };
    
    const handleExportPdf = async () => {
        if (!reportContainerRef.current) return;
        
        toast({ title: 'Generating PDF...' });

        const canvas = await html2canvas(reportContainerRef.current, { scale: 2 });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`due-diligence-report-${address.replace(/\s/g, '-')}.pdf`);

        toast({ title: 'PDF Exported Successfully' });
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
        setResults(null);
        
        try {
            const reportPromises = selectedReports.map(async (reportType) => {
                switch(reportType) {
                    case 'marketAnalysis':
                        return { type: reportType, data: await generateMarketAnalysis({ subjectPropertyAddress: address, dealType, reportTypes: ['demographics', 'economicDrivers', 'zoning', 'trafficStudy'] }) };
                    case 'comparableProperty':
                        if (!proformaText) throw new Error("Proforma text is required for Comparable Property Report.");
                        return { type: reportType, data: await generateComparablePropertyReport({ subjectPropertyAddress: address, propertyType: dealType, proformaText }) };
                    case 'constructionFeasibility':
                        if (!constructionBudgetText) throw new Error("Construction budget is required for Feasibility Report.");
                        const plansDataUri = plansFile ? await fileToDataUri(plansFile) : undefined;
                        return { type: reportType, data: await generateConstructionFeasibilityReport({ subjectPropertyAddress: address, dealType, constructionBudgetText, workSunkText, plansDataUri }) };
                    default:
                        return null;
                }
            });

            const settledResults = await Promise.allSettled(reportPromises);
            
            const finalResults: ReportResults = {};
            settledResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    finalResults[result.value.type as keyof ReportResults] = result.value.data as any;
                } else if (result.status === 'rejected') {
                    console.error('A report failed to generate:', result.reason);
                     toast({
                        variant: 'destructive',
                        title: 'Report Generation Error',
                        description: (result.reason as Error).message || 'One or more reports failed to generate.',
                    });
                }
            });

            setResults(finalResults);
            toast({
                title: 'Reports Generated',
                description: 'Due diligence reports have been successfully created.',
            });

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
    
    const renderReportContent = (content: string | undefined) => {
        if (!content) return <p className="text-muted-foreground">Report not generated or no data found.</p>;
        
        return content.split('\\n').map((line, index) => {
            if (line.trim() === '') return <br key={index} />;
            return <p key={index} className="mb-2">{line}</p>;
        });
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
                    <CardDescription>Enter a property address and select the reports you need.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Subject Property Address</Label>
                            <Input id="address" placeholder="e.g., 123 Main St, Anytown, USA" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dealType">Deal Type / Property Focus</Label>
                            <Input id="dealType" placeholder="e.g., Multi-Family, Retail, Fix and Flip" value={dealType} onChange={(e) => setDealType(e.target.value)} />
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


                    <Button onClick={handleGenerateReports} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Due Diligence Package
                    </Button>
                </CardContent>
            </Card>

            {results && (
                 <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                             <CardTitle>Generated Due Diligence Package</CardTitle>
                             <CardDescription>Address: {address}</CardDescription>
                        </div>
                        <Button onClick={handleExportPdf}>
                            <Download className="mr-2 h-4 w-4"/> Export as PDF
                        </Button>
                    </CardHeader>
                    <CardContent ref={reportContainerRef} className="p-6 space-y-6">
                        {selectedReports.map(reportType => (
                            <div key={reportType}>
                                {reportType === 'marketAnalysis' && results.marketAnalysis && (
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-xl font-bold">Market Analysis Report</AccordionTrigger>
                                            <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                                {Object.entries(results.marketAnalysis).map(([key, value]) => value && (
                                                    <div key={key}>
                                                        <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                                        <div>{renderReportContent(value)}</div>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                                {reportType === 'comparableProperty' && results.comparableProperty && (
                                     <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-xl font-bold">Comparable Property Report</AccordionTrigger>
                                            <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                                {Object.entries(results.comparableProperty).map(([key, value]) => value && (
                                                     <div key={key}>
                                                        <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                                        <div className="whitespace-pre-line">{renderReportContent(value)}</div>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                                {reportType === 'constructionFeasibility' && results.constructionFeasibility && (
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                             <AccordionTrigger className="text-xl font-bold">Construction Feasibility Report</AccordionTrigger>
                                              <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                                 <div className={results.constructionFeasibility.isFeasible ? 'text-green-600' : 'text-red-600'}>
                                                    <h4 className="font-semibold">Feasibility: {results.constructionFeasibility.isFeasible ? 'FEASIBLE' : 'NOT FEASIBLE'}</h4>
                                                    <p>{results.constructionFeasibility.feasibilitySummary}</p>
                                                     {!results.constructionFeasibility.isFeasible && results.constructionFeasibility.potentialShortfall && (
                                                        <p className="font-bold">Potential Shortfall: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(results.constructionFeasibility.potentialShortfall)}</p>
                                                    )}
                                                 </div>
                                                 <div>
                                                    <h4 className="font-semibold">Cost Analysis</h4>
                                                    <div className="whitespace-pre-line">{renderReportContent(results.constructionFeasibility.costAnalysis)}</div>
                                                 </div>
                                                  <div>
                                                    <h4 className="font-semibold">Recommendations</h4>
                                                    <ul className="list-disc pl-5">
                                                        {results.constructionFeasibility.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                                    </ul>
                                                 </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

