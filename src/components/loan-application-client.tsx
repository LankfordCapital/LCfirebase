

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2, Briefcase, FileUp, FileText, Layers, DollarSign, Truck } from 'lucide-react';
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
import { Textarea } from './ui/textarea';

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

  // Land Acquisition specific fields
  const [entitlementStatus, setEntitlementStatus] = useState('');
  const [developmentCosts, setDevelopmentCosts] = useState('');
  const [afterDevelopmentValue, setAfterDevelopmentValue] = useState('');

  // Mezzanine Loan specific fields
  const [seniorLoanAmount, setSeniorLoanAmount] = useState('');
  const [capitalStack, setCapitalStack] = useState('');
  
  // Mobilization Funding specific fields
  const [contractValue, setContractValue] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [clientName, setClientName] = useState('');

  // Equipment Financing specific fields
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [equipmentCost, setEquipmentCost] = useState('');
  const [equipmentSeller, setEquipmentSeller] = useState('');


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

  const isIndustrial = loanProgram.toLowerCase().includes('industrial');
  const isLandAcquisition = loanProgram.toLowerCase().includes('land acquisition');
  const isMezzanine = loanProgram.toLowerCase().includes('mezzanine');
  const isMobilization = loanProgram.toLowerCase().includes('mobilization funding');
  const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');


  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 1 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Loan & {isMobilization ? 'Project' : isEquipmentFinancing ? 'Equipment' : 'Property'} Details</CardTitle>
                <CardDescription>Provide the key details about the loan you are requesting and the subject {isMobilization ? 'project' : isEquipmentFinancing ? 'equipment' : 'property'}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                
                {isMobilization ? (
                    <>
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><DollarSign className="h-5 w-5" /> Mobilization Funding Details</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fundingAmount">Funding Amount Requested</Label>
                                    <Input id="fundingAmount" type="number" placeholder="e.g., 50000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contractValue">Total Contract Value</Label>
                                    <Input id="contractValue" type="number" placeholder="e.g., 250000" value={contractValue} onChange={e => setContractValue(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="clientName">Client/Payor Name</Label>
                                    <Input id="clientName" placeholder="e.g., General Construction Co." value={clientName} onChange={e => setClientName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectDescription">Brief Project Description</Label>
                                    <Textarea id="projectDescription" placeholder="Briefly describe the project, its scope, and timeline..." value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
                                </div>
                                <DocumentUploadInput name="Executed Contract for the project" />
                                <DocumentUploadInput name="Detailed Use of Funds" />
                            </CardContent>
                        </Card>
                    </>
                ) : isEquipmentFinancing ? (
                     <Card className="bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary"><Truck className="h-5 w-5" /> Equipment Financing Details</CardTitle>
                        </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="loanAmount">Loan Amount Requested</Label>
                                <Input id="loanAmount" type="number" placeholder="e.g., 75000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="equipmentCost">Total Equipment Cost</Label>
                                <Input id="equipmentCost" type="number" placeholder="e.g., 100000" value={equipmentCost} onChange={e => setEquipmentCost(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="equipmentSeller">Dealer/Seller Name</Label>
                                <Input id="equipmentSeller" placeholder="e.g., Heavy Machinery Inc." value={equipmentSeller} onChange={e => setEquipmentSeller(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="equipmentDescription">Equipment Description</Label>
                                <Textarea id="equipmentDescription" placeholder="Describe the equipment (make, model, year, condition, etc.)..." value={equipmentDescription} onChange={e => setEquipmentDescription(e.target.value)} />
                            </div>
                            <DocumentUploadInput name="Equipment Quote or Invoice" />
                        </CardContent>
                    </Card>
                ) : (
                <>
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

                {!isLandAcquisition && <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={setPropertyType} value={propertyType}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {isIndustrial ? (
                        <>
                          <SelectItem value="warehouses">Warehouses</SelectItem>
                          <SelectItem value="light-industrial">Light Industrial</SelectItem>
                          <SelectItem value="heavy-industrial">Heavy Industrial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="multi-family">Multi Family</SelectItem>
                          <SelectItem value="mixed-use">Mixed Use</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>}

                {propertyType === 'other' && !isLandAcquisition && (
                  <div className="space-y-2">
                    <Label htmlFor="otherPropertyType">Please specify property type</Label>
                    <Input id="otherPropertyType" value={otherPropertyType} onChange={e => setOtherPropertyType(e.target.value)} />
                  </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="loanAmount">{isMezzanine ? "Mezzanine Loan Amount Requested" : "Loan Amount Requested"}</Label>
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

                {isLandAcquisition ? (
                    <>
                         <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="entitlementStatus">Entitlement Status</Label>
                                <Input id="entitlementStatus" placeholder="e.g., Fully Entitled, In Progress" value={entitlementStatus} onChange={e => setEntitlementStatus(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="developmentCosts">Total Development Costs</Label>
                                <Input id="developmentCosts" type="number" placeholder="e.g., 500000" value={developmentCosts} onChange={e => setDevelopmentCosts(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="afterDevelopmentValue">After Development Value</Label>
                            <Input id="afterDevelopmentValue" type="number" placeholder="e.g., 1500000" value={afterDevelopmentValue} onChange={e => setAfterDevelopmentValue(e.target.value)} />
                        </div>
                        <DocumentUploadInput name="Feasibility Study" />
                        <DocumentUploadInput name="Zoning and Entitlement Documents" />
                        <DocumentUploadInput name="Environmental Report" />
                    </>
                ) : isMezzanine ? (
                    <>
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><Layers className="h-5 w-5" /> Mezzanine Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seniorLoanAmount">Senior Loan Amount</Label>
                                    <Input id="seniorLoanAmount" type="number" placeholder="e.g., 2000000" value={seniorLoanAmount} onChange={e => setSeniorLoanAmount(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="capitalStack">Capital Stack (Describe sources and amounts)</Label>
                                    <Textarea id="capitalStack" placeholder="e.g., Senior Debt: $2M, Mezzanine: $500k, Equity: $500k" value={capitalStack} onChange={e => setCapitalStack(e.target.value)} />
                                </div>
                                <DocumentUploadInput name="Senior Debt Term Sheet" />
                                <DocumentUploadInput name="Capital Stack overview" />
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
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
                    </>
                )}
                
                 <div className="grid md:grid-cols-2 gap-4">
                    {!isLandAcquisition && <div className="space-y-2">
                        <Label htmlFor="propertySqFt">Subject Property Square Footage</Label>
                        <Input id="propertySqFt" type="number" placeholder="e.g., 2000" value={propertySqFt} onChange={e => setPropertySqFt(e.target.value)} />
                    </div>}
                    <div className="space-y-2">
                        <Label htmlFor="lotSize">Lot Size (in sq. ft. or acres)</Label>
                        <Input id="lotSize" placeholder="e.g., 10,000 sq. ft. or 0.23 acres" value={lotSize} onChange={e => setLotSize(e.target.value)} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {!isLandAcquisition && <div className="space-y-2">
                        <Label htmlFor="constructionTime">Estimated Time to Construct (in months)</Label>
                        <Input id="constructionTime" type="number" placeholder="e.g., 6" value={constructionTime} onChange={e => setConstructionTime(e.target.value)} />
                    </div>}
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
                </>
                )}
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
