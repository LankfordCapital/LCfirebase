

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { CheckCircle, ArrowLeft, ArrowRight, BookUser, Building, Shield, Briefcase, FileText, FileUp } from 'lucide-react';
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


export function LoanApplicationClientPage4({ loanProgram }: { loanProgram: string}) {
  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);
  const [insuranceAgentName, setInsuranceAgentName] = useState('');
  const [insuranceAgentCompany, setInsuranceAgentCompany] = useState('');
  const [insuranceAgentPhone, setInsuranceAgentPhone] = useState('');
  const [insuranceAgentEmail, setInsuranceAgentEmail] = useState('');

  const [titleAgentName, setTitleAgentName] = useState('');
  const [titleAgentCompany, setTitleAgentCompany] = useState('');
  const [titleAgentPhone, setTitleAgentPhone] = useState('');
  const [titleAgentEmail, setTitleAgentEmail] = useState('');
  
  const [escrowAgentName, setEscrowAgentName] = useState('');
  const [escrowAgentCompany, setEscrowAgentCompany] = useState('');
  const [escrowAgentPhone, setEscrowAgentPhone] = useState('');
  const [escrowAgentEmail, setEscrowAgentEmail] = useState('');

  const [gcName, setGcName] = useState('');
  const [gcPhone, setGcPhone] = useState('');
  const [gcEmail, setGcEmail] = useState('');

  const { documents, addDocument, getDocument } = useDocumentContext();
  const { user, loading: authLoading } = useAuth();
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
    if (loanProgram && !authLoading) {
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
        } finally {
          setIsLoadingChecklist(false);
        }
      };
      fetchChecklist();
    }
  }, [loanProgram, authLoading, syncChecklistWithContext]);

  
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
  
  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-5`);
  }

  const constructionDocs = [
    "General Contractor License",
    "General Contractor Insurance",
    "General Contractor Bond",
    "General Contractor's Contract to Build",
    "Construction Budget",
    "Projected Draw Schedule",
    "Construction Plans",
    "Construction Plans, Budget, and Timeline",
    "Approved or Pre-approved Plans",
    "Approved Permits",
  ];

  const gcDocuments = checklist?.subjectProperty.filter(item => constructionDocs.includes(item.name));

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 4 of 6</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        {gcDocuments && gcDocuments.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> General Contractor Details</CardTitle>
                    <CardDescription>This section is required for all construction, rehab, and fix & flip loans.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gcName">Contractor Name</Label>
                            <Input id="gcName" value={gcName} onChange={e => setGcName(e.target.value)} placeholder="GC Company Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gcPhone">Contractor Phone</Label>
                            <Input id="gcPhone" type="tel" value={gcPhone} onChange={e => setGcPhone(e.target.value)} placeholder="(555) 123-4567" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gcEmail">Contractor Email</Label>
                        <Input id="gcEmail" type="email" value={gcEmail} onChange={e => setGcEmail(e.target.value)} placeholder="contact@gccompany.com"/>
                    </div>
                    {gcDocuments.map(doc => <DocumentUploadInput key={doc.name} name={doc.name} />)}
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Insurance Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="insuranceAgentName">Agent Name</Label>
                        <Input id="insuranceAgentName" value={insuranceAgentName} onChange={e => setInsuranceAgentName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="insuranceAgentCompany">Agent Company</Label>
                        <Input id="insuranceAgentCompany" value={insuranceAgentCompany} onChange={e => setInsuranceAgentCompany(e.target.value)} />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="insuranceAgentPhone">Agent Phone</Label>
                        <Input id="insuranceAgentPhone" type="tel" value={insuranceAgentPhone} onChange={e => setInsuranceAgentPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="insuranceAgentEmail">Agent Email</Label>
                        <Input id="insuranceAgentEmail" type="email" value={insuranceAgentEmail} onChange={e => setInsuranceAgentEmail(e.target.value)} />
                    </div>
                </div>
                 <DocumentUploadInput name="Builder's Risk Insurance Quote" />
                 <DocumentUploadInput name="Commercial Liability Insurance Quote" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookUser className="h-5 w-5 text-primary" /> Title Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="titleAgentName">Agent Name</Label>
                        <Input id="titleAgentName" value={titleAgentName} onChange={e => setTitleAgentName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="titleAgentCompany">Company Name</Label>
                        <Input id="titleAgentCompany" value={titleAgentCompany} onChange={e => setTitleAgentCompany(e.target.value)} />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="titleAgentPhone">Agent Phone</Label>
                        <Input id="titleAgentPhone" type="tel" value={titleAgentPhone} onChange={e => setTitleAgentPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="titleAgentEmail">Agent Email</Label>
                        <Input id="titleAgentEmail" type="email" value={titleAgentEmail} onChange={e => setTitleAgentEmail(e.target.value)} />
                    </div>
                </div>
                <DocumentUploadInput name="Preliminary Title Commitment" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Escrow Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="escrowAgentName">Agent Name</Label>
                        <Input id="escrowAgentName" value={escrowAgentName} onChange={e => setEscrowAgentName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="escrowAgentCompany">Company Name</Label>
                        <Input id="escrowAgentCompany" value={escrowAgentCompany} onChange={e => setEscrowAgentCompany(e.target.value)} />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="escrowAgentPhone">Agent Phone</Label>
                        <Input id="escrowAgentPhone" type="tel" value={escrowAgentPhone} onChange={e => setEscrowAgentPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="escrowAgentEmail">Agent Email</Label>
                        <Input id="escrowAgentEmail" type="email" value={escrowAgentEmail} onChange={e => setEscrowAgentEmail(e.target.value)} />
                    </div>
                </div>
                 <DocumentUploadInput name="Escrow Instructions" />
                 <DocumentUploadInput name="Closing Protection Letter" />
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 3
            </Button>
            <Button onClick={handleNextPage}>
                Continue to Page 5 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
