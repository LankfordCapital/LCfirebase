
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComparableSales } from './comparable-sales';
import { ComparableRentals } from './comparable-rentals';

// Helper component for individual expense inputs
const ExpenseInput = ({ label, value, onValueChange, grossIncome, placeholder }: { label: string, value: string, onValueChange: (value: string) => void, grossIncome: number, placeholder?: string }) => {
    const calculatePercentage = (expense: string) => {
        const numericExpense = parseFloat(expense) || 0;
        if (grossIncome === 0) return '0.00%';
        return ((numericExpense / grossIncome) * 100).toFixed(2) + '%';
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={label.toLowerCase()}>{label}</Label>
            <div className="flex items-center gap-2">
                <Input
                    id={label.toLowerCase()}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                />
                <span className="text-sm text-muted-foreground w-20 text-right">{calculatePercentage(value)}</span>
            </div>
        </div>
    );
};

export function LoanApplicationClientPage2({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const [grossIncome, setGrossIncome] = useState('');
  const [utilities, setUtilities] = useState('');
  const [insurance, setInsurance] = useState('');
  const [management, setManagement] = useState('');
  const [vacancy, setVacancy] = useState('');
  const [nonPerformance, setNonPerformance] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [updates, setUpdates] = useState('');
  const [grounds, setGrounds] = useState('');
  const [admin, setAdmin] = useState('');
  const [payroll, setPayroll] = useState('');
  const [propertyTaxes, setPropertyTaxes] = useState('');
  const [landscaping, setLandscaping] = useState('');
  const [licensing, setLicensing] = useState('');
  const [marketing, setMarketing] = useState('');
  
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState(0);
  const [netOperatingIncome, setNetOperatingIncome] = useState(0);

  useEffect(() => {
    const numGrossIncome = parseFloat(grossIncome) || 0;
    const numVacancy = parseFloat(vacancy) || 0;
    const numNonPerformance = parseFloat(nonPerformance) || 0;
    const numManagement = parseFloat(management) || 0;
    
    const agi = numGrossIncome - numVacancy - numNonPerformance - numManagement;
    setAdjustedGrossIncome(agi);
    
    const numUtilities = parseFloat(utilities) || 0;
    const numInsurance = parseFloat(insurance) || 0;
    const numMaintenance = parseFloat(maintenance) || 0;
    const numUpdates = parseFloat(updates) || 0;
    const numGrounds = parseFloat(grounds) || 0;
    const numAdmin = parseFloat(admin) || 0;
    const numPayroll = parseFloat(payroll) || 0;
    const numPropertyTaxes = parseFloat(propertyTaxes) || 0;
    const numLandscaping = parseFloat(landscaping) || 0;
    const numLicensing = parseFloat(licensing) || 0;
    const numMarketing = parseFloat(marketing) || 0;

    const otherExpenses = numUtilities + numInsurance + numMaintenance + numUpdates + numGrounds + numAdmin + numPayroll + numPropertyTaxes + numLandscaping + numLicensing + numMarketing;
    const noi = agi - otherExpenses;
    setNetOperatingIncome(noi);
  }, [grossIncome, vacancy, nonPerformance, management, utilities, insurance, maintenance, updates, grounds, admin, payroll, propertyTaxes, landscaping, licensing, marketing]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-3`);
  }
  
  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 2 of 12</h1>
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
                    <Input id="grossIncome" type="text" placeholder="e.g., 10000" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} />
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <ExpenseInput label="Vacancy" value={vacancy} onValueChange={setVacancy} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 500" />
                    <ExpenseInput label="Non-Performance" value={nonPerformance} onValueChange={setNonPerformance} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 200" />
                    <ExpenseInput label="Management" value={management} onValueChange={setManagement} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 800" />
                </div>

                <div className="pt-4 border-t">
                    <Label className="font-bold text-lg">Adjusted Gross Income</Label>
                    <p className="text-2xl font-bold text-primary">
                        {adjustedGrossIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                
                <h3 className="font-semibold pt-4 border-t">Other Monthly Expenses</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ExpenseInput label="Utilities" value={utilities} onValueChange={setUtilities} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 500" />
                    <ExpenseInput label="Insurance" value={insurance} onValueChange={setInsurance} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 200" />
                    <ExpenseInput label="Maintenance" value={maintenance} onValueChange={setMaintenance} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 300" />
                    <ExpenseInput label="Updates" value={updates} onValueChange={setUpdates} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 150" />
                    <ExpenseInput label="Grounds" value={grounds} onValueChange={setGrounds} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 100" />
                    <ExpenseInput label="Admin" value={admin} onValueChange={setAdmin} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 100" />
                    <ExpenseInput label="Payroll" value={payroll} onValueChange={setPayroll} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 2000" />
                    <ExpenseInput label="Property Taxes" value={propertyTaxes} onValueChange={setPropertyTaxes} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 400" />
                    <ExpenseInput label="Landscaping" value={landscaping} onValueChange={setLandscaping} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 150" />
                    <ExpenseInput label="Licensing" value={licensing} onValueChange={setLicensing} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 50" />
                    <ExpenseInput label="Marketing" value={marketing} onValueChange={setMarketing} grossIncome={parseFloat(grossIncome) || 0} placeholder="e.g., 100" />
                </div>

                <div className="pt-4 border-t">
                    <Label className="font-bold text-lg">Net Operating Income</Label>
                    <p className="text-2xl font-bold text-green-600">
                        {netOperatingIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <ComparableSales />
            <ComparableRentals />
        </div>
        
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
