
'use client';

import { useState, useRef, useId, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, PlusCircle, Trash2, ScanLine, Landmark, FileText, Calendar as CalendarIcon, Download, Save, User, Building, CreditCard, Phone, Mail, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useDocumentContext } from '@/contexts/document-context';
import { useAuth } from '@/contexts/auth-context';
import { updateProfile } from 'firebase/auth';
import { DealHistory } from '@/components/deal-history';
import { CustomLoader } from './ui/custom-loader';
import { Separator } from '@/components/ui/separator';
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';
import { ProfileCompletionIndicator } from '@/components/profile-completion-indicator';

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
  
  // New backend integration
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    profileCompletion,
    updatePersonalInfo,
    updateContactInfo,
    updateCompanyInfo,
    removeCompany,
    updateCreditScores,
    updateAssetInfo,
    updateDocumentStatus,
    saveFinancialStatement,
    saveDebtSchedule
  } = useBorrowerProfile();

  const companyId = useId();

  // Local state for form inputs (will sync with backend data)
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
  const [phone, setPhone] = useState('');
  const [ssn, setSsn] = useState('');

  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Sync local state with backend data when profile loads
  useEffect(() => {
    if (profile) {
      // Sync personal info
      if (profile.personalInfo) {
        setFirstName(profile.personalInfo.firstName || '');
        setLastName(profile.personalInfo.lastName || '');
        setSsn(profile.personalInfo.ssn || '');
        if (profile.personalInfo.dateOfBirth) {
          setDateOfBirth(new Date(profile.personalInfo.dateOfBirth));
        }
      }

      // Sync contact info
      if (profile.contactInfo) {
        setPhone(profile.contactInfo.phone || '');
      }

      // Sync companies
      if (profile.companies && profile.companies.length > 0) {
        setCompanies(profile.companies.map(company => ({
          id: company.id,
          companyName: company.companyName,
          companyAddress: company.companyAddress,
          companyPhone: company.companyPhone,
          companyEin: company.companyEin
        })));
      } else {
        // Initialize with empty company if none exist
        setCompanies([{ id: companyId, companyName: '', companyAddress: '', companyPhone: '', companyEin: '' }]);
      }

      // Sync credit scores
      if (profile.financialInfo?.creditScores) {
        setCreditScores({
          equifaxScore: String(profile.financialInfo.creditScores.equifax || 0),
          experianScore: String(profile.financialInfo.creditScores.experian || 0),
          transunionScore: String(profile.financialInfo.creditScores.transunion || 0)
        });
      }

      // Sync asset balances
      if (profile.financialInfo?.personalAssets) {
        setPersonalAssetBalance({
          balance: String(profile.financialInfo.personalAssets.balance) || '$0'
        });
      }

      if (profile.financialInfo?.companyAssets) {
        // Use the first company's assets for now
        const firstCompanyId = Object.keys(profile.financialInfo.companyAssets)[0];
        if (firstCompanyId) {
          setCompanyAssetBalance({
            balance: String(profile.financialInfo.companyAssets[firstCompanyId].balance) || '$0'
          });
        }
      }
    }
  }, [profile, companyId]);

  // Fallback to user display name if no profile data
  useEffect(() => {
    if (!profile && user?.displayName) {
      const nameParts = user.displayName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
  }, [user, profile]);

  const profileRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDocumentUpload = async (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        addDocument({
            name: docName,
            file,
        });
        
        // Update document status in backend
        try {
          if (docName.includes('(Borrower)')) {
            // Personal document
            await updateDocumentStatus(docName.replace(' (Borrower)', '').toLowerCase().replace(/\s+/g, ''), true);
          } else if (docName.includes('(Company)')) {
            // Company document - update for first company for now
            const companyId = companies[0]?.id;
            if (companyId) {
              await updateDocumentStatus(docName.replace(' (Company)', '').toLowerCase().replace(/\s+/g, ''), true, companyId);
            }
          }
        } catch (error) {
          console.error('Failed to update document status:', error);
        }
        
        toast({
            title: 'Document Uploaded',
            description: `${docName} has been uploaded successfully.`,
        });
    }
  };

  const handleExportPdf = async (element: HTMLElement | null, fileName: string) => {
    if (!element) return;
    
    toast({
        title: 'PDF Export Disabled',
        description: 'PDF export functionality has been temporarily disabled.',
    });
  };

  const handleAddCompany = () => {
    const newId = `company-${companies.length}-${Date.now()}`;
    const newCompany = { 
      id: newId, 
      companyName: '', 
      companyAddress: '', 
      companyPhone: '', 
      companyEin: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    setCompanies([...companies, { id: newId, companyName: '', companyAddress: '', companyPhone: '', companyEin: '' }]);
    
    // Save to backend
    updateCompanyInfo(newCompany);
  };

  const handleRemoveCompany = async (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
    
    // Remove from backend
    try {
      await removeCompany(id);
    } catch (error) {
      console.error('Failed to remove company:', error);
    }
  };

  const handleCompanyChange = async (id: string, field: keyof Omit<Company, 'id'>, value: string) => {
    const updatedCompanies = companies.map(company => 
      company.id === id ? { ...company, [field]: value } : company
    );
    setCompanies(updatedCompanies);
    
    // Find the updated company and save to backend
    const updatedCompany = updatedCompanies.find(c => c.id === id);
    if (updatedCompany) {
      try {
        await updateCompanyInfo({
          ...updatedCompany,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        });
      } catch (error) {
        console.error('Failed to update company:', error);
      }
    }
  };

  const handleScanCreditReport = async () => {
    const creditReport = documents['Credit Report (Borrower)'];
    if (!creditReport?.dataUri) {
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
      if (!dataUri) {
        throw new Error('File data not available for scanning.');
      }
      const result = await scanCreditReport({ creditReportDataUri: dataUri });
      setCreditScores(result);
      
      // Save credit scores to backend
      await updateCreditScores({
        equifax: Number(result.equifaxScore),
        experian: Number(result.experianScore),
        transunion: Number(result.transunionScore),
        lastUpdated: new Date()
      });
      
      toast({
        title: 'Scan Complete',
        description: 'Credit scores have been extracted and saved successfully.',
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
    const docName = type === 'personal' ? 'Personal Asset Statement (Borrower)' : 'Company Asset Statement (Company)';
    const assetStatement = documents[docName];

    if (!assetStatement?.dataUri) {
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
        if (!dataUri) {
          throw new Error('File data not available for scanning.');
        }
        const result = await scanAssetStatement({ statementDataUri: dataUri });
        if(type === 'personal') {
            setPersonalAssetBalance(result);
            // Save personal assets to backend
            await updateAssetInfo('personal', {
              balance: result.balance,
              lastStatementDate: new Date().toISOString()
            });
        } else {
            setCompanyAssetBalance(result);
            // Save company assets to backend
            const companyId = companies[0]?.id;
            if (companyId) {
              await updateAssetInfo('company', {
                balance: result.balance,
                lastStatementDate: new Date().toISOString()
              }, companyId);
            }
        }
        toast({
            title: 'Scan Complete',
            description: `The account balance has been extracted and saved successfully.`,
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
  
  const handleSavePersonalInfo = async () => {
    if (user) {
        setIsSavingPersonal(true);
        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
            
            // Save to backend database
            await updatePersonalInfo({
              firstName,
              lastName,
              ssn,
              dateOfBirth: dateOfBirth?.toISOString() || ''
            });
            
            toast({
                title: 'Profile Updated',
                description: 'Your personal information has been saved successfully.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsSavingPersonal(false);
        }
    }
  };

  const handleSaveContactInfo = async () => {
    setIsSavingContact(true);
    try {
      // Save contact info to backend
      await updateContactInfo({
        phone,
        address: profile?.contactInfo?.address // Preserve existing address if any
      });
      
      toast({
          title: 'Contact Information Saved',
          description: 'Your contact information has been updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save contact information. Please try again.',
      });
    } finally {
      setIsSavingContact(false);
    }
  };

  const UploadButton = ({ docName }: { docName: string }) => {
    const fileInputId = `upload-${docName.replace(/\s+/g, '-')}`;
    const doc = documents[docName];
    
    // Check if document is marked as uploaded in backend
    const isUploaded = doc || (profile?.requiredDocuments?.personal && 
      (profile.requiredDocuments.personal as any)[docName.replace(' (Borrower)', '').toLowerCase().replace(/\s+/g, '')]);
    
    return (
        <div className="relative">
            <Button variant="outline" className="w-full justify-start" asChild>
                <Label htmlFor={fileInputId} className="cursor-pointer flex items-center">
                    <Upload className="mr-2 h-4 w-4" /> 
                    <span className="truncate">{docName}</span>
                    {isUploaded && <span className="text-green-500 ml-2 whitespace-nowrap">✓</span>}
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <CustomLoader className="h-8 w-8 mx-auto" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">Error loading profile: {profileError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 text-lg">Manage your personal information, documents, and business details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion Indicator */}
            <ProfileCompletionIndicator completion={profileCompletion || null} />
            
            {/* Personal Information */}
            <Card ref={profileRef} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                      <CardDescription>Your basic personal details and identification</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleExportPdf(profileRef.current, 'personal-information')}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.photoURL || "https://placehold.co/96x96.png"} />
                    <AvatarFallback className="text-lg font-semibold">{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500">Upload a professional headshot</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="h-11" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ssn" className="text-sm font-medium">Social Security Number</Label>
                    <Input id="ssn" placeholder="***-**-****" value={ssn} onChange={e => setSsn(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal",
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
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Required Documents</Label>
                  <UploadButton docName="ID/Driver's License (Borrower)" />
                </div>
                
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-11">
                      <FileText className="mr-2 h-4 w-4" />
                      Complete Personal Financial Statement
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="py-4">
                      <PersonalFinancialStatement />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSavePersonalInfo} disabled={isSavingPersonal} className="gap-2">
                    {isSavingPersonal ? <CustomLoader className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Save Personal Information
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Credit Score Analysis */}
            <Card ref={creditRef} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Credit Score Analysis</CardTitle>
                      <CardDescription>Upload your tri-merged credit report for AI-powered score extraction</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleExportPdf(creditRef.current, 'credit-score-analysis')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="credit-report-upload" className="text-sm font-medium">Upload Tri-Merged Credit Report</Label>
                  <div className="flex gap-3">
                    <Input id="credit-report-upload" type="file" onChange={(e) => handleDocumentUpload('Credit Report (Borrower)', e)} className="flex-1" />
                    <Button onClick={handleScanCreditReport} disabled={isScanningCredit || !documents['Credit Report (Borrower)']} className="gap-2">
                      {isScanningCredit ? <CustomLoader className="h-4 w-4" /> : <ScanLine className="h-4 w-4" />}
                      <span className="hidden sm:inline">Scan Report</span>
                    </Button>
                  </div>
                </div>

                {creditScores && (
                  <div className="grid grid-cols-3 gap-4 rounded-lg border bg-gradient-to-r from-blue-50 to-green-50 p-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-600">Equifax</p>
                      <p className="text-3xl font-bold text-blue-600">{creditScores.equifaxScore}</p>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-600">Experian</p>
                      <p className="text-3xl font-bold text-green-600">{creditScores.experianScore}</p>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-600">TransUnion</p>
                      <p className="text-3xl font-bold text-purple-600">{creditScores.transunionScore}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Asset Verification */}
            <Card ref={assetRef} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Landmark className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Asset Verification</CardTitle>
                      <CardDescription>Upload asset statements for automated balance extraction</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleExportPdf(assetRef.current, 'asset-verification')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Assets
                  </h4>
                  <div className="space-y-3">
                    <Label htmlFor="personal-asset-upload" className="text-sm font-medium">Upload Latest Personal Asset Statement</Label>
                    <div className="flex gap-3">
                      <Input id="personal-asset-upload" type="file" onChange={(e) => handleDocumentUpload('Personal Asset Statement (Borrower)', e)} className="flex-1" />
                      <Button onClick={() => handleScanAssetStatement('personal')} disabled={isScanningPersonalAsset || !documents['Personal Asset Statement (Borrower)']} className="gap-2">
                        {isScanningPersonalAsset ? <CustomLoader className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                        <span className="hidden sm:inline">Scan</span>
                      </Button>
                    </div>
                  </div>
                  {personalAssetBalance && (
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="text-sm font-medium text-gray-600">Most Recent Balance</p>
                      <p className="text-2xl font-bold text-green-600">{personalAssetBalance.balance}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Assets
                  </h4>
                  <div className="space-y-3">
                    <Label htmlFor="company-asset-upload" className="text-sm font-medium">Upload Latest Company Asset Statement</Label>
                    <div className="flex gap-3">
                      <Input id="company-asset-upload" type="file" onChange={(e) => handleDocumentUpload('Company Asset Statement (Company)', e)} className="flex-1" />
                      <Button onClick={() => handleScanAssetStatement('company')} disabled={isScanningCompanyAsset || !documents['Company Asset Statement (Company)']} className="gap-2">
                        {isScanningCompanyAsset ? <CustomLoader className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                        <span className="hidden sm:inline">Scan</span>
                      </Button>
                    </div>
                  </div>
                  {companyAssetBalance && (
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="text-sm font-medium text-gray-600">Most Recent Balance</p>
                      <p className="text-2xl font-bold text-green-600">{companyAssetBalance.balance}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <DealHistory />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card ref={contactRef} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-200">
                    <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                        <Phone className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                        <CardTitle className="text-xl">Contact Information</CardTitle>
                        <CardDescription>Your primary contact details</CardDescription>
                        </div>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                    </Label>
                    <Input id="email" type="email" value={user?.email || ''} readOnly className="h-11 bg-gray-50" />
                    </div>
                    <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                    </Label>
                    <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={e => setPhone(e.target.value)} className="h-11" />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveContactInfo} disabled={isSavingContact} className="gap-2">
                        {isSavingContact ? <CustomLoader className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Contact Information
                    </Button>
                    </div>
                </CardContent>
            </Card>

            {companies.map((company, index) => (
              <Card key={company.id} ref={el => { if (el) companyRefs.current[index] = el; }} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                        <CardDescription>Business details and documents</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleExportPdf(companyRefs.current[index], `company-information-${company.companyName || index + 1}`)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {companies.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveCompany(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Company</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`companyName-${company.id}`} className="text-sm font-medium">Company Name</Label>
                    <Input id={`companyName-${company.id}`} placeholder="Acme Inc." value={company.companyName} onChange={e => handleCompanyChange(company.id, 'companyName', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyAddress-${company.id}`} className="text-sm font-medium">Address</Label>
                    <Input id={`companyAddress-${company.id}`} placeholder="123 Business Rd." value={company.companyAddress} onChange={e => handleCompanyChange(company.id, 'companyAddress', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyPhone-${company.id}`} className="text-sm font-medium">Phone Number</Label>
                    <Input id={`companyPhone-${company.id}`} placeholder="(555) 123-4567" value={company.companyPhone} onChange={e => handleCompanyChange(company.id, 'companyPhone', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`companyEin-${company.id}`} className="text-sm font-medium">EIN #</Label>
                    <Input id={`companyEin-${company.id}`} placeholder="12-3456789" value={company.companyEin} onChange={e => handleCompanyChange(company.id, 'companyEin', e.target.value)} className="h-11" />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Required Documents</Label>
                    <UploadButton docName="EIN Certificate (Company)" />
                    <UploadButton docName="Formation Documentation (Company)" />
                    <UploadButton docName="Operating Agreement/Bylaws (Company)" />
                    <UploadButton docName="Partnership/Officer List (Company)" />
                    <UploadButton docName="Business License (Company)" />
                    <UploadButton docName="Certificate of Good Standing (Company)" />
                  </div>
                  
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-start h-11">
                        <FileText className="mr-2 h-4 w-4" />
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
            
            <Button variant="outline" onClick={handleAddCompany} className="w-full gap-2 h-11">
              <PlusCircle className="h-4 w-4" />
              Add Another Company
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
