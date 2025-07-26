
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
  const [admin, setAdmin] = useState(0);
  const [payroll, setPayroll] = useState(0);
  const [propertyTaxes, setPropertyTaxes] = useState(0);
  const [landscaping, setLandscaping] = useState(0);
  const [licensing, setLicensing] = useState(0);
  const [marketing, setMarketing] = useState(0);
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState(0);
  const [netOperatingIncome, setNetOperatingIncome] = useState(0);

  useEffect(() => {
    const agi = grossIncome - vacancy - nonPerformance - management;
    setAdjustedGrossIncome(agi);
    
    const otherExpenses = utilities + insurance + maintenance + updates + grounds + admin + payroll + propertyTaxes + landscaping + licensing + marketing;
    const noi = agi - otherExpenses;
    setNetOperatingIncome(noi);
  }, [grossIncome, utilities, insurance, management, vacancy, nonPerformance, maintenance, updates, grounds, admin, payroll, propertyTaxes, landscaping, licensing, marketing]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-3`);
  }

  const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value) || 0);
  };
  
  const calculatePercentage = (expense: number) => {
    if (grossIncome === 0) return '0.00%';
    return ((expense / grossIncome) * 100).toFixed(2) + '%';
  };

  const ExpenseInput = ({ label, value, setter, placeholder }: { label: string, value: number, setter: (value: number) => void, placeholder?: string }) => (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={label.toLowerCase()} type="number" placeholder={placeholder} value={value || ''} onChange={handleNumberChange(setter)} />
        <span className="text-sm text-muted-foreground w-20 text-right">{calculatePercentage(value)}</span>
      </div>
    </div>
  );

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
                    <ExpenseInput label="Vacancy" value={vacancy} setter={setVacancy} placeholder="e.g., 500" />
                    <ExpenseInput label="Non-Performance" value={nonPerformance} setter={setNonPerformance} placeholder="e.g., 200" />
                    <ExpenseInput label="Management" value={management} setter={setManagement} placeholder="e.g., 800" />
                </div>

                <div className="pt-4 border-t">
                    <Label className="font-bold text-lg">Adjusted Gross Income</Label>
                    <p className="text-2xl font-bold text-primary">
                        {adjustedGrossIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                
                <h3 className="font-semibold pt-4 border-t">Other Monthly Expenses</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ExpenseInput label="Utilities" value={utilities} setter={setUtilities} placeholder="e.g., 500" />
                    <ExpenseInput label="Insurance" value={insurance} setter={setInsurance} placeholder="e.g., 200" />
                    <ExpenseInput label="Maintenance" value={maintenance} setter={setMaintenance} placeholder="e.g., 300" />
                    <ExpenseInput label="Updates" value={updates} setter={setUpdates} placeholder="e.g., 150" />
                    <ExpenseInput label="Grounds" value={grounds} setter={setGrounds} placeholder="e.g., 100" />
                    <ExpenseInput label="Admin" value={admin} setter={setAdmin} placeholder="e.g., 100" />
                    <ExpenseInput label="Payroll" value={payroll} setter={setPayroll} placeholder="e.g., 2000" />
                    <ExpenseInput label="Property Taxes" value={propertyTaxes} setter={setPropertyTaxes} placeholder="e.g., 400" />
                    <ExpenseInput label="Landscaping" value={landscaping} setter={setLandscaping} placeholder="e.g., 150" />
                    <ExpenseInput label="Licensing" value={licensing} setter={setLicensing} placeholder="e.g., 50" />
                    <ExpenseInput label="Marketing" value={marketing} setter={setMarketing} placeholder="e.g., 100" />
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
