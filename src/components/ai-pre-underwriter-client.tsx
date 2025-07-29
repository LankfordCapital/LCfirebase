
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';


export function AIPReUnderwriterClient() {
  const [loanProgram, setLoanProgram] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleContinue = () => {
    if (!loanProgram) {
       toast({
        variant: 'destructive',
        title: 'Missing Loan Program',
        description: 'Please select a loan program to continue.',
      });
      return;
    }
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
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
        </div>

        <Button onClick={handleContinue} disabled={!loanProgram}>
          Continue <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
