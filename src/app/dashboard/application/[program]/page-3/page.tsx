

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { CheckCircle, ArrowLeft, ArrowRight, FileText, FileUp, Check, AlertTriangle, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDocumentChecklist } from '@/ai/flows/document-checklist-flow';
import { useAuth } from '@/contexts/auth-context';

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

export function LoanApplicationClientPage3({ loanProgram }: { loanProgram: string}) {
  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);

  const { documents, addDocument, getDocument } = useDocumentContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isWorkforce = user?.email?.endsWith('@lankfordcapital.com') && user?.email !== 'admin@lankfordcapital.com';
  const workforceOnlyDocs = ["Appraisal", "Collateral Desktop Analysis"];
  
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

    if (workforceOnlyDocs.includes(name) && !isWorkforce) {
        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md border bg-muted/50">
                <div className="flex items-center gap-3">
                    {doc?.status === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {doc?.status === 'uploaded' && <FileUp className="h-5 w-5 text-blue-500" />}
                    {!doc && <FileText className="h-5 w-5 text-muted-foreground" />}
                    <Label htmlFor={fileInputId} className="font-medium">{name}</Label>
                </div>
                <div className="text-sm text-muted-foreground italic w-full sm:w-auto text-left sm:text-right">Workforce upload only</div>
            </div>
        )
    }

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
  
   const renderChecklistCategory = (category: keyof CategorizedDocuments, title: string, icon: React.ReactNode) => {
    if (!checklist || !checklist[category] || checklist[category].length === 0) return null;

    return (
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {checklist[category].map(item => <DocumentUploadInput key={item.name} name={item.name} />)}
          </CardContent>
      </Card>
    )
   };

  if (isLoadingChecklist) {
    return <div>Loading document checklist...</div>
  }

  if (!checklist) {
    return <div>Could not load checklist. Please go back and select a loan program.</div>
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 6</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        {renderChecklistCategory('company', 'Company Documents', <Briefcase className="h-5 w-5 text-primary" />)}

        {renderChecklistCategory(
          'subjectProperty',
          'Subject Property Documents',
          <FileText className="h-5 w-5 text-primary" />
        )}
        
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
