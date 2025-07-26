

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoanApplicationClientPage2({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const [grossIncome, setGrossIncome] = useState(0);
  const [utilities, setUtilities] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [management, setManagement] = useState(0);
  const [vacancy, setVacancy] = useState(0);
  const [nonPerformance, setNonPerformance] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [updates, setUpdates] = useState(0);
  const [grounds, setGrounds] = useState(0);
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState(0);
  const [netOperatingIncome, setNetOperatingIncome] = useState(0);

  useEffect(() => {
    const agi = grossIncome - vacancy - nonPerformance - management;
    setAdjustedGrossIncome(agi);
    
    const otherExpenses = utilities + insurance + maintenance + updates + grounds;
    const noi = agi - otherExpenses;
    setNetOperatingIncome(noi);
  }, [grossIncome, utilities, insurance, management, vacancy, nonPerformance, maintenance, updates, grounds]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-3`);
  }

  const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value) || 0);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 2 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Subject Property Financials</CardTitle>
                <CardDescription>Provide the projected monthly income and expenses for the subject property.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="grossIncome">Gross Income</Label>
                    <Input id="grossIncome" type="number" placeholder="e.g., 10000" onChange={handleNumberChange(setGrossIncome)} />
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="vacancy">Vacancy</Label>
                        <Input id="vacancy" type="number" placeholder="e.g., 500" onChange={handleNumberChange(setVacancy)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="nonPerformance">Non-Performance</Label>
                        <Input id="nonPerformance" type="number" placeholder="e.g., 200" onChange={handleNumberChange(setNonPerformance)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="management">Management</Label>
                        <Input id="management" type="number" placeholder="e.g., 800" onChange={handleNumberChange(setManagement)} />
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Label className="font-bold text-lg">Adjusted Gross Income</Label>
                    <p className="text-2xl font-bold text-primary">
                        {adjustedGrossIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                
                <h3 className="font-semibold pt-4 border-t">Other Monthly Expenses</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="utilities">Utilities</Label>
                        <Input id="utilities" type="number" placeholder="e.g., 500" onChange={handleNumberChange(setUtilities)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance</Label>
                        <Input id="insurance" type="number" placeholder="e.g., 200" onChange={handleNumberChange(setInsurance)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maintenance">Maintenance</Label>
                        <Input id="maintenance" type="number" placeholder="e.g., 300" onChange={handleNumberChange(setMaintenance)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="updates">Updates</Label>
                        <Input id="updates" type="number" placeholder="e.g., 150" onChange={handleNumberChange(setUpdates)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="grounds">Grounds</Label>
                        <Input id="grounds" type="number" placeholder="e.g., 100" onChange={handleNumberChange(setGrounds)} />
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Label className="font-bold text-lg">Net Operating Income</Label>
                    <p className="text-2xl font-bold text-green-600">
                        {netOperatingIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 1
            </Button>
            <Button onClick={handleNextPage}>
                Continue to Page 3 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}

