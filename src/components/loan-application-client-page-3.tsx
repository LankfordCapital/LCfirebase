

'use client';

import { useState, useId, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOfficeContextFromUrl, getOfficeBasePath } from '@/lib/office-routing';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useLoanApplication } from '@/hooks/use-loan-application';

type Unit = {
  id: string;
  unitDescription: string;
  sqFt: string;
  projectedRent: string;
};

export function LoanApplicationClientPage3({ 
  loanProgram, 
  officeContext = 'borrower',
  applicationId 
}: { 
  loanProgram: string, 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string 
}) {
  const router = useRouter();
  
  // Use the loan application hook for auto-save functionality
  const { 
    application, 
    loading, 
    saving, 
    updateField, 
    updateFields 
  } = useLoanApplication(applicationId);
  
  const initialId = useId();
  const [units, setUnits] = useState<Unit[]>(() => [
    { id: initialId, unitDescription: '', sqFt: '', projectedRent: '' },
  ]);
  
  // Load saved data when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId && application && application.propertyInfo?.units) {
      setUnits(application.propertyInfo.units);
    }
  }, [applicationId, application]);
  
  const handleUnitChange = (id: string, field: keyof Omit<Unit, 'id'>, value: string) => {
    const updatedUnits = units.map(unit => (unit.id === id ? { ...unit, [field]: value } : unit));
    setUnits(updatedUnits);
    
    // Auto-save to database
    if (applicationId) {
      updateField('propertyInfo.units', updatedUnits);
    }
  }

  const handleAddUnit = () => {
    const newUnits = [...units, { id: `unit-${Date.now()}`, unitDescription: '', sqFt: '', projectedRent: '' }];
    setUnits(newUnits);
    
    // Auto-save to database
    if (applicationId) {
      updateField('propertyInfo.units', newUnits);
    }
  }
  
  const handleRemoveUnit = (id: string) => {
    const newUnits = units.filter(unit => unit.id !== id);
    setUnits(newUnits);
    
    // Auto-save to database
    if (applicationId) {
      updateField('propertyInfo.units', newUnits);
    }
  }

  const handleContinue = async () => {
    if (applicationId) {
      try {
        // Save all form data to database immediately before navigation
        await updateFields({
          'propertyInfo.units': units
        }, true); // Set immediate flag to true for immediate saving

        console.log('Unit information saved successfully');
      } catch (error) {
        console.error('Error saving data:', error);
        return; // Don't navigate if save fails
      }
    }

    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    const urlParams = new URLSearchParams(window.location.search);
    const paramString = urlParams.toString();
    
    // Get the current office context from the URL
    const currentOfficeContext = getOfficeContextFromUrl();
    const basePath = getOfficeBasePath(currentOfficeContext);
    
    router.push(`${basePath}/${programSlug}/page-4${paramString ? `?${paramString}` : ''}`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 12</h1>
            <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary"/> Unit Mix & Projected Rents</CardTitle>
                <CardDescription>Provide a breakdown of the units in the subject property.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {units.map((unit, index) => (
                         <div key={unit.id} className="p-4 border rounded-md space-y-4 relative">
                            <Label className="font-semibold">Unit Type #{index + 1}</Label>
                             {units.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveUnit(unit.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`unit-desc-${unit.id}`}>Description (e.g., 2 BR / 1 BA)</Label>
                                    <Input id={`unit-desc-${unit.id}`} value={unit.unitDescription} onChange={(e) => handleUnitChange(unit.id, 'unitDescription', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`unit-sqft-${unit.id}`}>Square Feet</Label>
                                    <Input id={`unit-sqft-${unit.id}`} type="number" value={unit.sqFt} onChange={(e) => handleUnitChange(unit.id, 'sqFt', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`unit-rent-${unit.id}`}>Projected Rent</Label>
                                    <Input id={`unit-rent-${unit.id}`} type="number" value={unit.projectedRent} onChange={(e) => handleUnitChange(unit.id, 'projectedRent', e.target.value)} />
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
                 <div className="flex justify-start mt-6">
                    <Button type="button" variant="outline" onClick={handleAddUnit}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Unit Type
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 2
            </Button>
            <Button onClick={handleContinue}>
                Continue to Page 4 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
