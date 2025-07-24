'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, PlusCircle, Trash2, ScanLine, Loader2, Landmark, FileText, Calendar as CalendarIcon, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { scanCreditReport, type ScanCreditReportOutput } from '@/ai/flows/credit-score-scanner';
import { scanAssetStatement, type ScanAssetStatementOutput } from '@/ai/flows/asset-statement-scanner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PersonalFinancialStatement } from '@/components/personal-financial-statement';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BusinessDebtSchedule } from '@/components/business-debt-schedule';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Deal = {
  id: number;
  address: string;
  purchasePrice: string;
  rehabAmount: string;
  disposition: string;
};

type Company = {
  id: number;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEin: string;
};

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export default function ProfilePage() {
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, address: '', purchasePrice: '', rehabAmount: '', disposition: '' },
  ]);

  const [companies, setCompanies] = useState<Company[]>([
    { id: Date.now(), companyName: '', companyAddress: '', companyPhone: '', companyEin: '' },
  ]);

  const [creditReportFile, setCreditReportFile] = useState<File | null>(null);
  const [creditScores, setCreditScores] = useState<ScanCreditReportOutput | null>(null);
  const [isScanningCredit, setIsScanningCredit] = useState(false);

  const [personalAssetFile, setPersonalAssetFile] = useState<File | null>(null);
  const [personalAssetBalance, setPersonalAssetBalance] = useState<ScanAssetStatementOutput | null>(null);
  const [isScanningPersonalAsset, setIsScanningPersonalAsset] = useState(false);
  
  const [companyAssetFile, setCompanyAssetFile] = useState<File | null>(null);
  const [companyAssetBalance, setCompanyAssetBalance] = useState<ScanAssetStatementOutput | null>(null);
  const [isScanningCompanyAsset, setIsScanningCompanyAsset] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  
  const profileRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dealRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { toast } = useToast();
  
  const handleExportPdf = async (element: HTMLElement | null, fileName: string) => {
    if (!element) return;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  };

  const handleAddDeal = () => {
    if (deals.length < 10) {
      setDeals([...deals, { id: Date.now(), address: '', purchasePrice: '', rehabAmount: '', disposition: '' }]);
    }
  };

  const handleRemoveDeal = (id: number) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const handleDealChange = (id: number, field: keyof Omit<Deal, 'id'>, value: string) => {
    setDeals(deals.map(deal => (deal.id === id ? { ...deal, [field]: value } : deal)));
  };

  const handleAddCompany = () => {
    setCompanies([...companies, { id: Date.now(), companyName: '', companyAddress: '', companyPhone: '', companyEin: '' }]);
  };

  const handleRemoveCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const handleCompanyChange = (id: number, field: keyof Omit<Company, 'id'>, value: string) => {
    setCompanies(companies.map(company => (company.id === id ? { ...company, [field]: value } : company)));
  };

  const handleCreditReportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCreditReportFile(event.target.files[0]);
    }
  };

  const handleScanCreditReport = async () => {
    if (!creditReportFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a credit report to scan.',
      });
      return;
    }

    setIsScanningCredit(true);
    setCreditScores(null);

    try {
      const dataUri = await fileToDataUri(creditReportFile);
      const result = await scanCreditReport({ creditReportDataUri: dataUri });
      setCreditScores(result);
      toast({
        title: 'Scan Complete',
        description: 'Credit scores have been extracted.',
      });
    } catch (error) {
      console.error('Credit Score Scan Error:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Could not extract credit scores from the document. Please try again.',
      });
    } finally {
      setIsScanningCredit(false);
    }
  };
  
  const handleAssetStatementUpload = (type: 'personal' | 'company', event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        if(type === 'personal') {
            setPersonalAssetFile(event.target.files[0]);
        } else {
            setCompanyAssetFile(event.target.files[0]);
        }
    }
  }

  const handleScanAssetStatement = async (type: 'personal' | 'company') => {
    const file = type === 'personal' ? personalAssetFile : companyAssetFile;
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: `Please upload a ${type} asset statement to scan.`,
      });
      return;
    }

    if(type === 'personal') {
        setIsScanningPersonalAsset(true);
        setPersonalAssetBalance(null);
    } else {
        setIsScanningCompanyAsset(true);
        setCompanyAssetBalance(null);
    }
    
    try {
        const dataUri = await fileToDataUri(file);
        const result = await scanAssetStatement({ statementDataUri: dataUri });
        if(type === 'personal') {
            setPersonalAssetBalance(result);
        } else {
            setCompanyAssetBalance(result);
        }
        toast({
            title: 'Scan Complete',
            description: `The account balance has been extracted.`,
        });
    } catch (error) {
      console.error('Asset Scan Error:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Could not extract the balance from the document. Please try again.',
      });
    } finally {
        if(type === 'personal') {
            setIsScanningPersonalAsset(false);
        } else {
            setIsScanningCompanyAsset(false);
        }
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal and contact information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card ref={profileRef}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <Button variant="outline" size="icon" onClick={() => handleExportPdf(profileRef.current, 'personal-information')}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>This information will be used for your loan applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/80x80.png" />
                  <AvatarFallback>BD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Borrower" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="ssn">Social Security Number</Label>
                   <Input id="ssn" placeholder="***-**-****" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="dob">Date of Birth</Label>
                   <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                 </div>
               </div>
               <div className="space-y-3 pt-2">
                 <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Upload ID/Driver's License</Button>
               </div>
               <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" />
                    Complete Personal Financial Statement
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="py-4">
                      <PersonalFinancialStatement />
                    </div>
                </CollapsibleContent>
               </Collapsible>
            </CardContent>
          </Card>
          
          <Card ref={creditRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>AI Credit Score Analysis</CardTitle>
                  <Button variant="outline" size="icon" onClick={() => handleExportPdf(creditRef.current, 'credit-score-analysis')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Upload your tri-merged credit report to have our AI extract your scores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="credit-report-upload">Upload Tri-Merged Credit Report</Label>
                    <div className="flex gap-2">
                        <Input id="credit-report-upload" type="file" onChange={handleCreditReportUpload} />
                        <Button onClick={handleScanCreditReport} disabled={isScanningCredit || !creditReportFile}>
                            {isScanningCredit ? <Loader2 className="animate-spin" /> : <ScanLine />}
                            <span className="ml-2 hidden sm:inline">Scan Report</span>
                        </Button>
                    </div>
                </div>

                {creditScores && (
                    <div className="grid grid-cols-3 gap-4 rounded-md border p-4">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">Equifax</p>
                            <p className="text-2xl font-bold">{creditScores.equifaxScore}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">Experian</p>
                            <p className="text-2xl font-bold">{creditScores.experianScore}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">TransUnion</p>
                            <p className="text-2xl font-bold">{creditScores.transunionScore}</p>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
          
          <Card ref={assetRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>AI Asset Verification</CardTitle>
                  <Button variant="outline" size="icon" onClick={() => handleExportPdf(assetRef.current, 'asset-verification')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Upload asset statements to have our AI extract the most recent balances.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-md border p-4">
                     <h4 className="font-semibold">Personal Assets</h4>
                     <div className="space-y-2">
                        <Label htmlFor="personal-asset-upload">Upload Latest Personal Asset Statement</Label>
                        <div className="flex gap-2">
                            <Input id="personal-asset-upload" type="file" onChange={(e) => handleAssetStatementUpload('personal', e)} />
                            <Button onClick={() => handleScanAssetStatement('personal')} disabled={isScanningPersonalAsset || !personalAssetFile}>
                                {isScanningPersonalAsset ? <Loader2 className="animate-spin" /> : <Landmark />}
                                <span className="ml-2 hidden sm:inline">Scan</span>
                            </Button>
                        </div>
                    </div>
                    {personalAssetBalance && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Most Recent Balance</p>
                            <p className="text-2xl font-bold">{personalAssetBalance.balance}</p>
                        </div>
                    )}
                </div>

                 <div className="space-y-4 rounded-md border p-4">
                     <h4 className="font-semibold">Company Assets</h4>
                     <div className="space-y-2">
                        <Label htmlFor="company-asset-upload">Upload Latest Company Asset Statement</Label>
                        <div className="flex gap-2">
                            <Input id="company-asset-upload" type="file" onChange={(e) => handleAssetStatementUpload('company', e)} />
                            <Button onClick={() => handleScanAssetStatement('company')} disabled={isScanningCompanyAsset || !companyAssetFile}>
                                {isScanningCompanyAsset ? <Loader2 className="animate-spin" /> : <Landmark />}
                                <span className="ml-2 hidden sm:inline">Scan</span>
                            </Button>
                        </div>
                    </div>
                    {companyAssetBalance && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Most Recent Balance</p>
                            <p className="text-2xl font-bold">{companyAssetBalance.balance}</p>
                        </div>
                    )}
                </div>
            </CardContent>
          </Card>

          <Card ref={contactRef}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contact Information</CardTitle>
                <Button variant="outline" size="icon" onClick={() => handleExportPdf(contactRef.current, 'contact-information')}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="borrower@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(123) 456-7890" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {companies.map((company, index) => (
             <Card key={company.id} ref={el => companyRefs.current[index] = el}>
                <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Company Information</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleExportPdf(companyRefs.current[index], `company-information-${company.companyName || index + 1}`)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {companies.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveCompany(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Company</span>
                      </Button>
                    )}
                  </div>
                  </div>
                  <CardDescription>Manage your business details and documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`companyName-${company.id}`}>Company Name</Label>
                    <Input id={`companyName-${company.id}`} placeholder="Acme Inc." value={company.companyName} onChange={e => handleCompanyChange(company.id, 'companyName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyAddress-${company.id}`}>Address</Label>
                    <Input id={`companyAddress-${company.id}`} placeholder="123 Business Rd." value={company.companyAddress} onChange={e => handleCompanyChange(company.id, 'companyAddress', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyPhone-${company.id}`}>Phone Number</Label>
                    <Input id={`companyPhone-${company.id}`} placeholder="(555) 123-4567" value={company.companyPhone} onChange={e => handleCompanyChange(company.id, 'companyPhone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyEin-${company.id}`}>EIN #</Label>
                    <Input id={`companyEin-${company.id}`} placeholder="12-3456789" value={company.companyEin} onChange={e => handleCompanyChange(company.id, 'companyEin', e.target.value)} />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> EIN Certificate</Button>
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Formation Documentation</Button>
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Operating Agreement/Bylaws</Button>
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Partnership/Officer List</Button>
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Business License</Button>
                    <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Certificate of Good Standing</Button>
                  </div>
                   <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2" />
                        Business Debt Schedule
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="py-4">
                          <BusinessDebtSchedule />
                        </div>
                    </CollapsibleContent>
                   </Collapsible>
                </CardContent>
              </Card>
          ))}
          <Button variant="outline" onClick={handleAddCompany}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Company
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Deal History</CardTitle>
             <Button variant="outline" size="icon" onClick={() => handleExportPdf(document.getElementById('deal-history-card'), 'deal-history')}>
                <Download className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Please provide details on your past real estate deals (up to 10).</CardDescription>
        </CardHeader>
        <CardContent id="deal-history-card" className="space-y-6">
          {deals.map((deal, index) => (
            <div key={deal.id} ref={el => dealRefs.current[index] = el} className="space-y-4 rounded-md border p-4 relative">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Deal #{index + 1}</h4>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleExportPdf(dealRefs.current[index], `deal-${index + 1}`)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {deals.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveDeal(deal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Deal</span>
                      </Button>
                    )}
                 </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`address-${deal.id}`}>Property Address</Label>
                <Input id={`address-${deal.id}`} placeholder="123 Main St, Anytown, USA" value={deal.address} onChange={e => handleDealChange(deal.id, 'address', e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`purchasePrice-${deal.id}`}>Purchase Price</Label>
                  <Input id={`purchasePrice-${deal.id}`} type="number" placeholder="200000" value={deal.purchasePrice} onChange={e => handleDealChange(deal.id, 'purchasePrice', e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`rehabAmount-${deal.id}`}>Rehab Amount</Label>
                  <Input id={`rehabAmount-${deal.id}`} type="number" placeholder="50000" value={deal.rehabAmount} onChange={e => handleDealChange(deal.id, 'rehabAmount', e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor={`disposition-${deal.id}`}>Disposition</Label>
                <Select value={deal.disposition} onValueChange={value => handleDealChange(deal.id, 'disposition', value)}>
                  <SelectTrigger id={`disposition-${deal.id}`}>
                    <SelectValue placeholder="Select disposition..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Purchase HUD-1</Button>
                  <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Disposition HUD-1</Button>
              </div>
              {index < deals.length - 1 && <Separator />}
            </div>
          ))}

          {deals.length < 10 && (
            <Button variant="outline" onClick={handleAddDeal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Deal
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
