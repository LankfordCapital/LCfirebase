'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, FileUp, FileText, ScanLine, PlusCircle, Trash2, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocumentContext } from '@/contexts/document-context';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from './ui/custom-loader';
import { scanWorkSunkReport, type ScanWorkSunkReportOutput } from '@/ai/flows/work-sunk-scanner';
import { Textarea } from './ui/textarea';

type WorkSunkItem = {
  id: string;
  description: string;
  cost: string; // Keep as string for input control
  dateCompleted: string;
};

export function LoanApplicationClientPage9({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { documents, addDocument } = useDocumentContext();
  const { toast } = useToast();

  // State for AI scanner
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanWorkSunkReportOutput | null>(null);

  // State for manual entry form
  const [workSunkItems, setWorkSunkItems] = useState<WorkSunkItem[]>([
    { id: `item-${Date.now()}`, description: '', cost: '', dateCompleted: '' },
  ]);
  const [totalManualCost, setTotalManualCost] = useState(0);


  const docName = "Work Sunk Report";
  const doc = documents[docName];

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setScanResult(null); // Reset previous scan result when new file is uploaded
        await addDocument({
            name: docName,
            file,
        });
    }
  }, [addDocument, docName]);

  const handleScanReport = async () => {
    if (!doc?.dataUri) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a work sunk report to scan.',
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanWorkSunkReport({ reportDataUri: doc.dataUri });
      setScanResult(result);
      toast({
        title: 'Scan Complete',
        description: 'Work Sunk Report has been analyzed.',
      });
    } catch (error) {
      console.error('Work Sunk Scan Error:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Could not extract data from the document. Please try again.',
      });
    } finally {
      setIsScanning(false);
    }
  };
  
    const handleItemChange = (id: string, field: keyof Omit<WorkSunkItem, 'id'>, value: string) => {
        setWorkSunkItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleAddItem = () => {
        setWorkSunkItems(items => [...items, { id: `item-${Date.now()}`, description: '', cost: '', dateCompleted: '' }]);
    };

    const handleRemoveItem = (id: string) => {
        setWorkSunkItems(items => items.filter(item => item.id !== id));
    };

    const handleCalculateTotals = () => {
        const total = workSunkItems.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
        setTotalManualCost(total);
    };

  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&g/, 'and');
    router.push(`/dashboard/application/${programSlug}/page-10`);
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 9 of 12</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Work Sunk Report</CardTitle>
                <CardDescription>If any work has already been completed and paid for, you can upload your report for AI scanning OR enter the details manually below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    {doc ? (
                        <div className="flex flex-col items-center gap-2 text-green-600">
                           <FileText className="h-12 w-12" />
                           <p className="font-semibold">File Uploaded:</p>
                           <p className="text-sm text-muted-foreground">{doc.file?.name}</p>
                           <Button variant="outline" size="sm" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Change File
                                </Label>
                           </Button>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center gap-2">
                            <FileUp className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Drag and drop your file here, or click to upload.</p>
                             <Button variant="outline" asChild className="mt-2">
                                <Label htmlFor="work-sunk-upload" className="cursor-pointer">
                                    <FileUp className="mr-2 h-4 w-4" /> Select File
                                </Label>
                           </Button>
                        </div>
                    )}
                     <Input id="work-sunk-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.doc,.docx,.csv" />
                </div>
                
                <div className="flex justify-center">
                    <Button onClick={handleScanReport} disabled={isScanning || !doc}>
                        {isScanning ? <CustomLoader className="mr-2" /> : <ScanLine className="mr-2" />}
                        Scan Uploaded Report
                    </Button>
                </div>

                {scanResult && (
                    <div className="pt-4 border-t text-center">
                        <h3 className="text-lg font-semibold">Scanned Total Work Sunk</h3>
                        <p className="text-3xl font-bold text-primary mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(scanResult.totalSunkCost)}
                        </p>
                    </div>
                )}

                 <div className="mt-6 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-center">Or, Enter Details Manually</h3>
                    <div className="space-y-4">
                        {workSunkItems.map((item, index) => (
                             <div key={item.id} className="grid md:grid-cols-3 gap-4 items-start p-4 border rounded-md relative">
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor={`item-desc-${item.id}`}>Description</Label>
                                    <Textarea id={`item-desc-${item.id}`} value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="e.g., Foundation Pour"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`item-date-${item.id}`}>Date Completed</Label>
                                    <Input id={`item-date-${item.id}`} type="date" value={item.dateCompleted} onChange={(e) => handleItemChange(item.id, 'dateCompleted', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`item-cost-${item.id}`}>Cost</Label>
                                    <Input id={`item-cost-${item.id}`} type="text" value={item.cost} onChange={(e) => handleItemChange(item.id, 'cost', e.target.value)} placeholder="0.00"/>
                                </div>

                                {workSunkItems.length > 1 && (
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <Button variant="outline" onClick={handleAddItem}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>

                    <div className="mt-6 pt-4 border-t space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Manual Total Work Sunk</h3>
                                <Button onClick={handleCalculateTotals}>
                                    <Calculator className="mr-2 h-4 w-4"/>
                                    Calculate Total
                                </Button>
                            </div>
                            <p className="text-2xl font-bold text-green-600 font-mono">
                                {totalManualCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        </div>
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
