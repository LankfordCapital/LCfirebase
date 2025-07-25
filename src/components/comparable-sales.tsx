
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Label } from './ui/label';

type Comp = {
  id: number;
  address: string;
  listPrice: string;
  soldPrice: string;
  daysOnMarket: string;
};

export function ComparableSales() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comps, setComps] = useState<Comp[]>([
    { id: Date.now(), address: '', listPrice: '', soldPrice: '', daysOnMarket: '' },
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(comps); // Using the state for submission
    setIsSubmitting(false);
    toast({
      title: 'Comparable Sales Saved!',
      description: 'The comparable sales data has been securely saved.',
    });
  }
  
  const handleCompChange = (id: number, field: keyof Omit<Comp, 'id'>, value: string) => {
    setComps(comps.map(comp => (comp.id === id ? { ...comp, [field]: value } : comp)));
  }

  const handleAddComp = () => {
    if (comps.length < 5) {
        setComps([...comps, { id: Date.now(), address: '', listPrice: '', soldPrice: '', daysOnMarket: '' }]);
    } else {
        toast({
            variant: 'destructive',
            title: 'Limit Reached',
            description: 'You can add a maximum of 5 comparable sales.',
        })
    }
  }
  
  const handleRemoveComp = (id: number) => {
    setComps(comps.filter(comp => comp.id !== id));
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-center text-xl">
          Comparable Sales
        </CardTitle>
        <CardDescription className="text-center">
            Provide at least 3-5 comparable sales if available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                {comps.map((comp, index) => (
                    <div key={comp.id} className="p-4 border rounded-md space-y-4 relative">
                        <Label className="font-semibold">Comp #{index + 1}</Label>
                        <div className="space-y-2">
                            <Label htmlFor={`address-${comp.id}`}>Property Address</Label>
                            <Input id={`address-${comp.id}`} value={comp.address} onChange={(e) => handleCompChange(comp.id, 'address', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`list-price-${comp.id}`}>List Price</Label>
                                <Input id={`list-price-${comp.id}`} type="number" value={comp.listPrice} onChange={(e) => handleCompChange(comp.id, 'listPrice', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`sold-price-${comp.id}`}>Sold Price</Label>
                                <Input id={`sold-price-${comp.id}`} type="number" value={comp.soldPrice} onChange={(e) => handleCompChange(comp.id, 'soldPrice', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`dom-${comp.id}`}>Days On Market</Label>
                                <Input id={`dom-${comp.id}`} type="number" value={comp.daysOnMarket} onChange={(e) => handleCompChange(comp.id, 'daysOnMarket', e.target.value)} />
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
                Add Comp
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Comps'}
              </Button>
            </div>
          </form>
      </CardContent>
    </Card>
  );
}
