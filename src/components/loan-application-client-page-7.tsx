
'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, DollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type Draw = {
  id: string;
  workCompleted: string;
  cost: number;
  schedule: string;
};

export function LoanApplicationClientPage7({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const initialId = useId();
  const [draws, setDraws] = useState<Draw[]>(() => [
    { id: initialId, workCompleted: '', cost: 0, schedule: '' }
  ]);
  
  const handleDrawChange = (id: string, field: keyof Omit<Draw, 'id'>, value: string | number) => {
    setDraws(draws.map(draw => (draw.id === id ? { ...draw, [field]: value } : draw)));
  };

  const handleAddDraw = () => {
    const newId = `draw-${Math.random().toString(36).substring(2, 9)}`;
    setDraws([...draws, { id: newId, workCompleted: '', cost: 0, schedule: '' }]);
  };

  const handleRemoveDraw = (id: string) => {
    setDraws(draws.filter(draw => draw.id !== id));
  };
  
  const calculateTotalDrawAmount = () => {
    return draws.reduce((total, draw) => total + (Number(draw.cost) || 0), 0);
  }

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-8`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 7 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Projected Draw Schedule
                </CardTitle>
                <CardDescription>Outline the projected draw schedule for your project. Detail the work planned, its cost, and the timeline for each draw.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {draws.map((draw, index) => (
                    <div key={draw.id} className="p-4 border rounded-md space-y-4 relative">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Draw #{index + 1}</h4>
                            {draws.length > 1 && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveDraw(draw.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`draw-cost-${draw.id}`}>Projected Draw Cost</Label>
                                <Input 
                                    id={`draw-cost-${draw.id}`} 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={draw.cost || ''}
                                    onChange={(e) => handleDrawChange(draw.id, 'cost', Number(e.target.value))}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`draw-schedule-${draw.id}`}>Projected Schedule</Label>
                                <Input 
                                    id={`draw-schedule-${draw.id}`}
                                    placeholder="e.g., Month 1" 
                                    value={draw.schedule}
                                    onChange={(e) => handleDrawChange(draw.id, 'schedule', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`draw-work-${draw.id}`}>Work to be Completed</Label>
                            <Textarea 
                                id={`draw-work-${draw.id}`}
                                placeholder="Describe the work to be completed for this draw..."
                                value={draw.workCompleted}
                                onChange={(e) => handleDrawChange(draw.id, 'workCompleted', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-start">
                     <Button variant="outline" onClick={handleAddDraw}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Another Draw
                    </Button>
                </div>
               
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Total Draw Amount</h3>
                        <p className="text-2xl font-bold text-green-600 font-mono">
                           {calculateTotalDrawAmount().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 6
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 8 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
