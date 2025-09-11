
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';
import { CustomLoader } from './ui/custom-loader';

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

interface BusinessDebtScheduleProps {
  companyId: string;
}

export function BusinessDebtSchedule({ companyId }: BusinessDebtScheduleProps) {
  const { toast } = useToast();
  const { saveDebtSchedule, loadDebtSchedule, profile } = useBorrowerProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debts, setDebts] = useState<Debt[]>([
    { id: Date.now(), creditor: '', originalBalance: '', currentBalance: '', interestRate: '', monthlyPayment: '', collateral: '' },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      debts: [],
    },
  });

  // Load debt schedule when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (companyId) {
        console.log('Component: Loading debt schedule for company:', companyId);
        setIsLoading(true);
        try {
          const debtData = await loadDebtSchedule(companyId);
          console.log('Component: Received debt data:', debtData);
          
          if (debtData && debtData.debts && debtData.debts.length > 0) {
            console.log('Component: Loaded debt schedule:', debtData);
            // Convert the loaded data to the component's format
            const loadedDebts = debtData.debts.map((debt: any, index: number) => ({
              id: Date.now() + index,
              creditor: debt.creditor || '',
              originalBalance: debt.originalBalance?.toString() || '',
              currentBalance: debt.currentBalance?.toString() || '',
              interestRate: debt.interestRate || '',
              monthlyPayment: debt.monthlyPayment?.toString() || '',
              collateral: debt.collateral || '',
            }));
            console.log('Component: Converted debts:', loadedDebts);
            setDebts(loadedDebts);
          } else {
            console.log('Component: No debt schedule found, using default');
            // Keep the default empty debt entry
          }
        } catch (error) {
          console.error('Component: Error loading debt schedule:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Component: No company ID provided');
        setIsLoading(false);
      }
    };

    loadData();
  }, [companyId, loadDebtSchedule]);

  async function onSubmit() {
    setIsSubmitting(true);
    
    try {
      console.log('Saving debt schedule for company:', companyId);
      console.log('Debts to save:', debts);
      
      // Convert debts to the format expected by the API
      const debtData = {
        debts: debts.map(debt => ({
          creditor: debt.creditor,
          originalBalance: debt.originalBalance ? parseFloat(debt.originalBalance) : 0,
          currentBalance: debt.currentBalance ? parseFloat(debt.currentBalance) : 0,
          interestRate: debt.interestRate,
          monthlyPayment: debt.monthlyPayment ? parseFloat(debt.monthlyPayment) : 0,
          collateral: debt.collateral,
        }))
      };

      console.log('Debt data to save:', debtData);
      await saveDebtSchedule(companyId, debtData);
    } catch (error) {
      console.error('Error saving debt schedule:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save debt schedule. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-center text-xl">
            Business Debt Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <CustomLoader className="h-8 w-8" />
            <span className="ml-2">Loading debt schedule...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-center text-xl">
          Business Debt Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Creditor</TableHead>
                  <TableHead className="w-[150px]">Original Balance</TableHead>
                  <TableHead className="w-[150px]">Current Balance</TableHead>
                  <TableHead className="w-[120px]">Interest Rate</TableHead>
                  <TableHead className="w-[150px]">Monthly Payment</TableHead>
                  <TableHead className="w-[200px]">Collateral</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell>
                      <Input 
                        value={debt.creditor} 
                        onChange={(e) => handleDebtChange(debt.id, 'creditor', e.target.value)}
                        placeholder="Enter creditor name"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={debt.originalBalance} 
                        onChange={(e) => handleDebtChange(debt.id, 'originalBalance', e.target.value)}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={debt.currentBalance} 
                        onChange={(e) => handleDebtChange(debt.id, 'currentBalance', e.target.value)}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={debt.interestRate} 
                        onChange={(e) => handleDebtChange(debt.id, 'interestRate', e.target.value)}
                        placeholder="0.00%"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={debt.monthlyPayment} 
                        onChange={(e) => handleDebtChange(debt.id, 'monthlyPayment', e.target.value)}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={debt.collateral} 
                        onChange={(e) => handleDebtChange(debt.id, 'collateral', e.target.value)}
                        placeholder="Enter collateral"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveDebt(debt.id)} 
                        disabled={debts.length === 1}
                        className="h-8 w-8"
                      >
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
            <Button type="button" onClick={onSubmit} disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <CustomLoader className="h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Schedule
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
