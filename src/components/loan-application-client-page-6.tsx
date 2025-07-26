
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';

type BudgetItem = {
  cost: number;
  narrative: string;
  timeToComplete: string;
};

type BudgetSection = {
  [key: string]: BudgetItem;
};

const initialBudgetItem: BudgetItem = { cost: 0, narrative: '', timeToComplete: '' };

const budgetStructure: Record<string, string[]> = {
    "Soft Costs": ["Permits & Fees", "Architectural & Engineering", "Legal & Accounting", "Contingency (Soft)"],
    "Foundation & Structure": ["Excavation & Grading", "Foundation Concrete", "Structural Steel", "Framing Labor & Materials"],
    "Exterior": ["Roofing", "Siding/Stucco/Masonry", "Windows & Doors", "Exterior Paint"],
    "Interior Systems": ["Plumbing (Rough-in & Finish)", "HVAC (Rough-in & Finish)", "Electrical (Rough-in & Finish)", "Insulation"],
    "Interior Finishes": ["Drywall & Taping", "Interior Paint", "Flooring", "Cabinetry & Countertops", "Appliances", "Fixtures (Lighting & Plumbing)"],
    "Site Work & Landscaping": ["Utilities (Sewer, Water, Gas)", "Paving & Sidewalks", "Landscaping & Irrigation", "Fencing"],
    "Amenities": ["Pool & Spa", "Outdoor Kitchen", "Decks & Patios", "Other Amenities"],
};

export function LoanApplicationClientPage6({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const [budget, setBudget] = useState<Record<string, BudgetSection>>(() => {
    const initialState: Record<string, BudgetSection> = {};
    Object.keys(budgetStructure).forEach(section => {
        initialState[section] = {};
        budgetStructure[section].forEach(item => {
            initialState[section][item] = { ...initialBudgetItem };
        });
    });
    return initialState;
  });

  const handleBudgetChange = (section: string, item: string, field: keyof BudgetItem, value: string | number) => {
    setBudget(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [item]: {
                ...prev[section][item],
                [field]: value
            }
        }
    }))
  }

  const calculateSectionTotal = (section: string) => {
    return Object.values(budget[section] || {}).reduce((total, item) => total + (Number(item.cost) || 0), 0);
  }

  const calculateGrandTotal = () => {
    return Object.keys(budget).reduce((total, section) => total + calculateSectionTotal(section), 0);
  }

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-7`);
  }
  
  const BudgetInputRow = ({ section, item }: { section: string, item: string }) => (
    <div className="py-4 border-b">
        <Label className="font-semibold">{item}</Label>
        <div className="grid md:grid-cols-3 gap-4 mt-2">
            <div className="space-y-2">
                <Label htmlFor={`${section}-${item}-cost`} className="text-xs">Cost</Label>
                <Input 
                    id={`${section}-${item}-cost`} 
                    type="number"
                    placeholder="0.00" 
                    value={budget[section][item].cost || ''}
                    onChange={(e) => handleBudgetChange(section, item, 'cost', Number(e.target.value))}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${section}-${item}-time`} className="text-xs">Time to Complete</Label>
                <Input 
                    id={`${section}-${item}-time`}
                    placeholder="e.g., 2 weeks" 
                    value={budget[section][item].timeToComplete}
                    onChange={(e) => handleBudgetChange(section, item, 'timeToComplete', e.target.value)}
                />
            </div>
             <div className="space-y-2 md:col-span-3">
                <Label htmlFor={`${section}-${item}-narrative`} className="text-xs">Narrative Description</Label>
                <Textarea 
                    id={`${section}-${item}-narrative`}
                    placeholder="Describe the scope of work for this item..." 
                    value={budget[section][item].narrative}
                    onChange={(e) => handleBudgetChange(section, item, 'narrative', e.target.value)}
                />
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 6 of 11</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Construction Budget</CardTitle>
                <CardDescription>Provide a detailed breakdown of the construction costs. This information is critical for underwriting.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={["Soft Costs"]} className="w-full">
                    {Object.entries(budgetStructure).map(([section, items]) => (
                        <AccordionItem key={section} value={section}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex justify-between w-full pr-4">
                                    <span>{section}</span>
                                    <span className="text-primary font-mono">{calculateSectionTotal(section).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-1">
                                {items.map(item => <BudgetInputRow key={item} section={section} item={item} />)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Grand Total</h3>
                        <p className="text-2xl font-bold text-green-600 font-mono">
                            {calculateGrandTotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 5
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 7 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
