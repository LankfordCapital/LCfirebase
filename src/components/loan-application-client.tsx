

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle, FileUp, Check, Building2, User, Mail, Phone, Shield, File, Briefcase, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { getDocumentChecklist } from '@/ai/flows/document-checklist-flow';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { useDocumentContext } from '@/contexts/document-context';
import { useRouter } from 'next/navigation';

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

export function LoanApplicationClient({ loanProgram }: { loanProgram: string}) {
  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiPreUnderwriterOutput | null>(null);
  
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyApn, setPropertyApn] = useState('');
  const [propertyTaxes, setPropertyTaxes] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [rehabCost, setRehabCost] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [constructionTime, setConstructionTime] = useState('');


  const { documents, addDocument, getDocument } = useDocumentContext();
  const { toast } = useToast();
  const router = useRouter();

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
  
  useEffect(() => {
    if (checklist) {
        const synced = syncChecklistWithContext(checklist);
        // Avoid infinite loop by checking if state actually changed
        if (JSON.stringify(synced) !== JSON.stringify(checklist)) {
            setChecklist(synced);
        }
    }
  }, [documents, syncChecklistWithContext, checklist]);


  const handleAnalyzeDocuments = async () => {
    if (!checklist) return;
    
    const uploadedDocumentsForAnalysis = Object.values(documents)
      .filter(doc => doc.status === 'uploaded' && doc.file && doc.dataUri)
      .map(doc => ({ filename: doc.file!.name, dataUri: doc.dataUri! }));
      
    if (uploadedDocumentsForAnalysis.length === 0) {
        toast({
            variant: "destructive",
            title: "No Documents Uploaded",
            description: "Please upload at least one document to analyze."
        });
        return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
        const fullRequestList = {
             borrower: checklist.borrower.map(i => i.name),
             company: checklist.company.map(i => i.name),
             subjectProperty: checklist.subjectProperty.map(i => i.name),
        }
        const result = await aiPreUnderwriter({ loanProgram, uploadedDocuments: uploadedDocumentsForAnalysis, documentRequestList: fullRequestList });
        setAnalysisResult(result);

        // Update checklist status based on analysis
        const updatedChecklist = { ...checklist };
        (Object.keys(updatedChecklist) as Array<keyof CategorizedDocuments>).forEach(category => {
            updatedChecklist[category].forEach(item => {
                if(item.status === 'uploaded') {
                    const isMissing = result.missingDocuments[category]?.includes(item.name);
                    if (!isMissing) {
                        item.status = 'verified';
                    }
                }
            })
        });
        setChecklist(updatedChecklist);

        toast({
            title: "Analysis Complete",
            description: "Your documents have been analyzed.",
        });
    } catch (error) {
        console.error("Analysis failed", error);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "An error occurred while analyzing your documents."
        })
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const showConstructionFields = loanProgram.toLowerCase().includes('construction') || loanProgram.toLowerCase().includes('fix and flip') || loanProgram.toLowerCase().includes('rehab');

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    return (
        <div className="space-y-2">
            <Label htmlFor={fileInputId}>{name}</Label>
            <div className="flex items-center gap-2">
                <Input id={fileInputId} type="file" onChange={(e) => handleFileChange(name, e)} disabled={isAnalyzing || !!doc} />
                {doc && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
        </div>
    );
  };

  if (isLoadingChecklist) {
    return <div>Loading Application...</div>;
  }

  if (!checklist) {
    return <div>Could not load application. Please go back and select a loan program.</div>;
  }
  
  const renderChecklistCategory = (category: keyof CategorizedDocuments, title: string, icon: React.ReactNode) => (
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {checklist[category].map(item => {
                  const doc = getDocument(item.name);
                  return (
                    <div key={item.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          {doc?.status === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {doc?.status === 'uploaded' && <FileUp className="h-5 w-5 text-blue-500" />}
                          {!doc && <FileText className="h-5 w-5 text-muted-foreground" />}
                          <Label htmlFor={item.name} className="font-medium">{item.name}</Label>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Input id={item.name} type="file" className="w-full sm:w-auto" onChange={(e) => handleFileChange(item.name, e)} disabled={isAnalyzing || !!doc} />
                        </div>
                    </div>
                  )
              })}
          </CardContent>
      </Card>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 1 of 4</h1>
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
                    <Label htmlFor="lotSize">Lot Size (in sq. ft. or acres)</Label>
                    <Input id="lotSize" placeholder="e.g., 10,000 sq. ft. or 0.23 acres" value={lotSize} onChange={e => setLotSize(e.target.value)} />
                </div>
                 {showConstructionFields && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="rehabCost">Estimated Rehab/Construction Cost</Label>
                            <Input id="rehabCost" type="number" placeholder="e.g., 50000" value={rehabCost} onChange={e => setRehabCost(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="constructionTime">Estimated Time to Construct (in months)</Label>
                            <Input id="constructionTime" type="number" placeholder="e.g., 6" value={constructionTime} onChange={e => setConstructionTime(e.target.value)} />
                        </div>
                    </>
                )}
                 <DocumentUploadInput name="Property Tax Certificate" />
            </CardContent>
        </Card>

        {renderChecklistCategory('borrower', 'Borrower Documents', <User className="h-5 w-5 text-primary" />)}
        {renderChecklistCategory('company', 'Company Documents', <Briefcase className="h-5 w-5 text-primary" />)}
        {renderChecklistCategory('subjectProperty', 'Subject Property Documents', <File className="h-5 w-5 text-primary" />)}

        <div className="flex justify-between items-center">
            <Button onClick={handleAnalyzeDocuments} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Analyze Uploaded Documents
            </Button>
            <Button onClick={() => router.push(`/dashboard/application/${loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}/page-2`)}>
                Continue to Page 2 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>

        {analysisResult && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Analysis Results</h3>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Prequalification Status: {analysisResult.prequalificationStatus}</AlertTitle>
            </Alert>
            
            {analysisResult.potentialIssues && analysisResult.potentialIssues.length > 0 && (
                <Collapsible>
                    <CollapsibleTrigger asChild>
                         <Button variant="outline" className="w-full justify-start">
                            <AlertTriangle className="h-5 w-5 text-destructive mr-2" /> Potential Issues Found
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-2">
                            <CardContent className="pt-6">
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {analysisResult.potentialIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>
            )}
            </div>
        )}
    </div>
  );
}
