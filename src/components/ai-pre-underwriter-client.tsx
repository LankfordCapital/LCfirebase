'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { ListTodo } from 'lucide-react';

export function AIPReUnderwriterClient() {
  const [loanProgram, setLoanProgram] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = () => {
    if (!loanProgram) {
       toast({
        variant: 'destructive',
        title: 'Missing Loan Program',
        description: 'Please select a loan program to continue.',
      });
      return;
    }
    router.push(`/dashboard/documents/checklist?program=${encodeURIComponent(loanProgram)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a New Loan Application</CardTitle>
        <CardDescription>Select a loan program to begin. You will be guided through the required document checklist.</CardDescription>
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
                        <SelectItem value="SBA 7(a)">SBA 7(a)</SelectItem>
                        <SelectItem value="SBA 504">SBA 504</SelectItem>
                        <SelectItem value="Land Acquisition">Land Acquisition</SelectItem>
                          <SelectItem value="Mezzanine Loans">Mezzanine Loans</SelectItem>
                          <SelectItem value="Mobilization Funding">Mobilization Funding</SelectItem>
                          <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        
        <Button onClick={handleSubmit} disabled={!loanProgram}>
          <ListTodo className="mr-2 h-4 w-4" />
          Proceed to Checklist
        </Button>

      </CardContent>
    </Card>
  );
}
