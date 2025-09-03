'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, DollarSign, TrendingDown, TrendingUp, Scale, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOfficeContextFromUrl, getOfficeBasePath } from '@/lib/office-routing';
import { useLoanApplication } from '@/hooks/use-loan-application';
import { useToast } from '@/hooks/use-toast';

// Helper component for individual expense inputs
const PnLInput = ({ 
  label, 
  value, 
  onValueChange, 
  placeholder,
  fieldPath,
  updateField,
  disabled = false
}: { 
  label: string, 
  value: string, 
  onValueChange: (value: string) => void, 
  placeholder?: string,
  fieldPath?: string,
  updateField?: (field: string, value: any) => void,
  disabled?: boolean
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    
    // Auto-save to database if fieldPath and updateField are provided
    if (fieldPath && updateField) {
      updateField(fieldPath, parseFloat(newValue.replace(/,/g, '')) || 0);
    }
  };

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
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export function LoanApplicationClientPage2Enhanced({ 
  loanProgram, 
  officeContext = 'borrower',
  applicationId 
}: { 
  loanProgram: string, 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string
}) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Use the enhanced loan application hook
  const { 
    application,
    loading,
    saving,
    updateField,
    updateFields
  } = useLoanApplication(applicationId);

  // Local state for form inputs (for immediate UI updates)
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
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

  // Load saved data when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId && application?.notes) {
      try {
        // Try to load saved financial data from notes
        const savedData = JSON.parse(application.notes);
        if (savedData.financialData) {
          const data = savedData.financialData;
          if (data.revenue) setRevenue(data.revenue.toString());
          if (data.cogs) setCogs(data.cogs.toString());
          if (data.salaries) setSalaries(data.salaries.toString());
          if (data.rent) setRent(data.rent.toString());
          if (data.utilities) setUtilities(data.utilities.toString());
          if (data.marketing) setMarketing(data.marketing.toString());
          if (data.repairs) setRepairs(data.repairs.toString());
          if (data.otherExpenses) setOtherExpenses(data.otherExpenses.toString());
        }
      } catch (error) {
        console.log('No saved financial data found');
      }
    }
  }, [applicationId, application]);

  // Calculate derived values
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

  // Save all form data to database
  const saveAllData = async () => {
    if (!applicationId) return;

    try {
      // Save financial data to notes field as JSON
      const financialData = {
        revenue: parseFloat(revenue.replace(/,/g, '')) || 0,
        cogs: parseFloat(cogs.replace(/,/g, '')) || 0,
        salaries: parseFloat(salaries.replace(/,/g, '')) || 0,
        rent: parseFloat(rent.replace(/,/g, '')) || 0,
        utilities: parseFloat(utilities.replace(/,/g, '')) || 0,
        marketing: parseFloat(marketing.replace(/,/g, '')) || 0,
        repairs: parseFloat(repairs.replace(/,/g, '')) || 0,
        otherExpenses: parseFloat(otherExpenses.replace(/,/g, '')) || 0,
        grossProfit,
        totalOperatingExpenses,
        netOperatingIncome
      };

      // Update the notes field with the financial data
      await updateField('notes', JSON.stringify({ financialData }));

      toast({
        title: 'Data Saved',
        description: 'All form data has been saved to your application.',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save your data. Please try again.',
      });
    }
  };

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
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold">Loan Application - Page 2 of 12</h1>
          <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
        </div>
        
        {/* Save Button */}
        <Button 
          onClick={saveAllData} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Progress
        </Button>
      </div>
        
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> 
            Company Profit & Loss Statement
          </CardTitle>
          <CardDescription>
            Provide the company's recent monthly financial performance. 
            Your data is automatically saved as you type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500"/>Revenue & Profit
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <PnLInput 
                label="Total Revenue / Sales" 
                value={revenue} 
                onValueChange={setRevenue} 
                placeholder="e.g., 50000"
                fieldPath="incomeInformation.businessIncome.netBusinessIncome"
                updateField={updateField}
              />
              <PnLInput 
                label="Cost of Goods Sold (COGS)" 
                value={cogs} 
                onValueChange={setCogs} 
                placeholder="e.g., 20000"
                fieldPath="incomeInformation.businessIncome.cogs"
                updateField={updateField}
              />
            </div>
            <div className="pt-4 border-t">
              <Label className="font-bold text-lg">Gross Profit</Label>
              <p className="text-2xl font-bold text-primary">
                {grossProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500"/>Operating Expenses
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PnLInput 
                label="Salaries & Wages" 
                value={salaries} 
                onValueChange={setSalaries} 
                placeholder="e.g., 10000"
                fieldPath="incomeInformation.businessIncome.salaries"
                updateField={updateField}
              />
              <PnLInput 
                label="Rent / Lease" 
                value={rent} 
                onValueChange={setRent} 
                placeholder="e.g., 5000"
                fieldPath="incomeInformation.businessIncome.rent"
                updateField={updateField}
              />
              <PnLInput 
                label="Utilities" 
                value={utilities} 
                onValueChange={setUtilities} 
                placeholder="e.g., 1000"
                fieldPath="incomeInformation.businessIncome.utilities"
                updateField={updateField}
              />
              <PnLInput 
                label="Marketing & Advertising" 
                value={marketing} 
                onValueChange={setMarketing} 
                placeholder="e.g., 2000"
                fieldPath="incomeInformation.businessIncome.marketing"
                updateField={updateField}
              />
              <PnLInput 
                label="Repairs & Maintenance" 
                value={repairs} 
                onValueChange={setRepairs} 
                placeholder="e.g., 500"
                fieldPath="incomeInformation.businessIncome.repairs"
                updateField={updateField}
              />
              <PnLInput 
                label="Other Expenses" 
                value={otherExpenses} 
                onValueChange={setOtherExpenses} 
                placeholder="e.g., 1500"
                fieldPath="incomeInformation.businessIncome.otherExpenses"
                updateField={updateField}
              />
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

          {/* Progress Indicator */}
          {applicationId && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress saved automatically</span>
                <span>Page 2 of 12</span>
              </div>
            </div>
          )}
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
