'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';

const debtSchema = z.object({
  creditor: z.string().min(1, 'Creditor is required'),
  originalBalance: z.string().min(1, 'Original balance is required'),
  currentBalance: z.string().min(1, 'Current balance is required'),
  interestRate: z.string().min(1, 'Interest rate is required'),
  monthlyPayment: z.string().min(1, 'Monthly payment is required'),
  collateral: z.string().min(1, 'Collateral is required'),
});

type Debt = z.infer<typeof debtSchema> & { id: number };

const formSchema = z.object({
  debts: z.array(debtSchema),
});

export function BusinessDebtSchedule() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([
    { id: Date.now(), creditor: '', originalBalance: '', currentBalance: '', interestRate: '', monthlyPayment: '', collateral: '' },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      debts: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(debts); // Using the state for submission
    setIsSubmitting(false);
    toast({
      title: 'Debt Schedule Saved!',
      description: 'Your business debt schedule has been securely saved.',
    });
  }
  
  const handleDebtChange = (id: number, field: keyof Omit<Debt, 'id'>, value: string) => {
    setDebts(debts.map(debt => (debt.id === id ? { ...debt, [field]: value } : debt)));
  }

  const handleAddDebt = () => {
    setDebts([...debts, { id: Date.now(), creditor: '', originalBalance: '', currentBalance: '', interestRate: '', monthlyPayment: '', collateral: '' }]);
  }
  
  const handleRemoveDebt = (id: number) => {
    setDebts(debts.filter(debt => debt.id !== id));
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-center text-xl">
          Business Debt Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creditor</TableHead>
                    <TableHead>Original Balance</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Monthly Payment</TableHead>
                    <TableHead>Collateral</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt, index) => (
                    <TableRow key={debt.id}>
                      <TableCell>
                        <Input value={debt.creditor} onChange={(e) => handleDebtChange(debt.id, 'creditor', e.target.value)} />
                      </TableCell>
                       <TableCell>
                        <Input type="number" value={debt.originalBalance} onChange={(e) => handleDebtChange(debt.id, 'originalBalance', e.target.value)} />
                      </TableCell>
                       <TableCell>
                        <Input type="number" value={debt.currentBalance} onChange={(e) => handleDebtChange(debt.id, 'currentBalance', e.target.value)} />
                      </TableCell>
                       <TableCell>
                        <Input value={debt.interestRate} onChange={(e) => handleDebtChange(debt.id, 'interestRate', e.target.value)} />
                      </TableCell>
                       <TableCell>
                        <Input type="number" value={debt.monthlyPayment} onChange={(e) => handleDebtChange(debt.id, 'monthlyPayment', e.target.value)} />
                      </TableCell>
                       <TableCell>
                        <Input value={debt.collateral} onChange={(e) => handleDebtChange(debt.id, 'collateral', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDebt(debt.id)} disabled={debts.length === 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={handleAddDebt}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Debt
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
