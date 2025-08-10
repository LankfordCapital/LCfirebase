
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, User, Percent, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { findBestLenders, type LenderProfile, type LenderMatchOutput } from '@/ai/flows/lender-match-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function LenderMatcherPage() {
    const [dealId, setDealId] = useState('');
    const [loanAmount, setLoanAmount] = useState<number>(0);
    const [propertyType, setPropertyType] = useState('');
    const [location, setLocation] = useState('');
    const [ltv, setLtv] = useState<number>(0);
    const [ltc, setLtc] = useState<number>(0);
    const [dealSummary, setDealSummary] = useState('');
    
    const [lenders, setLenders] = useState<LenderProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<LenderMatchOutput | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchLenders = async () => {
            const querySnapshot = await getDocs(collection(db, "lenders"));
            const lendersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LenderProfile[];
            setLenders(lendersData);
        };
        fetchLenders();
    }, []);

    const handleFindLenders = async () => {
        if (!dealId || !loanAmount || !propertyType || !location) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill in all required deal fields.',
            });
            return;
        }
        setIsLoading(true);
        setResults(null);

        try {
            const response = await findBestLenders({
                deal: { dealId, loanAmount, propertyType, location, ltv, ltc, dealSummary },
                lenders,
            });
            setResults(response);
            toast({
                title: 'Analysis Complete',
                description: 'Found the best lender matches for the deal.',
            });
        } catch (error) {
            console.error('Lender Match Error:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'An error occurred while finding lender matches.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Lender Matcher</h1>
                <p className="text-muted-foreground">
                    Find the best capital partners for your deal based on your lender database.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Deal Information</CardTitle>
                        <CardDescription>Enter the specifics of the deal you need to place.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="dealId">Deal ID</Label>
                            <Input id="dealId" value={dealId} onChange={(e) => setDealId(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount</Label>
                            <Input id="loanAmount" type="number" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="propertyType">Property Type</Label>
                            <Input id="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="location">Location (City, State)</Label>
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="ltv">LTV (%)</Label>
                                <Input id="ltv" type="number" value={ltv || ''} onChange={(e) => setLtv(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ltc">LTC (%)</Label>
                                <Input id="ltc" type="number" value={ltc || ''} onChange={(e) => setLtc(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dealSummary">Deal Summary</Label>
                            <Textarea id="dealSummary" value={dealSummary} onChange={(e) => setDealSummary(e.target.value)} placeholder="Briefly describe the deal..." />
                        </div>
                        <Button onClick={handleFindLenders} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Find Best Lenders
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                         <CardHeader>
                            <CardTitle>Top Lender Matches</CardTitle>
                            <CardDescription>AI-powered recommendations based on your lender database.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}
                            {!isLoading && !results && (
                                <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
                                    <p>Enter deal information and click "Find Best Lenders" to see results.</p>
                                </div>
                            )}
                            {results && (
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {results.bestMatches.map((match, index) => (
                                        <AccordionItem key={match.lenderId} value={`item-${index}`} className="border rounded-lg">
                                            <AccordionTrigger className="p-4 hover:no-underline">
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold text-2xl text-primary">{index + 1}</span>
                                                        <div>
                                                            <p className="font-semibold text-lg text-left">{match.lenderName}</p>
                                                             <p className="text-sm text-muted-foreground text-left">Match Score: {match.matchScore}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                                                        <Star className="h-5 w-5" />
                                                        <span>{match.matchScore}</span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4 border-t">
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{match.rationale}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
