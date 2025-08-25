
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Map, History, Shield, BookCopy, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { GenerateMarketAnalysisOutput } from '@/ai/flows/market-analysis-flow';
import type { GenerateComparablePropertyReportOutput } from '@/ai/flows/generate-comparable-property-report-flow';
import type { GenerateConstructionFeasibilityOutput } from '@/ai/flows/construction-feasibility-flow';
import type { GenerateMapReportOutput } from '@/ai/flows/generate-map-report-flow';
import type { GenerateSalesHistoryReportOutput } from '@/ai/flows/generate-sales-history-report-flow';
import type { GenerateTitleEscrowInstructionsOutput } from '@/ai/flows/generate-title-escrow-instructions-flow';
import type { GenerateInsuranceInstructionsOutput } from '@/ai/flows/generate-insurance-instructions-flow';

type ReportType = 'marketAnalysis' | 'zoning' | 'comparableProperty' | 'constructionFeasibility' | 'mapReport' | 'salesHistory' | 'titleEscrow' | 'insurance';

interface ReportResults {
    marketAnalysis?: GenerateMarketAnalysisOutput;
    comparableProperty?: GenerateComparablePropertyReportOutput;
    constructionFeasibility?: GenerateConstructionFeasibilityOutput;
    mapReport?: GenerateMapReportOutput;
    salesHistory?: GenerateSalesHistoryReportOutput;
    titleEscrow?: GenerateTitleEscrowInstructionsOutput;
    insurance?: GenerateInsuranceInstructionsOutput;
    zoning?: GenerateMarketAnalysisOutput;
}

interface StoredData {
    results: ReportResults;
    address: string;
    selectedReports: ReportType[];
}

export default function DueDiligenceResultsPage() {
    const [data, setData] = useState<StoredData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    const reportContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedResults = sessionStorage.getItem('dueDiligenceResults');
        if (storedResults) {
            setData(JSON.parse(storedResults));
        }
        setIsLoading(false);
    }, []);

    const handleExportPdf = async () => {
        if (!reportContainerRef.current) return;
        
        toast({ title: 'Generating PDF...' });

        const canvas = await html2canvas(reportContainerRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`due-diligence-report-${data?.address.replace(/\s/g, '-')}.pdf`);

        toast({ title: 'PDF Exported Successfully' });
    };

    const renderReportContent = (content: string | undefined) => {
        if (!content) return <p className="text-muted-foreground">Report not generated or no data found.</p>;
        return content.split('\\n').map((line, index) => {
             if (line.trim() === '') return <br key={index} />;
             return <p key={index} className="mb-2">{line}</p>;
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading results...</div>;
    }
    
    if (!data) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center">
                <h1 className="text-2xl font-bold">No Report Data Found</h1>
                <p className="text-muted-foreground">Please generate a report from the Due Diligence Hub first.</p>
                <Button onClick={() => router.push('/workforce-office/due-diligence')} className="mt-4">
                    Go Back to Hub
                </Button>
            </div>
        );
    }
    
    const { results, address, selectedReports } = data;

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <Button variant="outline" onClick={() => router.push('/workforce-office/due-diligence')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
                </Button>
                <Button onClick={handleExportPdf}>
                    <Download className="mr-2 h-4 w-4"/> Export as PDF
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Due Diligence Package</CardTitle>
                    <CardDescription>Address: {address}</CardDescription>
                </CardHeader>
                <CardContent ref={reportContainerRef} className="p-6 space-y-6">
                    {selectedReports.map(reportType => (
                        <div key={reportType}>
                            {reportType === 'marketAnalysis' && results.marketAnalysis && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
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
                            {reportType === 'zoning' && results.zoning && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-xl font-bold">Zoning Report</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                            {renderReportContent(results.zoning.zoning)}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                            {reportType === 'comparableProperty' && results.comparableProperty && (
                                 <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
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
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
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
                             {reportType === 'mapReport' && results.mapReport && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-xl font-bold flex items-center gap-2"><Map/> Map Report</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                            {renderReportContent(results.mapReport.mapDescription)}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                             {reportType === 'salesHistory' && results.salesHistory && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-xl font-bold flex items-center gap-2"><History/> Sales History Report</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                            {renderReportContent(results.salesHistory.salesHistory)}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                            {reportType === 'titleEscrow' && results.titleEscrow && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-xl font-bold flex items-center gap-2"><BookCopy/> Title & Escrow Instructions</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                            <div>
                                                <h4 className="font-semibold">Title Instructions</h4>
                                                <Textarea readOnly value={results.titleEscrow.titleInstructions} className="h-64 mt-2 font-mono text-xs"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Escrow Instructions</h4>
                                                <Textarea readOnly value={results.titleEscrow.escrowInstructions} className="h-64 mt-2 font-mono text-xs"/>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                             {reportType === 'insurance' && results.insurance && (
                                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-xl font-bold flex items-center gap-2"><Shield/> Insurance Instructions</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4 prose prose-sm max-w-none">
                                            <Textarea readOnly value={results.insurance.insuranceInstructions} className="h-64 font-mono text-xs"/>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
