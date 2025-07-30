
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type BudgetItem = {
  cost: number;
  narrative: string;
};

type BudgetSection = {
  [key: string]: BudgetItem;
};

const initialBudgetItem: BudgetItem = { cost: 0, narrative: '' };

const initialBudgetStructure: Record<string, string[]> = {
    "Soft Costs": ["Permits & Fees", "Architectural & Engineering", "Legal & Accounting", "Developer Fees", "Contingency (Soft)"],
    "Site Work": ["Demolition", "Excavation & Grading", "Utilities (Sewer, Water, Gas)", "Paving & Sidewalks", "Landscaping & Irrigation", "Fencing"],
    "Foundation & Structure": ["Foundation Concrete", "Structural Steel / Rebar", "Framing Labor & Materials", "Sheathing"],
    "Exterior": ["Roofing", "Siding/Stucco/Masonry", "Windows & Doors", "Exterior Paint", "Gutters & Downspouts"],
    "Interior Systems": ["Plumbing (Rough-in & Finish)", "HVAC (Rough-in & Finish)", "Electrical (Rough-in & Finish)", "Low Voltage (Security, AV)", "Fire Sprinklers", "Insulation"],
    "Interior Finishes": ["Drywall & Taping", "Interior Paint", "Flooring (Tile, Wood, Carpet)", "Cabinetry & Countertops", "Interior Doors & Trim", "Appliances", "Fixtures (Lighting & Plumbing)"],
    "Amenities": ["Pool & Spa", "Outdoor Kitchen", "Decks & Patios", "Hardscaping", "Other Amenities"],
    "Project Management": ["Supervision", "General Conditions", "Contingency (Hard)", "Final Cleanup"],
};

export function LoanApplicationClientPage6({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();

  const [budgetStructure, setBudgetStructure] = useState(initialBudgetStructure);
  const [budget, setBudget] = useState<Record<string, BudgetSection>>(() => {
    const initialState: Record<string, BudgetSection> = {};
    Object.keys(initialBudgetStructure).forEach(section => {
        initialState[section] = {};
        initialBudgetStructure[section].forEach(item => {
            initialState[section][item] = { ...initialBudgetItem };
        });
    });
    return initialState;
  });
  
  const [newSectionName, setNewSectionName] = useState('');

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
  
  const handleAddBudgetItem = (section: string) => {
    const newItemName = `Custom Item ${Object.keys(budget[section]).length + 1}`;
    setBudget(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [newItemName]: { ...initialBudgetItem }
        }
    }))
  }
  
  const handleRemoveBudgetItem = (section: string, item: string) => {
    const newSection = { ...budget[section] };
    delete newSection[item];
    setBudget(prev => ({ ...prev, [section]: newSection }));
  }

  const handleAddSection = () => {
    if (newSectionName && !budgetStructure[newSectionName]) {
        setBudgetStructure(prev => ({...prev, [newSectionName]: [] }));
        setBudget(prev => ({...prev, [newSectionName]: {} }));
        setNewSectionName('');
    }
  }


  const calculateSectionTotal = (section: string) => {
    return Object.values(budget[section] || {}).reduce((total, item) => total + (Number(item.cost) || 0), 0);
  }

  const calculateGrandTotal = () => {
    return Object.keys(budget).reduce((total, section) => total + calculateSectionTotal(section), 0);
  }

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-7`);
  };

  
  const BudgetInputRow = ({ section, item }: { section: string, item: string }) => (
    <div className="py-2 border-b grid md:grid-cols-3 gap-4 items-start">
        <Label className="font-semibold md:col-span-1 pt-2">{item}</Label>
        <div className="space-y-2 md:col-span-1">
            <Input 
                id={`${section}-${item}-cost`} 
                type="text"
                placeholder="Cost" 
                value={budget[section][item].cost || ''}
                onChange={(e) => handleBudgetChange(section, item, 'cost', Number(e.target.value))}
            />
        </div>
        <div className="space-y-2 md:col-span-1">
            <Textarea 
                id={`${section}-${item}-narrative`}
                placeholder="Narrative..." 
                value={budget[section][item].narrative}
                onChange={(e) => handleBudgetChange(section, item, 'narrative', e.target.value)}
                rows={1}
            />
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 6 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Construction Budget</CardTitle>
                <CardDescription>Provide a detailed breakdown of the construction budget.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={["Soft Costs"]} className="w-full">
                    {Object.keys(budgetStructure).map((section) => (
                        <AccordionItem key={section} value={section}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex justify-between w-full pr-4">
                                    <span>{section}</span>
                                    <span className="text-primary font-mono">{calculateSectionTotal(section).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-1">
                                {Object.keys(budget[section]).map(item => <BudgetInputRow key={item} section={section} item={item} />)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Total Budget</h3>
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
