

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useDocumentContext } from '@/contexts/document-context';
import { ComparableSales } from './comparable-sales';
import { CheckCircle, Briefcase, Shield, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoanApplicationClientPage2({ loanProgram }: { loanProgram: string}) {
  const [gcName, setGcName] = useState('');
  const [gcPhone, setGcPhone] = useState('');
  const [gcEmail, setGcEmail] = useState('');

  const [insuranceAgentName, setInsuranceAgentName] = useState('');
  const [insuranceAgentCompany, setInsuranceAgentCompany] = useState('');
  const [insuranceAgentPhone, setInsuranceAgentPhone] = useState('');
  const [insuranceAgentEmail, setInsuranceAgentEmail] = useState('');

  const [titleAgentName, setTitleAgentName] = useState('');
  const [titleAgentCompany, setTitleAgentCompany] = useState('');
  const [titleAgentPhone, setTitleAgentPhone] = useState('');
  const [titleAgentEmail, setTitleAgentEmail] = useState('');

  const { documents, addDocument } = useDocumentContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const showConstructionFields = loanProgram.toLowerCase().includes('construction') || loanProgram.toLowerCase().includes('fix and flip') || loanProgram.toLowerCase().includes('rehab');

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
        <div className="space-y-2">
            <Label htmlFor={fileInputId}>{name}</Label>
            <div className="flex items-center gap-2">
                <Input id={fileInputId} type="file" onChange={(e) => handleFileChange(name, e)} disabled={!!doc} />
                {doc && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
        </div>
    );
  };
  
  const handleSaveChanges = () => {
    // Here you would typically save all the state to your backend
    toast({
        title: "Information Saved",
        description: "All the details from page 2 have been saved.",
    });
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-3`);
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 2 of 4</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        {showConstructionFields && (
            <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> General Contractor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gcName">Contractor Name</Label>
                            <Input id="gcName" value={gcName} onChange={e => setGcName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gcPhone">Contractor Phone</Label>
                            <Input id="gcPhone" type="tel" value={gcPhone} onChange={e => setGcPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gcEmail">Contractor Email</Label>
                        <Input id="gcEmail" type="email" value={gcEmail} onChange={e => setGcEmail(e.target.value)} />
                    </div>
                     <DocumentUploadInput name="General Contractor License" />
                     <DocumentUploadInput name="General Contractor Insurance" />
                     <DocumentUploadInput name="General Contractor Bond" />
                     <DocumentUploadInput name="General Contractor's Contract to Build" />
                     <DocumentUploadInput name="Construction Budget" />
                     <DocumentUploadInput name="Projected Draw Schedule" />
                </CardContent>
            </Card>

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
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Title & Escrow Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="titleAgentName">Escrow Agent Name</Label>
                            <Input id="titleAgentName" value={titleAgentName} onChange={e => setTitleAgentName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="titleAgentCompany">Escrow Company</Label>
                            <Input id="titleAgentCompany" value={titleAgentCompany} onChange={e => setTitleAgentCompany(e.target.value)} />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="titleAgentPhone">Escrow Agent Phone</Label>
                            <Input id="titleAgentPhone" type="tel" value={titleAgentPhone} onChange={e => setTitleAgentPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleAgentEmail">Escrow Agent Email</Label>
                            <Input id="titleAgentEmail" type="email" value={titleAgentEmail} onChange={e => setInsuranceAgentEmail(e.target.value)} />
                        </div>
                    </div>
                     <DocumentUploadInput name="Preliminary Title Commitment" />
                     <DocumentUploadInput name="Escrow Instructions" />
                     <DocumentUploadInput name="Closing Protection Letter" />
                </CardContent>
            </Card>
            </>
        )}
        
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" />
                    Comparable Sales
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="py-4">
                    <ComparableSales />
                </div>
            </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 1
            </Button>
            <Button onClick={handleSaveChanges}>
                Save & Continue to Page 3 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
