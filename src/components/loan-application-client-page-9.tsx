
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, DollarSign, FileUp, FileText, ScanLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocumentContext } from '@/contexts/document-context';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from './ui/custom-loader';
import { scanWorkSunkReport, type ScanWorkSunkReportOutput } from '@/ai/flows/work-sunk-scanner';

export function LoanApplicationClientPage9({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { documents, addDocument } = useDocumentContext();
  const { toast } = useToast();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanWorkSunkReportOutput | null>(null);

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
                <CardDescription>If any work has already been completed and paid for, please upload your Work Sunk Report. You can upload formats like PDF, Excel, or Word documents. Our AI can then scan it to extract the total amount.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
