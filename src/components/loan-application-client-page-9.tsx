

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BudgetItem = {
  cost: number;
  narrative: string;
  dateCompleted?: Date;
};

type BudgetSection = {
  [key: string]: BudgetItem;
};

const initialBudgetItem: BudgetItem = { cost: 0, narrative: '', dateCompleted: undefined };

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

export function LoanApplicationClientPage9({ loanProgram }: { loanProgram: string}) {
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

  const handleBudgetChange = (section: string, item: string, field: keyof BudgetItem, value: string | number | Date | undefined) => {
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
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-10`);
  };

  
  const BudgetInputRow = ({ section, item }: { section: string, item: string }) => (
    <div className="py-4 border-b relative">
        <div className="flex justify-between items-center">
             <Label className="font-semibold">{item}</Label>
            {!initialBudgetStructure[section]?.includes(item) && (
                <Button variant="ghost" size="icon" onClick={() => handleRemoveBudgetItem(section, item)} className="h-7 w-7">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
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
                <Label htmlFor={`${section}-${item}-date`} className="text-xs">Date Completed</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !budget[section][item].dateCompleted && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {budget[section][item].dateCompleted ? format(budget[section][item].dateCompleted as Date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={budget[section][item].dateCompleted}
                        onSelect={(date) => handleBudgetChange(section, item, 'dateCompleted', date)}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2 md:col-span-3">
                <Label htmlFor={`${section}-${item}-narrative`} className="text-xs">Narrative Description</Label>
                <Textarea 
                    id={`${section}-${item}-narrative`}
                    placeholder="Describe the work that was completed..." 
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
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 9 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Work Sunk Report</CardTitle>
                <CardDescription>Provide a detailed breakdown of any construction work that has already been completed and paid for.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={["Soft Costs", "Site Work"]} className="w-full">
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
                                <div className="pt-4">
                                     <Button variant="outline" size="sm" onClick={() => handleAddBudgetItem(section)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Line Item to {section}
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-6 pt-4 border-t">
                     <h3 className="text-lg font-semibold mb-2">Add New Section</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter new section name"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                        />
                        <Button onClick={handleAddSection}>Add Section</Button>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Total Work Sunk</h3>
                        <p className="text-2xl font-bold text-green-600 font-mono">
                            {calculateGrandTotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 8
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 10 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
