

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2, Briefcase, FileUp, FileText } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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
  const [transactionType, setTransactionType] = useState('purchase');
  const [originalPurchasePrice, setOriginalPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [currentDebt, setCurrentDebt] = useState('');
  const [afterConstructedValue, setAfterConstructedValue] = useState('');
  const [stabilizedValue, setStabilizedValue] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [otherPropertyType, setOtherPropertyType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEin, setCompanyEin] = useState('');

  const { documents, addDocument } = useDocumentContext();
  const router = useRouter();
  
  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-2`);
  };
  
  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: itemName,
            file,
            status: 'uploaded',
        });
    }
  }, [addDocument]);

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
        <div className="flex items-center gap-3">
          {doc?.status === 'uploaded' && <FileUp className="h-5 w-5 text-blue-500" />}
          {!doc && <FileText className="h-5 w-5 text-muted-foreground" />}
          <Label htmlFor={fileInputId} className="font-medium">{name}</Label>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input id={fileInputId} type="file" className="w-full sm:w-auto" onChange={(e) => handleFileChange(name, e)} disabled={!!doc} />
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 1 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Loan & Property Details</CardTitle>
                <CardDescription>Provide the key details about the loan you are requesting and the subject property.</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={setPropertyType} value={propertyType}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multi-family">Multi Family</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {propertyType === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="otherPropertyType">Please specify property type</Label>
                    <Input id="otherPropertyType" value={otherPropertyType} onChange={e => setOtherPropertyType(e.target.value)} />
                  </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount Requested</Label>
                    <Input id="loanAmount" type="number" placeholder="e.g., 300000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                    <Label className="font-semibold">Transaction Type</Label>
                    <RadioGroup value={transactionType} onValueChange={setTransactionType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="purchase" id="purchase" />
                        <Label htmlFor="purchase">Purchase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="refinance" id="refinance" />
                        <Label htmlFor="refinance">Refinance</Label>
                    </div>
                    </RadioGroup>

                    {transactionType === 'purchase' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">Purchase Price</Label>
                                <Input id="purchasePrice" type="number" placeholder="e.g., 400000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
                            </div>
                            <DocumentUploadInput name="Executed Purchase Contract" />
                            <DocumentUploadInput name="Evidence of Earnest Money Deposit" />
                        </div>
                    )}

                    {transactionType === 'refinance' && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="originalPurchasePrice">Original Purchase Price</Label>
                                <Input id="originalPurchasePrice" type="number" placeholder="e.g., 350000" value={originalPurchasePrice} onChange={e => setOriginalPurchasePrice(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Date of Purchase</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !purchaseDate && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={purchaseDate}
                                        onSelect={setPurchaseDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentDebt">Current Debt on Property</Label>
                                <Input id="currentDebt" type="number" placeholder="e.g., 150000" value={currentDebt} onChange={e => setCurrentDebt(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="asIsValue">As Is Value</Label>
                        <Input id="asIsValue" type="number" placeholder="e.g., 350000" value={asIsValue} onChange={e => setAsIsValue(e.target.value)} />
                    </div>
                </div>
                
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="afterConstructedValue">After Constructed Value</Label>
                        <Input id="afterConstructedValue" type="number" placeholder="e.g., 1000000" value={afterConstructedValue} onChange={e => setAfterConstructedValue(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stabilizedValue">Stabilized Value</Label>
                        <Input id="stabilizedValue" type="number" placeholder="e.g., 1200000" value={stabilizedValue} onChange={e => setStabilizedValue(e.target.value)} />
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
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Borrowing Entity</CardTitle>
                <CardDescription>Provide details about the borrowing company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="e.g., Real Estate Holdings LLC" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyEin">Company EIN</Label>
                        <Input id="companyEin" placeholder="e.g., 12-3456789" value={companyEin} onChange={e => setCompanyEin(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                    <DocumentUploadInput name="EIN Certificate (Company)" />
                    <DocumentUploadInput name="Formation Documentation (Company)" />
                    <DocumentUploadInput name="Operating Agreement/Bylaws (Company)" />
                    <DocumentUploadInput name="Partnership/Officer List (Company)" />
                    <DocumentUploadInput name="Business License (Company)" />
                    <DocumentUploadInput name="Certificate of Good Standing (Company)" />
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
