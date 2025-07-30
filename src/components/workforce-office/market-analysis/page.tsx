
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { generateMarketAnalysis } from '@/ai/flows/market-analysis-flow';
import { type GenerateMarketAnalysisOutput } from '@/ai/flows/market-analysis-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CustomLoader } from '@/components/ui/custom-loader';

type ReportType = 'trafficStudy' | 'demographics' | 'economicDrivers' | 'zoning';

const reportOptions: { id: ReportType; label: string }[] = [
    { id: 'trafficStudy', label: 'Traffic Study' },
    { id: 'demographics', label: 'Demographics Report' },
    { id: 'economicDrivers', label: 'Economic Drivers Report' },
    { id: 'zoning', label: 'Zoning & Use Certificate' },
];

export default function MarketAnalysisPage() {
    const [address, setAddress] = useState('');
    const [dealType, setDealType] = useState('');
    const [selectedReports, setSelectedReports] = useState<ReportType[]>(['demographics', 'economicDrivers']);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<GenerateMarketAnalysisOutput | null>(null);
    const { toast } = useToast();

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
        setResults(null);
        try {
            const response = await generateMarketAnalysis({
                subjectPropertyAddress: address,
                dealType,
                reportTypes: selectedReports,
            });
            setResults(response);
            toast({
                title: 'Reports Generated',
                description: 'Market analysis reports have been successfully created.',
            });
        } catch (error) {
            console.error('Market Analysis Error:', error);
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
            if (line.startsWith('-')) {
                return <li key={index} className="ml-4 list-disc">{line.substring(1).trim()}</li>;
            }
             if (line.match(/^\d+\./)) {
                return <p key={index} className="mt-2">{line}</p>;
            }
            if(line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index}>{line}</p>;
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Market Analysis Reports</h1>
                <p className="text-muted-foreground">
                    Generate data-driven reports for any subject property using AI.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Report Generator</CardTitle>
                    <CardDescription>Enter a property address and select the reports you need.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Subject Property Address</Label>
                            <Input
                                id="address"
                                placeholder="e.g., 123 Main St, Anytown, USA"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dealType">Deal Type / Property Focus</Label>
                            <Input
                                id="dealType"
                                placeholder="e.g., Commercial Retail, Multi-Family Residential"
                                value={dealType}
                                onChange={(e) => setDealType(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Select Reports to Generate</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                            {reportOptions.map(option => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option.id}
                                        checked={selectedReports.includes(option.id)}
                                        onCheckedChange={() => handleReportSelection(option.id)}
                                    />
                                    <Label htmlFor={option.id} className="font-medium">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleGenerateReports} disabled={isLoading}>
                        {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Reports
                    </Button>

                    {results && (
                        <div className="space-y-4 pt-6">
                             <h3 className="font-headline text-2xl font-bold">Generated Reports for: {address}</h3>
                             <Accordion type="multiple" defaultValue={selectedReports} className="w-full">
                                {results.trafficStudy && (
                                    <AccordionItem value="trafficStudy">
                                        <AccordionTrigger className="text-lg font-semibold">Traffic Study</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm max-w-none pt-2">
                                            {renderReportContent(results.trafficStudy)}
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                                 {results.demographics && (
                                    <AccordionItem value="demographics">
                                        <AccordionTrigger className="text-lg font-semibold">Demographics Report</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm max-w-none pt-2">
                                             {renderReportContent(results.demographics)}
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                                 {results.economicDrivers && (
                                    <AccordionItem value="economicDrivers">
                                        <AccordionTrigger className="text-lg font-semibold">Economic Drivers Report</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm max-w-none pt-2">
                                             {renderReportContent(results.economicDrivers)}
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                                 {results.zoning && (
                                    <AccordionItem value="zoning">
                                        <AccordionTrigger className="text-lg font-semibold">Zoning & Use Report</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm max-w-none pt-2">
                                             {renderReportContent(results.zoning)}
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                             </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
