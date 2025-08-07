

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, FileText } from 'lucide-react';
import { getDocumentChecklist, type GetDocumentChecklistOutput } from '@/ai/flows/document-checklist-flow';
import { CustomLoader } from './ui/custom-loader';

type Checklist = GetDocumentChecklistOutput['documentRequestList'];

export function AIPReUnderwriterClient() {
  const [loanProgram, setLoanProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleGenerateChecklist = async () => {
    if (!loanProgram) {
      toast({
        variant: 'destructive',
        title: 'Missing Loan Program',
        description: 'Please select a loan program to generate the checklist.',
      });
      return;
    }
    setIsLoading(true);
    setChecklist(null);
    try {
      const response = await getDocumentChecklist({ loanProgram });
      setChecklist(response.documentRequestList);
      toast({
        title: 'Checklist Generated',
        description: `Generated document checklist for ${loanProgram}.`,
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Checklist Generation Failed',
        description: 'Could not generate the document checklist. Please try again.',
      });
      console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!loanProgram) {
       toast({
        variant: 'destructive',
        title: 'Missing Loan Program',
        description: 'Please select a loan program to continue.',
      });
      return;
    }
    const programSlug = loanProgram.toLowerCase().replace(/\s-\s/g, '-').replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Application</CardTitle>
        <CardDescription>Select a loan program to generate a tailored document checklist and begin your application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Loan Program</Label>
            <div className="flex items-center gap-2">
                <Select onValueChange={setLoanProgram} value={loanProgram}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a program..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Residential NOO</SelectLabel>
                            <SelectItem value="Residential NOO - Ground Up Construction">Ground Up Construction</SelectItem>
                            <SelectItem value="Residential NOO - Fix and Flip">Fix and Flip</SelectItem>
                            <SelectItem value="Residential NOO - DSCR">DSCR Loan</SelectItem>
                            <SelectItem value="Residential NOO - Bridge">Bridge Loan</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                              <SelectLabel>Commercial</SelectLabel>
                            <SelectItem value="Commercial - Ground Up Construction">Ground Up Construction</SelectItem>
                            <SelectItem value="Commercial - Rehab Loans">Rehab Loans</SelectItem>
                            <SelectItem value="Commercial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                            <SelectItem value="Commercial - Conventional Long Term Debt">Conventional Long Term Debt</SelectItem>
                        </SelectGroup>
                          <SelectGroup>
                              <SelectLabel>Industrial</SelectLabel>
                            <SelectItem value="Industrial - Ground Up Construction">Ground Up Construction</SelectItem>
                            <SelectItem value="Industrial - Rehab & Expansion">Rehab & Expansion</SelectItem>
                              <SelectItem value="Industrial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                            <SelectItem value="Industrial - Long Term Debt">Long Term Debt</SelectItem>
                        </SelectGroup>
                          <SelectGroup>
                              <SelectLabel>Other</SelectLabel>
                            <SelectItem value="Land Acquisition">Land Acquisition</SelectItem>
                              <SelectItem value="Mezzanine Loans">Mezzanine Loans</SelectItem>
                              <SelectItem value="Mobilization Funding">Mobilization Funding</SelectItem>
                              <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                 <Button onClick={handleGenerateChecklist} disabled={!loanProgram || isLoading}>
                    {isLoading ? <CustomLoader className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Generate Checklist
                </Button>
            </div>
        </div>
        
        {checklist && (
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-headline text-xl font-bold">Required Documents for {loanProgram}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(checklist).map(([category, items]) => (
                        items.length > 0 && (
                            <div key={category} className="space-y-2">
                                <h4 className="font-semibold capitalize">{category}</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    {items.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))}
                </div>
                 <Button onClick={handleContinue}>
                    Continue to Application <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
