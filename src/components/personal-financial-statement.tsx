'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  // A long list of fields for the PFS form
  // For simplicity, we'll just define a few as an example
  cashInBank: z.string().optional(),
  stocksAndBonds: z.string().optional(),
  realEstate: z.string().optional(),
  // Add all other fields from the SBA form 413 here
});

export function PersonalFinancialStatement() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(values);
    setIsSubmitting(false);
    toast({
      title: 'Financial Statement Saved!',
      description: 'Your personal financial statement has been securely saved.',
    });
  }
  
  const renderSectionHeader = (title: string) => (
     <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <Separator className="mt-2" />
      </div>
  )

  const renderInputField = (name: any, label: string, placeholder = '') => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-cols-2 items-center">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type="number" className="text-right" />
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
                  {renderInputField('automobiles', 'Automobile (Make and Year)')}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Statement'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
