
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';
import { CustomLoader } from './ui/custom-loader';

const formSchema = z.object({
  // Assets
  cashInBank: z.string().optional(),
  savingsAccounts: z.string().optional(),
  ira: z.string().optional(),
  accountsReceivable: z.string().optional(),
  lifeInsurance: z.string().optional(),
  stocksBonds: z.string().optional(),
  realEstateDescription: z.string().optional(),
  realEstateValue: z.string().optional(),
  automobiles: z.string().optional(),
  automobilesValue: z.string().optional(),
  otherPersonalProperty: z.string().optional(),
  otherAssets: z.string().optional(),
  totalAssets: z.string().optional(),
  
  // Liabilities
  accountsPayable: z.string().optional(),
  notesPayable: z.string().optional(),
  autoLoan: z.string().optional(),
  otherLoans: z.string().optional(),
  loanOnLifeInsurance: z.string().optional(),
  mortgageOnRealEstate: z.string().optional(),
  unpaidTaxes: z.string().optional(),
  otherLiabilities: z.string().optional(),
  totalLiabilities: z.string().optional(),
  netWorth: z.string().optional(),
  
  // Income
  salary: z.string().optional(),
  netInvestmentIncome: z.string().optional(),
  realEstateIncome: z.string().optional(),
  otherIncome: z.string().optional(),
  totalAnnualIncome: z.string().optional(),
  
  // Additional Information
  contingentLiabilities: z.string().optional(),
  taxesPayable: z.string().optional(),
  stocksForeignAccounts: z.string().optional(),
});

export function PersonalFinancialStatement() {
  const { toast } = useToast();
  const { saveFinancialStatement, profile } = useBorrowerProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Assets
      cashInBank: '',
      savingsAccounts: '',
      ira: '',
      accountsReceivable: '',
      lifeInsurance: '',
      stocksBonds: '',
      realEstateDescription: '',
      realEstateValue: '',
      automobiles: '',
      automobilesValue: '',
      otherPersonalProperty: '',
      otherAssets: '',
      totalAssets: '',
      
      // Liabilities
      accountsPayable: '',
      notesPayable: '',
      autoLoan: '',
      otherLoans: '',
      loanOnLifeInsurance: '',
      mortgageOnRealEstate: '',
      unpaidTaxes: '',
      otherLiabilities: '',
      totalLiabilities: '',
      netWorth: '',
      
      // Income
      salary: '',
      netInvestmentIncome: '',
      realEstateIncome: '',
      otherIncome: '',
      totalAnnualIncome: '',
      
      // Additional Information
      contingentLiabilities: '',
      taxesPayable: '',
      stocksForeignAccounts: '',
    },
  });

  // Load existing financial statement data when profile loads
  useEffect(() => {
    if (profile?.financialStatement) {
      const financialData = profile.financialStatement;
      form.reset({
        // Assets
        cashInBank: financialData.cashInBank?.toString() || '',
        savingsAccounts: financialData.savingsAccounts?.toString() || '',
        ira: financialData.ira?.toString() || '',
        accountsReceivable: financialData.accountsReceivable?.toString() || '',
        lifeInsurance: financialData.lifeInsurance?.toString() || '',
        stocksBonds: financialData.stocksBonds?.toString() || '',
        realEstateDescription: financialData.realEstateDescription || '',
        realEstateValue: financialData.realEstateValue?.toString() || '',
        automobiles: financialData.automobiles || '',
        automobilesValue: financialData.automobilesValue?.toString() || '',
        otherPersonalProperty: financialData.otherPersonalProperty?.toString() || '',
        otherAssets: financialData.otherAssets?.toString() || '',
        totalAssets: financialData.totalAssets?.toString() || '',
        
        // Liabilities
        accountsPayable: financialData.accountsPayable?.toString() || '',
        notesPayable: financialData.notesPayable?.toString() || '',
        autoLoan: financialData.autoLoan?.toString() || '',
        otherLoans: financialData.otherLoans?.toString() || '',
        loanOnLifeInsurance: financialData.loanOnLifeInsurance?.toString() || '',
        mortgageOnRealEstate: financialData.mortgageOnRealEstate?.toString() || '',
        unpaidTaxes: financialData.unpaidTaxes?.toString() || '',
        otherLiabilities: financialData.otherLiabilities?.toString() || '',
        totalLiabilities: financialData.totalLiabilities?.toString() || '',
        netWorth: financialData.netWorth?.toString() || '',
        
        // Income
        salary: financialData.salary?.toString() || '',
        netInvestmentIncome: financialData.netInvestmentIncome?.toString() || '',
        realEstateIncome: financialData.realEstateIncome?.toString() || '',
        otherIncome: financialData.otherIncome?.toString() || '',
        totalAnnualIncome: financialData.totalAnnualIncome?.toString() || '',
        
        // Additional Information
        contingentLiabilities: financialData.contingentLiabilities || '',
        taxesPayable: financialData.taxesPayable || '',
        stocksForeignAccounts: financialData.stocksForeignAccounts || '',
      });
    }
  }, [profile?.financialStatement, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log('Form values received:', values);
      
      // Convert string values to numbers where appropriate
      const financialData = {
        // Assets
        cashInBank: values.cashInBank ? parseFloat(values.cashInBank) : undefined,
        savingsAccounts: values.savingsAccounts ? parseFloat(values.savingsAccounts) : undefined,
        ira: values.ira ? parseFloat(values.ira) : undefined,
        accountsReceivable: values.accountsReceivable ? parseFloat(values.accountsReceivable) : undefined,
        lifeInsurance: values.lifeInsurance ? parseFloat(values.lifeInsurance) : undefined,
        stocksBonds: values.stocksBonds ? parseFloat(values.stocksBonds) : undefined,
        realEstateDescription: values.realEstateDescription,
        realEstateValue: values.realEstateValue ? parseFloat(values.realEstateValue) : undefined,
        automobiles: values.automobiles,
        automobilesValue: values.automobilesValue ? parseFloat(values.automobilesValue) : undefined,
        otherPersonalProperty: values.otherPersonalProperty ? parseFloat(values.otherPersonalProperty) : undefined,
        otherAssets: values.otherAssets ? parseFloat(values.otherAssets) : undefined,
        totalAssets: values.totalAssets ? parseFloat(values.totalAssets) : undefined,
        
        // Liabilities
        accountsPayable: values.accountsPayable ? parseFloat(values.accountsPayable) : undefined,
        notesPayable: values.notesPayable ? parseFloat(values.notesPayable) : undefined,
        autoLoan: values.autoLoan ? parseFloat(values.autoLoan) : undefined,
        otherLoans: values.otherLoans ? parseFloat(values.otherLoans) : undefined,
        loanOnLifeInsurance: values.loanOnLifeInsurance ? parseFloat(values.loanOnLifeInsurance) : undefined,
        mortgageOnRealEstate: values.mortgageOnRealEstate ? parseFloat(values.mortgageOnRealEstate) : undefined,
        unpaidTaxes: values.unpaidTaxes ? parseFloat(values.unpaidTaxes) : undefined,
        otherLiabilities: values.otherLiabilities ? parseFloat(values.otherLiabilities) : undefined,
        totalLiabilities: values.totalLiabilities ? parseFloat(values.totalLiabilities) : undefined,
        netWorth: values.netWorth ? parseFloat(values.netWorth) : undefined,
        
        // Income
        salary: values.salary ? parseFloat(values.salary) : undefined,
        netInvestmentIncome: values.netInvestmentIncome ? parseFloat(values.netInvestmentIncome) : undefined,
        realEstateIncome: values.realEstateIncome ? parseFloat(values.realEstateIncome) : undefined,
        otherIncome: values.otherIncome ? parseFloat(values.otherIncome) : undefined,
        totalAnnualIncome: values.totalAnnualIncome ? parseFloat(values.totalAnnualIncome) : undefined,
        
        // Additional Information
        contingentLiabilities: values.contingentLiabilities,
        taxesPayable: values.taxesPayable,
        stocksForeignAccounts: values.stocksForeignAccounts,
        
        // Metadata
        lastUpdated: new Date().toISOString(),
      };

      console.log('Financial data to save:', financialData);
      const result = await saveFinancialStatement(financialData);
      console.log('Save result:', result);
    } catch (error) {
      console.error('Error saving financial statement:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save your financial statement. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const renderSectionHeader = (title: string) => (
     <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <Separator className="mt-2" />
      </div>
  )

  const renderInputField = (name: any, label: string, placeholder = '', isNumber = true) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-cols-2 items-center">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
              type={isNumber ? "number" : "text"} 
              className={isNumber ? "text-right" : ""} 
            />
          </FormControl>
          <FormMessage className="col-span-2" />
        </FormItem>
      )}
    />
  );
  
  const renderTextareaField = (name: any, label: string) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Textarea {...field} />
                </FormControl>
                 <FormMessage />
            </FormItem>
        )}
    />
  )

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-center text-xl">
          Lankford Capital <br /> Personal Financial Statement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['assets', 'liabilities']} className="w-full">
              <AccordionItem value="assets">
                <AccordionTrigger className="text-lg font-semibold">Assets</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {renderInputField('cashInBank', 'Cash on hand & in Banks')}
                  {renderInputField('savingsAccounts', 'Savings Accounts')}
                  {renderInputField('ira', 'IRA or Other Retirement Account')}
                  {renderInputField('accountsReceivable', 'Accounts & Notes Receivable')}
                  {renderInputField('lifeInsurance', 'Life Insurance - Cash Surrender Value', 'Do not include face value')}
                  {renderInputField('stocksBonds', 'Stocks and Bonds')}
                  {renderTextareaField('realEstateDescription', 'Real Estate (Provide address and value)')}
                  {renderInputField('realEstateValue', 'Real Estate Total Value')}
                  {renderInputField('automobiles', 'Automobile (Make and Year)', '', false)}
                  {renderInputField('automobilesValue', 'Automobile Total Value')}
                  {renderInputField('otherPersonalProperty', 'Other Personal Property')}
                  {renderInputField('otherAssets', 'Other Assets')}
                   <Separator />
                   {renderInputField('totalAssets', 'Total Assets')}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="liabilities">
                <AccordionTrigger className="text-lg font-semibold">Liabilities</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {renderInputField('accountsPayable', 'Accounts Payable')}
                  {renderInputField('notesPayable', 'Notes Payable to Banks and Others')}
                  {renderInputField('autoLoan', 'Installment Account (Auto)')}
                  {renderInputField('otherLoans', 'Installment Account (Other)')}
                  {renderInputField('loanOnLifeInsurance', 'Loan on Life Insurance')}
                  {renderInputField('mortgageOnRealEstate', 'Mortgages on Real Estate')}
                  {renderInputField('unpaidTaxes', 'Unpaid Taxes')}
                  {renderInputField('otherLiabilities', 'Other Liabilities')}
                   <Separator />
                  {renderInputField('totalLiabilities', 'Total Liabilities')}
                  <Separator />
                  {renderInputField('netWorth', 'Net Worth (Total Assets - Total Liabilities)')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="income">
                <AccordionTrigger className="text-lg font-semibold">Annual Income</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    {renderInputField('salary', 'Salary')}
                    {renderInputField('netInvestmentIncome', 'Net Investment Income')}
                    {renderInputField('realEstateIncome', 'Real Estate Income')}
                    {renderInputField('otherIncome', 'Other Income')}
                    <Separator />
                    {renderInputField('totalAnnualIncome', 'Total Annual Income')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="additionalInfo">
                <AccordionTrigger className="text-lg font-semibold">Additional Information</AccordionTrigger>
                 <AccordionContent className="space-y-4 pt-4">
                    {renderTextareaField('contingentLiabilities', 'Contingent Liabilities (e.g., as endorser, co-maker, guarantor)')}
                    {renderTextareaField('taxesPayable', 'Taxes Payable (Federal, State, and other)')}
                    {renderTextareaField('stocksForeignAccounts', 'Do you have any stocks, bonds or other securities held in a foreign country? If yes, provide details.')}
                 </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <CustomLoader className="h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save Statement'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
