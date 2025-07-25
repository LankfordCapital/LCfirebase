

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { useDocumentContext } from '@/contexts/document-context';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LoanApplicationClient({ loanProgram }: { loanProgram: string}) {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyApn, setPropertyApn] = useState('');
  const [propertyTaxes, setPropertyTaxes] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [rehabCost, setRehabCost] = useState('');
  const [asIsValue, setAsIsValue] = useState('');
  const [afterRepairValue, setAfterRepairValue] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [propertySqFt, setPropertySqFt] = useState('');
  const [constructionTime, setConstructionTime] = useState('');
  const [requestedClosingDate, setRequestedClosingDate] = useState<Date>();
  const [projectChange, setProjectChange] = useState('');

  const router = useRouter();
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-2`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 1 of 7</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Loan Details</CardTitle>
                <CardDescription>Provide the key details about the loan you are requesting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Subject Property Address</Label>
                    <Input id="propertyAddress" placeholder="123 Main St, Anytown, USA" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyApn">Property APN</Label>
                        <Input id="propertyApn" placeholder="e.g., 123-456-789" value={propertyApn} onChange={e => setPropertyApn(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
                        <Input id="propertyTaxes" type="number" placeholder="e.g., 5000" value={propertyTaxes} onChange={e => setPropertyTaxes(e.target.value)} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount</Label>
                        <Input id="loanAmount" type="number" placeholder="e.g., 300000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price</Label>
                        <Input id="purchasePrice" type="number" placeholder="e.g., 400000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rehabCost">Requested Rehab Amount</Label>
                    <Input id="rehabCost" type="number" placeholder="e.g., 50000" value={rehabCost} onChange={e => setRehabCost(e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="asIsValue">As Is Value</Label>
                        <Input id="asIsValue" type="number" placeholder="e.g., 350000" value={asIsValue} onChange={e => setAsIsValue(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="afterRepairValue">After Repair Value (ARV)</Label>
                        <Input id="afterRepairValue" type="number" placeholder="e.g., 550000" value={afterRepairValue} onChange={e => setAfterRepairValue(e.target.value)} />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertySqFt">Subject Property Square Footage</Label>
                        <Input id="propertySqFt" type="number" placeholder="e.g., 2000" value={propertySqFt} onChange={e => setPropertySqFt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lotSize">Lot Size (in sq. ft. or acres)</Label>
                        <Input id="lotSize" placeholder="e.g., 10,000 sq. ft. or 0.23 acres" value={lotSize} onChange={e => setLotSize(e.target.value)} />
                    </div>
                </div>
                {loanProgram.includes('Fix and Flip') && (
                    <div className="space-y-2">
                        <Label htmlFor="project-change">Is any of the following happening?</Label>
                        <Select onValueChange={setProjectChange} value={projectChange}>
                            <SelectTrigger id="project-change">
                                <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="expand-horizontal">Expanding the square footage (Horizontally)</SelectItem>
                                <SelectItem value="expand-vertical">Expanding the square footage (Vertically)</SelectItem>
                                <SelectItem value="expand-both">Expanding the square footage (Horizontally and Vertically)</SelectItem>
                                <SelectItem value="change-units">Changing the unit count</SelectItem>
                                <SelectItem value="convert-condo">Converting to Condominiums</SelectItem>
                                <SelectItem value="add-adu">Adding or Converting to an ADU (accessory dwelling unit)</SelectItem>
                                <SelectItem value="repair-fire">Repairing fire damage</SelectItem>
                                <SelectItem value="repair-water">Repairing water damage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="constructionTime">Estimated Time to Construct (in months)</Label>
                        <Input id="constructionTime" type="number" placeholder="e.g., 6" value={constructionTime} onChange={e => setConstructionTime(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="closingDate">Requested Closing Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !requestedClosingDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {requestedClosingDate ? format(requestedClosingDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={requestedClosingDate}
                                onSelect={setRequestedClosingDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end items-center">
            <Button onClick={handleContinue}>
                Continue to Page 2 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
