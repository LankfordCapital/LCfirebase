'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle, FileUp, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { getDocumentChecklist } from '@/ai/flows/document-checklist-flow';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { useDocumentContext, type Document } from '@/contexts/document-context';

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

function DocumentChecklistComponent() {
  const searchParams = useSearchParams();
  const loanProgram = searchParams.get('program') || '';

  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiPreUnderwriterOutput | null>(null);

  const { documents, addDocument } = useDocumentContext();
  const { toast } = useToast();

  const syncChecklistWithContext = useCallback((checklistData: CategorizedDocuments) => {
    const newChecklist = { ...checklistData };
    (Object.keys(newChecklist) as Array<keyof CategorizedDocuments>).forEach(category => {
        newChecklist[category] = newChecklist[category].map(item => {
            const docFromContext = documents[item.name];
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
  }, [documents]);

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

  const handleFileChange = async (category: keyof CategorizedDocuments, itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && checklist) {
      const file = event.target.files[0];
      
      const newDoc: Document = {
        name: itemName,
        file,
        dataUri: '',
        status: 'uploaded',
      };
      await addDocument(newDoc);
      
      const updatedChecklist = { ...checklist };
      const itemIndex = updatedChecklist[category].findIndex(item => item.name === itemName);
      if (itemIndex > -1) {
        updatedChecklist[category][itemIndex] = {
          ...updatedChecklist[category][itemIndex],
          status: 'uploaded',
          file: file,
          dataUri: (await documents[itemName])?.dataUri,
        };
        setChecklist(updatedChecklist);
      }
    }
  };

  const handleAnalyzeDocuments = async () => {
    if (!checklist) return;
    
    const uploadedDocumentsForAnalysis = Object.values(documents)
      .filter(doc => doc.status === 'uploaded' && doc.file && doc.dataUri)
      .map(doc => ({ filename: doc.file.name, dataUri: doc.dataUri }));
      
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

  if (isLoadingChecklist) {
    return <div>Loading Checklist...</div>;
  }

  if (!checklist) {
    return <div>Could not load checklist. Please go back and select a loan program.</div>;
  }
  
  const renderChecklistCategory = (category: keyof CategorizedDocuments, title: string) => (
      <Card>
          <CardHeader>
              <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {checklist[category].map(item => (
                  <div key={item.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        {item.status === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {(item.status === 'uploaded' || documents[item.name]?.status === 'uploaded') && <FileUp className="h-5 w-5 text-blue-500" />}
                        {item.status === 'missing' && !documents[item.name] && <FileText className="h-5 w-5 text-muted-foreground" />}
                        <Label htmlFor={item.name} className="font-medium">{item.name}</Label>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input id={item.name} type="file" className="w-full sm:w-auto" onChange={(e) => handleFileChange(category, item.name, e)} disabled={isAnalyzing || !!documents[item.name]} />
                      </div>
                  </div>
              ))}
          </CardContent>
      </Card>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Document Checklist</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>

        {renderChecklistCategory('borrower', 'Borrower Documents')}
        {renderChecklistCategory('company', 'Company Documents')}
        {renderChecklistCategory('subjectProperty', 'Subject Property Documents')}

        <div className="flex justify-end">
            <Button onClick={handleAnalyzeDocuments} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Analyze Uploaded Documents
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

export function DocumentChecklistClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocumentChecklistComponent />
        </Suspense>
    )
}
