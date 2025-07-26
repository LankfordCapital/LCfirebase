

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { CheckCircle, ArrowLeft, ArrowRight, User, Briefcase, FileText, FileUp, Check, AlertTriangle, Loader2, Landmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDocumentChecklist } from '@/ai/flows/document-checklist-flow';
import { useAuth } from '@/contexts/auth-context';
import { DealHistory } from '@/components/deal-history';
import { scanAssetStatement, type ScanAssetStatementOutput } from '@/ai/flows/asset-statement-scanner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UploadStatus = 'pending' | 'uploaded' | 'verified' | 'missing';

type DocumentItem = {
    name: string;
    status: UploadStatus;
    file?: File;
    dataUri?: string;
};

type CategorizedDocuments = {
    borrower: DocumentItem[];
    company: DocumentItem[];
    subjectProperty: DocumentItem[];
};

type AssetScanState = {
    balance: ScanAssetStatementOutput | null;
    isScanning: boolean;
};

export function LoanApplicationClientPage3({ loanProgram }: { loanProgram: string}) {
  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);
  const [numberOfSponsors, setNumberOfSponsors] = useState(1);
  
  const [assetScanStates, setAssetScanStates] = useState<Record<string, Record<string, AssetScanState>>>({});


  const { documents, addDocument, getDocument } = useDocumentContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isWorkforce = user?.email?.endsWith('@lankfordcapital.com') && user?.email !== 'admin@lankfordcapital.com';

  const syncChecklistWithContext = useCallback((checklistData: CategorizedDocuments) => {
    const newChecklist = { ...checklistData };
    (Object.keys(newChecklist) as Array<keyof CategorizedDocuments>).forEach(category => {
        newChecklist[category] = newChecklist[category].map(item => {
            const docFromContext = getDocument(item.name);
            if (docFromContext) {
                return {
                    ...item,
                    status: 'uploaded',
                    file: docFromContext.file,
                    dataUri: docFromContext.dataUri,
                };
            }
            return item;
        });
    });
    return newChecklist;
  }, [getDocument]);
  
  useEffect(() => {
    const initialStates: Record<string, Record<string, AssetScanState>> = {};
    for (let i = 0; i < numberOfSponsors; i++) {
        initialStates[i] = {
            month1: { balance: null, isScanning: false },
            month2: { balance: null, isScanning: false },
            month3: { balance: null, isScanning: false },
        };
    }
    setAssetScanStates(initialStates);
  }, [numberOfSponsors]);

  useEffect(() => {
    if (loanProgram) {
      const fetchChecklist = async () => {
        setIsLoadingChecklist(true);
        try {
          const { documentRequestList } = await getDocumentChecklist({ loanProgram });
          let initialChecklist: CategorizedDocuments = {
            borrower: documentRequestList.borrower.map(name => ({ name, status: 'missing' })),
            company: documentRequestList.company.map(name => ({ name, status: 'missing' })),
            subjectProperty: documentRequestList.subjectProperty.map(name => ({ name, status: 'missing' })),
          };
          
          initialChecklist = syncChecklistWithContext(initialChecklist);
          setChecklist(initialChecklist);

        } catch (error) {
          console.error("Failed to fetch document checklist", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load the document checklist for the selected program."
          });
        } finally {
          setIsLoadingChecklist(false);
        }
      };
      fetchChecklist();
    }
  }, [loanProgram, toast, syncChecklistWithContext]);

  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        const success = await addDocument({
            name: itemName,
            file,
            status: 'uploaded',
        });

        if (success && checklist) {
            setChecklist(syncChecklistWithContext(checklist));
        }
    }
  }, [addDocument, checklist, syncChecklistWithContext]);

   const handleScanAssetStatement = async (monthKey: 'month1' | 'month2' | 'month3', sponsorIndex: number) => {
    const docName = `Personal Asset Statement (Month ${monthKey === 'month1' ? 1 : monthKey === 'month2' ? 2 : 3}) (Sponsor ${sponsorIndex + 1})`;
    const assetStatement = documents[docName];

    if (!assetStatement?.file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: `Please upload the asset statement for Month ${monthKey === 'month1' ? 1 : monthKey === 'month2' ? 2 : 3} to scan.`,
      });
      return;
    }

    setAssetScanStates(prev => ({ 
        ...prev, 
        [sponsorIndex]: {
            ...prev[sponsorIndex],
            [monthKey]: { balance: null, isScanning: true }
        }
    }));
    
    try {
        const dataUri = assetStatement.dataUri;
        const result = await scanAssetStatement({ statementDataUri: dataUri });
        setAssetScanStates(prev => ({
             ...prev,
             [sponsorIndex]: {
                ...prev[sponsorIndex],
                [monthKey]: { balance: result, isScanning: false }
             }
        }));
        toast({
            title: 'Scan Complete',
            description: `The account balance for Month ${monthKey === 'month1' ? 1 : monthKey === 'month2' ? 2 : 3} has been extracted.`,
        });
    } catch (error) {
      console.error('Asset Scan Error:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: `Could not extract the balance from the document for Month ${monthKey === 'month1' ? 1 : monthKey === 'month2' ? 2 : 3}. Please try again.`,
      });
      setAssetScanStates(prev => ({ 
          ...prev, 
          [sponsorIndex]: {
            ...prev[sponsorIndex],
            [monthKey]: { ...prev[sponsorIndex][monthKey], isScanning: false }
          }
      }));
    }
  };

  useEffect(() => {
    if (checklist) {
        const synced = syncChecklistWithContext(checklist);
        if (JSON.stringify(synced) !== JSON.stringify(checklist)) {
            setChecklist(synced);
        }
    }
  }, [documents, syncChecklistWithContext, checklist]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-4`);
  }

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
            <div className="flex items-center gap-3">
              {doc?.status === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
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
  
    const AssetStatementUploader = ({ month, monthKey, sponsorIndex }: { month: number, monthKey: 'month1' | 'month2' | 'month3', sponsorIndex: number }) => {
        const docName = `Personal Asset Statement (Month ${month}) (Sponsor ${sponsorIndex + 1})`;
        const scanState = assetScanStates[sponsorIndex]?.[monthKey];

        if (!scanState) return null;

        return (
             <div className="space-y-4 rounded-md border p-4">
                 <h4 className="font-semibold">Personal Asset Statement - Month {month}</h4>
                 <div className="space-y-2">
                    <Label htmlFor={`personal-asset-upload-${month}-${sponsorIndex}`}>Upload Asset Statement (Month {month})</Label>
                    <div className="flex gap-2">
                        <Input id={`personal-asset-upload-${month}-${sponsorIndex}`} type="file" onChange={(e) => handleFileChange(docName, e)} />
                        <Button onClick={() => handleScanAssetStatement(monthKey, sponsorIndex)} disabled={scanState.isScanning || !documents[docName]}>
                            {scanState.isScanning ? <Loader2 className="animate-spin" /> : <Landmark />}
                            <span className="ml-2 hidden sm:inline">Scan</span>
                        </Button>
                    </div>
                </div>
                {scanState.balance && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Most Recent Balance</p>
                        <p className="text-2xl font-bold">{scanState.balance.balance}</p>
                    </div>
                )}
            </div>
        )
    }
  
  if (isLoadingChecklist) {
    return <div>Loading document checklist...</div>
  }

  if (!checklist) {
    return <div>Could not load checklist. Please go back and select a loan program.</div>
  }
  
  const renderSponsorshipSection = (sponsorIndex: number) => (
      <Card key={`sponsor-${sponsorIndex}`}>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Sponsorship Documents (Sponsor #{sponsorIndex + 1})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <DocumentUploadInput name={`ID/Driver's License (Sponsor ${sponsorIndex + 1})`} />
              <DocumentUploadInput name={`Credit Report (Sponsor ${sponsorIndex + 1})`} />
              <DocumentUploadInput name={`Personal Financial Statement (Sponsor ${sponsorIndex + 1})`} />
              <DocumentUploadInput name={`Experience (Sponsor ${sponsorIndex + 1})`} />
              <DocumentUploadInput name={`Real Estate Owned (Sponsor ${sponsorIndex + 1})`} />
              <h3 className="font-semibold pt-4 border-t">Asset Statements (Last 3 Months)</h3>
              <AssetStatementUploader month={1} monthKey="month1" sponsorIndex={sponsorIndex} />
              <AssetStatementUploader month={2} monthKey="month2" sponsorIndex={sponsorIndex} />
              <AssetStatementUploader month={3} monthKey="month3" sponsorIndex={sponsorIndex} />
          </CardContent>
      </Card>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sponsor Information</CardTitle>
            <CardDescription>Select the number of sponsors for this loan.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {Array.from({ length: numberOfSponsors }).map((_, index) => renderSponsorshipSection(index))}
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 2
            </Button>
            <Button onClick={handleNextPage}>
                Continue to Page 4 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
