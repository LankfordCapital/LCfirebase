
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type BudgetItem = {
  cost: string; 
  narrative: string;
};

type BudgetSection = {
  [key: string]: BudgetItem;
};

const initialBudgetItem: BudgetItem = { cost: '', narrative: '' };

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

// Isolated sub-component to manage its own state and prevent re-render issues.
const BudgetInputRow = ({ 
    item, 
    section, 
    initialCost,
    initialNarrative,
    handleBudgetChange, 
    handleRemoveBudgetItem 
}: { 
    item: string, 
    section: string, 
    initialCost: string,
    initialNarrative: string,
    handleBudgetChange: (section: string, item: string, field: keyof BudgetItem, value: string) => void, 
    handleRemoveBudgetItem: (section: string, item: string) => void 
}) => {
    const [cost, setCost] = useState(initialCost);
    const [narrative, setNarrative] = useState(initialNarrative);

    // Sync state if initial props change
    useEffect(() => {
        setCost(initialCost);
    }, [initialCost]);

    useEffect(() => {
        setNarrative(initialNarrative);
    }, [initialNarrative]);

    return (
        <div className="py-2 border-b grid md:grid-cols-3 gap-4 items-start relative">
            <Label className="font-semibold md:col-span-1 pt-2">{item}</Label>
            <div className="space-y-2 md:col-span-1">
                <Input 
                    type="text"
                    placeholder="Cost" 
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    onBlur={() => handleBudgetChange(section, item, 'cost', cost)}
                />
            </div>
            <div className="space-y-2 md:col-span-1">
                <Textarea 
                    placeholder="Narrative..." 
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    onBlur={() => handleBudgetChange(section, item, 'narrative', narrative)}
                    rows={1}
                />
            </div>
            {!initialBudgetStructure[section]?.includes(item) && (
                <Button variant="ghost" size="icon" onClick={() => handleRemoveBudgetItem(section, item)} className="absolute top-0 right-0 h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
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

  const handleBudgetChange = (section: string, item: string, field: keyof BudgetItem, value: string) => {
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
    const newItemName = `Custom Item ${Object.keys(budget[section] || {}).length + 1}`;
    setBudget(prev => {
        const newSection = prev[section] ? {...prev[section]} : {};
        newSection[newItemName] = { ...initialBudgetItem };
        return {
            ...prev,
            [section]: newSection,
        };
    });
  }
  
  const handleRemoveBudgetItem = (section: string, item: string) => {
    setBudget(prev => {
        const newSection = { ...prev[section] };
        delete newSection[item];
        return { ...prev, [section]: newSection };
    });
  }

  const handleAddSection = () => {
    if (newSectionName && !budgetStructure[newSectionName]) {
        setBudgetStructure(prev => ({...prev, [newSectionName]: [] }));
        setBudget(prev => ({...prev, [newSectionName]: {} }));
        setNewSectionName('');
    }
  }


  const calculateSectionTotal = (section: string) => {
    return Object.values(budget[section] || {}).reduce((total, item) => total + (Number(item.cost.replace(/[^0-9.-]+/g,"")) || 0), 0);
  }

  const calculateGrandTotal = () => {
    return Object.keys(budget).reduce((total, section) => total + calculateSectionTotal(section), 0);
  }

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-7`);
  };

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
                                {Object.keys(budget[section] || {}).map(item => (
                                    <BudgetInputRow 
                                        key={item} 
                                        item={item} 
                                        section={section} 
                                        initialCost={budget[section][item].cost}
                                        initialNarrative={budget[section][item].narrative}
                                        handleBudgetChange={handleBudgetChange} 
                                        handleRemoveBudgetItem={handleRemoveBudgetItem} 
                                    />
                                ))}
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
