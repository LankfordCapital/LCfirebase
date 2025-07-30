
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, PlusCircle, Trash2, Calendar as CalendarIcon, Calculator } from 'lucide-react';
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
  cost: string;
  narrative: string;
  dateCompleted?: Date;
};

type BudgetSection = {
  [key: string]: BudgetItem;
};

const initialBudgetItem: BudgetItem = { cost: '', narrative: '', dateCompleted: undefined };

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
  
  const [totals, setTotals] = useState<{ grandTotal: number; sectionTotals: Record<string, number> }>({
    grandTotal: 0,
    sectionTotals: {},
  });
  
  const [newSectionName, setNewSectionName] = useState('');

  const handleBudgetChange = (section: string, item: string, field: keyof BudgetItem, value: string | Date | undefined) => {
    setBudget(prev => {
        const newBudget = { ...prev };
        if (!newBudget[section]) newBudget[section] = {};
        if (!newBudget[section][item]) newBudget[section][item] = { cost: '', narrative: '' };
        (newBudget[section][item] as any)[field] = value;
        return newBudget;
    });
  }
  
  const handleAddBudgetItem = (section: string) => {
    const newItemName = `Custom Item ${Object.keys(budget[section] || {}).length + 1}`;
     setBudget(prev => {
        const newSectionItems = prev[section] ? {...prev[section]} : {};
        newSectionItems[newItemName] = { ...initialBudgetItem };
        return {
            ...prev,
            [section]: newSectionItems,
        };
    });
  }
  
  const handleRemoveBudgetItem = (section: string, item: string) => {
    setBudget(prev => {
        const newSectionItems = { ...prev[section] };
        delete newSectionItems[item];
        return { ...prev, [section]: newSectionItems };
    });
  }

  const handleAddSection = () => {
    if (newSectionName && !budgetStructure[newSectionName]) {
        setBudgetStructure(prev => ({...prev, [newSectionName]: [] }));
        setBudget(prev => ({...prev, [newSectionName]: {} }));
        setNewSectionName('');
    }
  }

  const handleCalculateTotals = () => {
    let grandTotal = 0;
    const sectionTotals: Record<string, number> = {};

    for (const section in budget) {
      let sectionTotal = 0;
      for (const item in budget[section]) {
        const cost = parseFloat(budget[section][item].cost.replace(/[^0-9.-]+/g,"")) || 0;
        sectionTotal += cost;
      }
      sectionTotals[section] = sectionTotal;
      grandTotal += sectionTotal;
    }
    
    setTotals({ grandTotal, sectionTotals });
  };


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
                    type="text"
                    placeholder="0.00" 
                    value={budget[section][item].cost || ''}
                    onChange={(e) => handleBudgetChange(section, item, 'cost', e.target.value)}
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
                                    <span className="text-primary font-mono">{totals.sectionTotals[section]?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-1">
                                {Object.keys(budget[section] || {}).map(item => <BudgetInputRow key={item} section={section} item={item} />)}
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
                 <div className="mt-6 pt-4 border-t space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Total Work Sunk</h3>
                             <Button onClick={handleCalculateTotals}>
                                <Calculator className="mr-2 h-4 w-4"/>
                                Calculate Total
                            </Button>
                        </div>
                        <p className="text-2xl font-bold text-green-600 font-mono">
                            {totals.grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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
