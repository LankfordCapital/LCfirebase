
'use client';

import { useState, useRef, useId, useEffect } from 'react';
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
import { useDocumentContext } from '@/contexts/document-context';
import { useAuth } from '@/contexts/auth-context';
import { updateProfile } from 'firebase/auth';

type Deal = {
  id: string;
  address: string;
  purchasePrice: string;
  rehabAmount: string;
  salePrice: string;
  daysOnMarket: string;
};

type Company = {
  id: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEin: string;
};

export default function ProfilePage() {
  const { addDocument, documents } = useDocumentContext();
  const { user } = useAuth();
  const { toast } = useToast();

  const dealId = useId();
  const companyId = useId();

  const [deals, setDeals] = useState<Deal[]>([
    { id: dealId, address: '', purchasePrice: '', rehabAmount: '', salePrice: '', daysOnMarket: '' },
  ]);

  const [companies, setCompanies] = useState<Company[]>([
    { id: companyId, companyName: '', companyAddress: '', companyPhone: '', companyEin: '' },
  ]);
  
  const [creditScores, setCreditScores] = useState<ScanCreditReportOutput | null>(null);
  const [isScanningCredit, setIsScanningCredit] = useState(false);

  const [personalAssetBalance, setPersonalAssetBalance] = useState<ScanAssetStatementOutput | null>(null);
  const [isScanningPersonalAsset, setIsScanningPersonalAsset] = useState(false);
  
  const [companyAssetBalance, setCompanyAssetBalance] = useState<ScanAssetStatementOutput | null>(null);
  const [isScanningCompanyAsset, setIsScanningCompanyAsset] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if(user?.displayName) {
        const nameParts = user.displayName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
    }
  }, [user]);

  const profileRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dealRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDocumentUpload = async (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        addDocument({
            name: docName,
            file,
            status: 'uploaded'
        });
    }
  };

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
      const newId = `deal-${deals.length}-${Date.now()}`;
      setDeals([...deals, { id: newId, address: '', purchasePrice: '', rehabAmount: '', salePrice: '', daysOnMarket: '' }]);
    }
  };

  const handleRemoveDeal = (id: string) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const handleDealChange = (id: string, field: keyof Omit<Deal, 'id'>, value: string) => {
    setDeals(deals.map(deal => (deal.id === id ? { ...deal, [field]: value } : deal)));
  };

  const handleAddCompany = () => {
    const newId = `company-${companies.length}-${Date.now()}`;
    setCompanies([...companies, { id: newId, companyName: '', companyAddress: '', companyPhone: '', companyEin: '' }]);
  };

  const handleRemoveCompany = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const handleCompanyChange = (id: string, field: keyof Omit<Company, 'id'>, value: string) => {
    setCompanies(companies.map(company => (company.id === id ? { ...company, [field]: value } : company)));
  };

  const handleScanCreditReport = async () => {
    const creditReport = documents['Credit Report'];
    if (!creditReport?.file) {
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
      const dataUri = creditReport.dataUri;
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
  
  const handleScanAssetStatement = async (type: 'personal' | 'company') => {
    const docName = type === 'personal' ? 'Personal Asset Statement' : 'Company Asset Statement';
    const assetStatement = documents[docName];

    if (!assetStatement?.file) {
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
        const dataUri = assetStatement.dataUri;
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
  
  const handleSaveChanges = async () => {
    if (user) {
        try {
            await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        }
    }
  }

  const UploadButton = ({ docName }: { docName: string }) => {
    const fileInputId = `upload-${docName.replace(/\s+/g, '-')}`;
    const doc = documents[docName];
    return (
        <div className="relative">
            <Button variant="outline" className="w-full justify-start" asChild>
                <Label htmlFor={fileInputId} className="cursor-pointer">
                    <Upload className="mr-2" /> 
                    {docName}
                    {doc && <span className="text-green-500 ml-2">(Uploaded)</span>}
                </Label>
            </Button>
            <Input 
                id={fileInputId} 
                type="file" 
                className="sr-only" 
                onChange={(e) => handleDocumentUpload(docName, e)} 
            />
        </div>
    );
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
                  <AvatarImage src={user?.photoURL || "https://placehold.co/80x80.png"} />
                  <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
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
                 <UploadButton docName="ID/Driver's License (Borrower)" />
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
                        <Input id="credit-report-upload" type="file" onChange={(e) => handleDocumentUpload('Credit Report (Borrower)', e)} />
                        <Button onClick={handleScanCreditReport} disabled={isScanningCredit || !documents['Credit Report (Borrower)']}>
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
                            <Input id="personal-asset-upload" type="file" onChange={(e) => handleDocumentUpload('Personal Asset Statement (Borrower)', e)} />
                            <Button onClick={() => handleScanAssetStatement('personal')} disabled={isScanningPersonalAsset || !documents['Personal Asset Statement (Borrower)']}>
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
                            <Input id="company-asset-upload" type="file" onChange={(e) => handleDocumentUpload('Company Asset Statement (Company)', e)} />
                            <Button onClick={() => handleScanAssetStatement('company')} disabled={isScanningCompanyAsset || !documents['Company Asset Statement (Company)']}>
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
                <Input id="email" type="email" value={user?.email || ''} readOnly />
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
                    <UploadButton docName="EIN Certificate (Company)" />
                    <UploadButton docName="Formation Documentation (Company)" />
                    <UploadButton docName="Operating Agreement/Bylaws (Company)" />
                    <UploadButton docName="Partnership/Officer List (Company)" />
                    <UploadButton docName="Business License (Company)" />
                    <UploadButton docName="Certificate of Good Standing (Company)" />
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
               <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`salePrice-${deal.id}`}>Sale Price</Label>
                  <Input id={`salePrice-${deal.id}`} type="number" placeholder="300000" value={deal.salePrice} onChange={e => handleDealChange(deal.id, 'salePrice', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`daysOnMarket-${deal.id}`}>Days on Market</Label>
                  <Input id={`daysOnMarket-${deal.id}`} type="number" placeholder="30" value={deal.daysOnMarket} onChange={e => handleDealChange(deal.id, 'daysOnMarket', e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <UploadButton docName={`Purchase HUD-1 (Deal #${index + 1})`} />
                  <UploadButton docName={`Disposition HUD-1 (Deal #${index + 1})`} />
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
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}

    