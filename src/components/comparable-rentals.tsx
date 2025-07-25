
'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Label } from './ui/label';

type Comp = {
  id: string;
  address: string;
  monthlyRent: string;
  sqFt: string;
  yrBuilt: string;
  distanceToSubject: string;
};

export function ComparableRentals() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialId = useId();
  const [comps, setComps] = useState<Comp[]>(() => [
    { id: initialId, address: '', monthlyRent: '', sqFt: '', yrBuilt: '', distanceToSubject: '' },
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(comps); // Using the state for submission
    setIsSubmitting(false);
    toast({
      title: 'Comparable Rentals Saved!',
      description: 'The comparable rentals data has been securely saved.',
    });
  }
  
  const handleCompChange = (id: string, field: keyof Omit<Comp, 'id'>, value: string) => {
    setComps(comps.map(comp => (comp.id === id ? { ...comp, [field]: value } : comp)));
  }

  const handleAddComp = () => {
    if (comps.length < 5) {
        setComps([...comps, { id: `comp-rental-${Date.now()}`, address: '', monthlyRent: '', sqFt: '', yrBuilt: '', distanceToSubject: '' }]);
    } else {
        toast({
            variant: 'destructive',
            title: 'Limit Reached',
            description: 'You can add a maximum of 5 comparable rentals.',
        })
    }
  }
  
  const handleRemoveComp = (id: string) => {
    setComps(comps.filter(comp => comp.id !== id));
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-center text-xl">
          Comparable Rentals
        </CardTitle>
        <CardDescription className="text-center">
            Provide at least 3-5 comparable rentals if available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                {comps.map((comp, index) => (
                    <div key={comp.id} className="p-4 border rounded-md space-y-4 relative">
                        <Label className="font-semibold">Rental Comp #{index + 1}</Label>
                        <div className="space-y-2">
                            <Label htmlFor={`rental-address-${comp.id}`}>Property Address</Label>
                            <Input id={`rental-address-${comp.id}`} value={comp.address} onChange={(e) => handleCompChange(comp.id, 'address', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`monthly-rent-${comp.id}`}>Monthly Rent</Label>
                                <Input id={`monthly-rent-${comp.id}`} type="number" value={comp.monthlyRent} onChange={(e) => handleCompChange(comp.id, 'monthlyRent', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`rental-sqFt-${comp.id}`}>Sq Ft</Label>
                                <Input id={`rental-sqFt-${comp.id}`} type="number" value={comp.sqFt} onChange={(e) => handleCompChange(comp.id, 'sqFt', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`rental-yrBuilt-${comp.id}`}>Yr Built</Label>
                                <Input id={`rental-yrBuilt-${comp.id}`} type="number" value={comp.yrBuilt} onChange={(e) => handleCompChange(comp.id, 'yrBuilt', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`rental-distance-${comp.id}`}>Distance</Label>
                                <Input id={`rental-distance-${comp.id}`} value={comp.distanceToSubject} onChange={(e) => handleCompChange(comp.id, 'distanceToSubject', e.target.value)} />
                            </div>
                        </div>
                        {comps.length > 1 && (
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveComp(comp.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={handleAddComp} disabled={comps.length >= 5}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Rental Comp
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Rental Comps'}
              </Button>
            </div>
          </form>
      </CardContent>
    </Card>
  );
}
