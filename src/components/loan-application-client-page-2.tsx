

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, ArrowRight, Home, PlusCircle, Trash2, Scale, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOfficeContextFromUrl, getOfficeBasePath } from '@/lib/office-routing';

// Helper component for individual expense inputs
const PnLInput = ({ label, value, onValueChange, placeholder }: { label: string, value: string, onValueChange: (value: string) => void, placeholder?: string }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={label.toLowerCase().replace(/ /g, '-')}>{label}</Label>
            <div className="flex items-center gap-2">
                <span className="p-2.5 text-muted-foreground">$</span>
                <Input
                    id={label.toLowerCase().replace(/ /g, '-')}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </div>
    );
};

export function LoanApplicationClientPage2({ loanProgram, officeContext = 'borrower' }: { loanProgram: string, officeContext?: 'borrower' | 'broker' | 'workforce' }) {
  const router = useRouter();

  // P&L State
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  
  // Operating Expenses
  const [salaries, setSalaries] = useState('');
  const [rent, setRent] = useState('');
  const [utilities, setUtilities] = useState('');
  const [marketing, setMarketing] = useState('');
  const [repairs, setRepairs] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');

  // Calculated Fields
  const [grossProfit, setGrossProfit] = useState(0);
  const [totalOperatingExpenses, setTotalOperatingExpenses] = useState(0);
  const [netOperatingIncome, setNetOperatingIncome] = useState(0);

  useEffect(() => {
    const numRevenue = parseFloat(revenue.replace(/,/g, '')) || 0;
    const numCogs = parseFloat(cogs.replace(/,/g, '')) || 0;
    const gp = numRevenue - numCogs;
    setGrossProfit(gp);
    
    const numSalaries = parseFloat(salaries.replace(/,/g, '')) || 0;
    const numRent = parseFloat(rent.replace(/,/g, '')) || 0;
    const numUtilities = parseFloat(utilities.replace(/,/g, '')) || 0;
    const numMarketing = parseFloat(marketing.replace(/,/g, '')) || 0;
    const numRepairs = parseFloat(repairs.replace(/,/g, '')) || 0;
    const numOther = parseFloat(otherExpenses.replace(/,/g, '')) || 0;

    const totalOpEx = numSalaries + numRent + numUtilities + numMarketing + numRepairs + numOther;
    setTotalOperatingExpenses(totalOpEx);

    setNetOperatingIncome(gp - totalOpEx);

  }, [revenue, cogs, salaries, rent, utilities, marketing, repairs, otherExpenses]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');

    // Get the current office context from the URL
    const currentOfficeContext = getOfficeContextFromUrl();
    const basePath = getOfficeBasePath(currentOfficeContext);

    if (isEquipmentFinancing) {
        router.push(`${basePath}/${programSlug}/page-4`);
    } else {
        router.push(`${basePath}/${programSlug}/page-3`);
    }
  }
  
  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 2 of 12</h1>
            <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Company Profit & Loss Statement</CardTitle>
                <CardDescription>Provide the company's recent monthly financial performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/>Revenue & Profit</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <PnLInput label="Total Revenue / Sales" value={revenue} onValueChange={setRevenue} placeholder="e.g., 50000" />
                        <PnLInput label="Cost of Goods Sold (COGS)" value={cogs} onValueChange={setCogs} placeholder="e.g., 20000" />
                    </div>
                     <div className="pt-4 border-t">
                        <Label className="font-bold text-lg">Gross Profit</Label>
                        <p className="text-2xl font-bold text-primary">
                            {grossProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><TrendingDown className="h-5 w-5 text-red-500"/>Operating Expenses</h3>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PnLInput label="Salaries & Wages" value={salaries} onValueChange={setSalaries} placeholder="e.g., 10000" />
                        <PnLInput label="Rent / Lease" value={rent} onValueChange={setRent} placeholder="e.g., 5000" />
                        <PnLInput label="Utilities" value={utilities} onValueChange={setUtilities} placeholder="e.g., 1000" />
                        <PnLInput label="Marketing & Advertising" value={marketing} onValueChange={setMarketing} placeholder="e.g., 2000" />
                        <PnLInput label="Repairs & Maintenance" value={repairs} onValueChange={setRepairs} placeholder="e.g., 500" />
                        <PnLInput label="Other Expenses" value={otherExpenses} onValueChange={setOtherExpenses} placeholder="e.g., 1500" />
                    </div>
                    <div className="pt-4 border-t">
                        <Label className="font-bold text-lg">Total Operating Expenses</Label>
                        <p className="text-2xl font-bold text-destructive">
                            {totalOperatingExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t bg-primary/5 p-4 rounded-lg">
                    <Label className="font-bold text-xl">Net Operating Income</Label>
                    <p className="text-3xl font-bold text-green-600">
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
                Continue to Next Page <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
