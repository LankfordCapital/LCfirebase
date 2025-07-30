
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, AlertTriangle, CheckCircle, FileUp } from 'lucide-react';
import { generateConstructionFeasibilityReport } from '@/ai/flows/construction-feasibility-flow';
import { type GenerateConstructionFeasibilityOutput } from '@/ai/flows/construction-feasibility-types';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CustomLoader } from '@/components/ui/custom-loader';

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function ConstructionFeasibilityPage() {
    const [address, setAddress] = useState('');
    const [dealType, setDealType] = useState('');
    const [constructionBudgetText, setConstructionBudgetText] = useState('');
    const [workSunkText, setWorkSunkText] = useState('');
    const [plansFile, setPlansFile] = useState<File | null>(null);
    const [inspectionFile, setInspectionFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<GenerateConstructionFeasibilityOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateReport = async () => {
        if (!address || !dealType || !constructionBudgetText) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide address, deal type, and construction budget.',
            });
            return;
        }
        setIsLoading(true);
        setResults(null);

        try {
            const plansDataUri = plansFile ? await fileToDataUri(plansFile) : undefined;
            const siteInspectionDataUri = inspectionFile ? await fileToDataUri(inspectionFile) : undefined;

            const response = await generateConstructionFeasibilityReport({
                subjectPropertyAddress: address,
                dealType,
                constructionBudgetText,
                workSunkText,
                plansDataUri,
                siteInspectionDataUri,
            });
            setResults(response);
            toast({
                title: 'Report Generated',
                description: 'Construction feasibility analysis is complete.',
            });
        } catch (error) {
            console.error('Construction Feasibility Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'An error occurred while generating the feasibility report.',
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
                <h1 className="font-headline text-3xl font-bold">Construction Feasibility Report</h1>
                <p className="text-muted-foreground">
                    Analyze a project's budget against local costs and plans.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Feasibility Analyzer</CardTitle>
                    <CardDescription>Provide project details to generate an AI-powered feasibility report.</CardDescription>
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
                                placeholder="e.g., Ground Up Construction, Commercial Rehab"
                                value={dealType}
                                onChange={(e) => setDealType(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="constructionBudgetText">Construction Budget</Label>
                            <Textarea
                                id="constructionBudgetText"
                                placeholder="Paste the full construction budget here..."
                                value={constructionBudgetText}
                                onChange={(e) => setConstructionBudgetText(e.target.value)}
                                className="h-48 font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workSunkText">Work Sunk Report (Optional)</Label>
                            <Textarea
                                id="workSunkText"
                                placeholder="Paste the report of work already completed..."
                                value={workSunkText}
                                onChange={(e) => setWorkSunkText(e.target.value)}
                                className="h-48 font-mono text-xs"
                            />
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="plansFile">Architectural Plans (Optional)</Label>
                            <Input id="plansFile" type="file" onChange={(e) => setPlansFile(e.target.files?.[0] || null)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="inspectionFile">Site Inspection Report (Optional)</Label>
                            <Input id="inspectionFile" type="file" onChange={(e) => setInspectionFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>


                    <Button onClick={handleGenerateReport} disabled={isLoading}>
                        {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Feasibility Report
                    </Button>

                    {results && (
                        <div className="space-y-4 pt-6">
                            <h3 className="font-headline text-2xl font-bold">Feasibility Report for: {address}</h3>
                            
                            <Card className={results.isFeasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {results.isFeasible ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-red-600" />}
                                        Budget is Deemed {results.isFeasible ? 'Feasible' : 'Not Feasible'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium">{results.feasibilitySummary}</p>
                                    {!results.isFeasible && results.potentialShortfall && (
                                        <p className="text-red-600 font-bold text-lg mt-2">
                                            Potential Shortfall: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(results.potentialShortfall)}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                             <Accordion type="multiple" defaultValue={['costAnalysis', 'recommendations']} className="w-full">
                                <AccordionItem value="costAnalysis">
                                    <AccordionTrigger className="text-lg font-semibold">Cost Analysis</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2 whitespace-pre-line">
                                        {renderReportContent(results.costAnalysis)}
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="recommendations">
                                    <AccordionTrigger className="text-lg font-semibold">Recommendations</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none pt-2">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {results.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                        </ul>
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
