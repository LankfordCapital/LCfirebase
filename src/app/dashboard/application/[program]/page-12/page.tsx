'use client';

import { useState, useCallback, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { ArrowLeft, Check, FileText, FileUp, Wallet, DollarSign, ScanLine, PlusCircle, Trash2, Calculator, Info, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/ui/custom-loader';
import { scanWorkSunkReport, type ScanWorkSunkReportOutput } from '@/ai/flows/work-sunk-scanner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type WorkSunkItem = {
  id: string;
  description: string;
  cost: string;
  dateCompleted: string;
};

const ESignatureSection = ({ sponsorIndex }: { sponsorIndex: number }) => {
    const [signature, setSignature] = useState('');
    const [agreed, setAgreed] = useState(false);
  
    return (
      <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold text-lg">Sponsor #{sponsorIndex + 1} Signature</h4>
          <div className="space-y-2">
              <Label htmlFor={`signature-${sponsorIndex}`}>E-Signature</Label>
              <p className="text-sm text-muted-foreground">Please type your full legal name below. This will serve as your electronic signature.</p>
              <Input 
                  id={`signature-${sponsorIndex}`} 
                  placeholder="Type your full name" 
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
              />
          </div>
          <div className="flex items-start space-x-2">
              <Checkbox 
                  id={`terms-${sponsorIndex}`} 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                  <label
                  htmlFor={`terms-${sponsorIndex}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                  I have read and agree to the terms and disclosures.
                  </label>
              </div>
          </div>
      </div>
    )
  }

function LoanApplicationClientPage8({ loanProgram }: { loanProgram: string}) {
  const { documents, addDocument } = useDocumentContext();
  const router = useRouter();
  const { toast } = useToast();
  const initialId = useId();

  // State from original page 8
  
  // State from page 9
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanWorkSunkReportOutput | null>(null);
  const [workSunkItems, setWorkSunkItems] = useState<WorkSunkItem[]>([
    { id: initialId, description: '', cost: '', dateCompleted: '' },
  ]);
  const [totalManualCost, setTotalManualCost] = useState(0);

  // State from page 10/11
  const [otherDetails, setOtherDetails] = useState('');

  // State from page 12
  const [numberOfSponsors, setNumberOfSponsors] = useState(1);
  
  const docName = "Work Sunk Report";
  const doc = documents[docName];

  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setScanResult(null); 
        await addDocument({
            name: itemName,
            file,
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
  
  const handleScanReport = async () => {
    if (!doc?.dataUri) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a work sunk report to scan.',
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanWorkSunkReport({ reportDataUri: doc.dataUri });
      setScanResult(result);
      toast({
        title: 'Scan Complete',
        description: 'Work Sunk Report has been analyzed.',
      });
    } catch (error) {
      console.error('Work Sunk Scan Error:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Could not extract data from the document. Please try again.',
      });
    } finally {
      setIsScanning(false);
    }
  };
  
    const handleItemChange = (id: string, field: keyof Omit<WorkSunkItem, 'id'>, value: string) => {
        setWorkSunkItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleAddItem = () => {
        setWorkSunkItems(items => [...items, { id: `item-${Date.now()}`, description: '', cost: '', dateCompleted: '' }]);
    };

    const handleRemoveItem = (id: string) => {
        setWorkSunkItems(items => items.filter(item => item.id !== id));
    };

    const handleCalculateTotals = () => {
        const total = workSunkItems.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
        setTotalManualCost(total);
    };

    const handleSubmitApplication = () => {
        toast({
            title: "Application Submitted!",
            description: "Thank you. Your loan application has been received.",
        });
        router.push('/dashboard');
    };

  const handleGoBack = () => {
    // For non-construction, page 5 links here, so we go back to 5.
    // For construction, page 7 links here, so we go back to 7.
    const isConstructionOrRehab = loanProgram.toLowerCase().includes('construction') || loanProgram.toLowerCase().includes('rehab');
     if (isConstructionOrRehab) {
        router.push(`/dashboard/application/${loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and')}/page-7`);
     } else {
        router.push(`/dashboard/application/${loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and')}/page-5`);
     }
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Final Steps</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /> Property Financials & Tax Returns</CardTitle>
                <CardDescription>Upload the property's financial statements and the required tax returns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Property Financials</h3>
                    <div className="space-y-3">
                        <DocumentUploadInput name="Trailing 12-Month Profit & Loss Statement" />
                        <DocumentUploadInput name="Previous Year 1 Profit & Loss Statement" />
                        <DocumentUploadInput name="Previous Year 2 Profit & Loss Statement" />
                    </div>
                </div>
                
                <Separator />
                
                <div>
                     <h3 className="text-lg font-semibold mb-2">Tax Returns</h3>
                    <div className="space-y-3">
                        <DocumentUploadInput name="Sponsor Personal Tax Returns (Last 2 Years)" />
                        <DocumentUploadInput name="Business Entity Tax Returns (Last 2 Years)" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Work Sunk Report</CardTitle>
                <CardDescription>If any work has already been completed and paid for, you can upload your report for AI scanning OR enter the details manually below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    {doc ? (
                        <div className="flex flex-col items-center gap-2 text-green-600">
                           <FileText className="h-12 w-12" />
                           <p className="font-semibold">File Uploaded:</p>
                           <p className="text-sm text-muted-foreground">{doc.file?.name}</p>
                           <Button variant="outline" size="sm" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Change File
                                </Label>
                           </Button>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center gap-2">
                            <FileUp className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Drag and drop your file here, or click to upload.</p>
                             <Button variant="outline" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Select File
                                </Label>
                           </Button>
                        </div>
                    )}
                     <Input id="work-sunk-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.doc,.docx,.csv" />
                </div>
                
                <div className="flex justify-center">
                    <Button onClick={handleScanReport} disabled={isScanning || !doc}>
                        {isScanning ? <CustomLoader className="mr-2" /> : <ScanLine className="mr-2" />}
                        Scan Uploaded Report
                    </Button>
                </div>

                {scanResult && (
                    <div className="pt-4 border-t text-center">
                        <h3 className="text-lg font-semibold">Scanned Total Work Sunk</h3>
                        <p className="text-3xl font-bold text-primary mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(scanResult.totalSunkCost)}
                        </p>
                    </div>
                )}

                 <div className="mt-6 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-center">Or, Enter Details Manually</h3>
                    <div className="space-y-4">
                        {workSunkItems.map((item, index) => (
                             <div key={item.id} className="grid md:grid-cols-3 gap-4 items-start p-4 border rounded-md relative">
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor={`item-desc-${item.id}`}>Description</Label>
                                    <Textarea id={`item-desc-${item.id}`} value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="e.g., Foundation Pour"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`item-date-${item.id}`}>Date Completed</Label>
                                    <Input id={`item-date-${item.id}`} type="date" value={item.dateCompleted} onChange={(e) => handleItemChange(item.id, 'dateCompleted', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`item-cost-${item.id}`}>Cost</Label>
                                    <Input id={`item-cost-${item.id}`} type="text" value={item.cost} onChange={(e) => handleItemChange(item.id, 'cost', e.target.value)} placeholder="0.00"/>
                                </div>

                                {workSunkItems.length > 1 && (
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <Button variant="outline" onClick={handleAddItem}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>

                    <div className="mt-6 pt-4 border-t space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Manual Total Work Sunk</h3>
                                <Button onClick={handleCalculateTotals}>
                                    <Calculator className="mr-2 h-4 w-4"/>
                                    Calculate Total
                                </Button>
                            </div>
                            <p className="text-2xl font-bold text-green-600 font-mono">
                                {totalManualCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Other Important Details</CardTitle>
                <CardDescription>Use this space to provide any other important details about the subject property or the deal that we should know.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="otherDetails">Narrative</Label>
                    <Textarea
                        id="otherDetails"
                        placeholder="Provide any additional information here..."
                        value={otherDetails}
                        onChange={(e) => setOtherDetails(e.target.value)}
                        className="h-48 resize-none"
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Disclosures & Authorization</CardTitle>
                <CardDescription>Please review the following disclosures carefully before submitting your application.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
                <p>By signing below, you certify that all information provided in this application is true and correct. You authorize Lankford Capital to verify all information provided and to obtain credit reports. You understand that making false statements can result in denial of your application and may be punishable by law.</p>
                <h5 className="font-semibold">Data Room and Third-Party Reports</h5>
                <p>You acknowledge and agree that Lankford Capital will create a data room for this transaction and that the sponsorship (all sponsors collectively) is responsible for the associated costs. Furthermore, you authorize Lankford Capital to order any necessary third-party reports (such as appraisals, environmental reports, etc.) required for the specific deal type. The sponsorship assumes full financial responsibility for the costs of these reports, regardless of whether the loan closes.</p>
                <h5 className="font-semibold">Fair Credit Reporting Act (FCRA) Disclosure</h5>
                <p>You have the right to know what is in your credit file. You may request and obtain all the information about you in the files of a consumer reporting agency (your "file disclosure").</p>
                <h5 className="font-semibold">Equal Credit Opportunity Act (ECOA) Notice</h5>
                <p>The Federal Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age (provided the applicant has the capacity to enter into a binding contract); because all or part of the applicant's income derives from any public assistance program; or because the applicant has in good faith exercised any right under the Consumer Credit Protection Act.</p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Sponsor E-Signatures</CardTitle>
                <CardDescription>Each sponsor must provide their electronic signature below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="w-full sm:w-1/2 md:w-1/3">
                    <Label htmlFor="num-sponsors">Number of Sponsors</Label>
                    <Select value={String(numberOfSponsors)} onValueChange={(value) => setNumberOfSponsors(Number(value))}>
                        <SelectTrigger id="num-sponsors">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Separator />

                {Array.from({ length: numberOfSponsors }).map((_, index) => (
                    <ESignatureSection key={index} sponsorIndex={index} />
                ))}

            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={handleSubmitApplication}>
                <Check className="mr-2 h-4 w-4" />
                Submit Final Application
            </Button>
        </div>
    </div>
  );
}


export default function LoanApplicationPage8({ params }: { params: { program: string } }) {
    const loanProgram = decodeURIComponent(params.program.replace(/-/g, ' ').replace(/\band\b/g, '&')).replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    return <LoanApplicationClientPage8 loanProgram={loanProgram} />;
}