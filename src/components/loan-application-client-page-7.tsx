
'use-client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Calendar, DollarSign, List, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Draw = {
  id: string;
  description: string;
  amount: number;
};

export function LoanApplicationClientPage7({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const initialId = useId();
  const [draws, setDraws] = useState<Draw[]>([
    { id: initialId, description: '', amount: 0 },
  ]);

  const handleDrawChange = (id: string, field: keyof Omit<Draw, 'id'>, value: string | number) => {
    setDraws(draws.map(draw => (draw.id === id ? { ...draw, [field]: value } : draw)));
  };

  const handleAddDraw = () => {
    setDraws([...draws, { id: `draw-${Date.now()}`, description: '', amount: 0 }]);
  };

  const handleRemoveDraw = (id: string) => {
    setDraws(draws.filter(draw => draw.id !== id));
  };
  
  const calculateTotalDraws = () => {
    return draws.reduce((total, draw) => total + (Number(draw.amount) || 0), 0);
  }

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-9`);
  };

  const handleGoBack = () => {
    router.back();
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 7 of 9</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Projected Draw Schedule
                </CardTitle>
                <CardDescription>Outline the projected draw schedule for the construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {draws.map((draw, index) => (
                        <div key={draw.id} className="flex items-end gap-4 p-4 border rounded-md relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <div className="space-y-2">
                                    <Label htmlFor={`draw-desc-${draw.id}`}>Draw #{index + 1} Description</Label>
                                    <Input 
                                        id={`draw-desc-${draw.id}`} 
                                        value={draw.description} 
                                        onChange={(e) => handleDrawChange(draw.id, 'description', e.target.value)}
                                        placeholder="e.g., Foundation & Framing"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`draw-amount-${draw.id}`}>Amount</Label>
                                    <Input 
                                        id={`draw-amount-${draw.id}`} 
                                        type="number" 
                                        value={draw.amount || ''}
                                        onChange={(e) => handleDrawChange(draw.id, 'amount', Number(e.target.value))}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            {draws.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveDraw(draw.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={handleAddDraw}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Draw
                    </Button>
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total Draw Amount</p>
                        <p className="text-2xl font-bold text-primary">{calculateTotalDraws().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 6
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 8 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
