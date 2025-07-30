
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { generateComparablePropertyReport } from '@/ai/flows/generate-comparable-property-report-flow';
import { type GenerateComparablePropertyReportOutput } from '@/ai/flows/comparable-property-report-types';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CustomLoader } from '@/components/ui/custom-loader';

export default function ComparablePropertyReportPage() {
    const [address, setAddress] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [proformaText, setProformaText] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<GenerateComparablePropertyReportOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateReport = async () => {
        if (!address || !propertyType || !proformaText) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide all required fields to generate the report.',
            });
            return;
        }
        setIsLoading(true);
        setResults(null);

        try {
            const response = await generateComparablePropertyReport({
                subjectPropertyAddress: address,
                propertyType,
                proformaText,
            });
            setResults(response);
            toast({
                title: 'Report Generated',
                description: 'Comparable property analysis is complete.',
            });
        } catch (error) {
            console.error('Comparable Property Report Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the comparable property report.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderReportContent = (content: string) => {
        return content.split('\\n').map((line, index) => {
             if (line.trim() === '') return <br key={index} />;
             return <p key={index} className="mb-2">{line}</p>;
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Comparable Property Report</h1>
                <p className="text-muted-foreground">
                    Generate an AI-powered appraisal and market analysis report.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Report Generator</CardTitle>
                    <CardDescription>Provide property details and its financial proforma to generate the report.</CardDescription>
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
                            <Label htmlFor="propertyType">Property Type</Label>
                            <Input
                                id="propertyType"
                                placeholder="e.g., Multi-Family, Retail Strip Center"
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="proformaText">Property Proforma / Financial Projections</Label>
                        <Textarea
                            id="proformaText"
                            placeholder="Paste the property's proforma, rent roll, or financial summary here..."
                            value={proformaText}
                            onChange={(e) => setProformaText(e.target.value)}
                            className="h-48 font-mono text-xs"
                        />
                    </div>

                    <Button onClick={handleGenerateReport} disabled={isLoading}>
                        {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Comparable Property Report
                    </Button>

                    {results && (
                        <div className="space-y-4 pt-6">
                            <h3 className="font-headline text-2xl font-bold">Analysis Report for: {address}</h3>
                            
                             <Accordion type="multiple" defaultValue={['proformaVsMarketAnalysis', 'finalConclusion']} className="w-full">
                                <AccordionItem value="proformaVsMarketAnalysis">
                                    <AccordionTrigger className="text-lg font-semibold">Proforma vs. Market Analysis</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2 whitespace-pre-line">
                                        {renderReportContent(results.proformaVsMarketAnalysis)}
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="comparableSalesAnalysis">
                                    <AccordionTrigger className="text-lg font-semibold">Comparable Sales Analysis</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2 whitespace-pre-line">
                                        {renderReportContent(results.comparableSalesAnalysis)}
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="rentalMarketAnalysis">
                                    <AccordionTrigger className="text-lg font-semibold">Rental Market Analysis</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2 whitespace-pre-line">
                                        {renderReportContent(results.rentalMarketAnalysis)}
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="finalConclusion">
                                    <AccordionTrigger className="text-lg font-semibold">Final Conclusion</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2 whitespace-pre-line">
                                        {renderReportContent(results.finalConclusion)}
                                    </AccordionContent>
                                </AccordionItem>
                             </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
