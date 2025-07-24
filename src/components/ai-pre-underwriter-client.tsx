
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export function AIPReUnderwriterClient() {
  const [loanProgram, setLoanProgram] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiPreUnderwriterOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!loanProgram) {
       toast({
        variant: 'destructive',
        title: 'Missing Loan Program',
        description: 'Please select a loan program to continue.',
      });
      return;
    }
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Files Uploaded',
        description: 'Please upload documents to begin the pre-underwriting process.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
        const uploadedDocuments = await Promise.all(
            files.map(async (file) => ({
              filename: file.name,
              dataUri: await fileToDataUri(file),
            }))
        );

      const response = await aiPreUnderwriter({
        loanProgram,
        uploadedDocuments
      });
      setResult(response);
    } catch (error) {
      console.error('AI Pre-Underwriter Error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing your documents. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPrequalificationStatusProps = (status: string | undefined) => {
    switch (status) {
      case 'Prequalified':
        return {
          className: 'border-green-500 bg-green-500/10',
          icon: <CheckCircle className="h-4 w-4 text-green-700" />,
          title: 'Prequalified',
        };
      case 'Needs Review':
        return {
          className: 'border-yellow-500 bg-yellow-500/10',
          icon: <AlertTriangle className="h-4 w-4 text-yellow-700" />,
          title: 'Needs Review',
        };
      case 'Not Prequalified':
        return {
          className: 'border-red-500 bg-red-500/10',
          icon: <AlertTriangle className="h-4 w-4 text-red-700" />,
          title: 'Not Prequalified',
        };
      default:
        return {
           className: 'border-blue-500 bg-blue-500/10',
           icon: <FileText className="h-4 w-4 text-blue-700" />,
           title: 'Status Unknown'
        }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Pre-Underwriter</CardTitle>
        <CardDescription>Select a loan program and upload your documents. Our AI will perform a preliminary analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Loan Program</Label>
            <Select onValueChange={setLoanProgram} value={loanProgram}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a program..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Residential NOO</SelectLabel>
                        <SelectItem value="Residential NOO - Fix and Flip">Fix and Flip</SelectItem>
                        <SelectItem value="Residential NOO - DSCR">DSCR Loan</SelectItem>
                        <SelectItem value="Residential NOO - Bridge">Bridge Loan</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                          <SelectLabel>Commercial</SelectLabel>
                        <SelectItem value="Commercial - Ground Up Construction">Ground Up Construction</SelectItem>
                        <SelectItem value="Commercial - Rehab Loans">Rehab Loans</SelectItem>
                        <SelectItem value="Commercial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                        <SelectItem value="Commercial - Conventional Long Term Debt">Conventional Long Term Debt</SelectItem>
                    </SelectGroup>
                      <SelectGroup>
                          <SelectLabel>Industrial</SelectLabel>
                        <SelectItem value="Industrial - Ground Up Construction">Ground Up Construction</SelectItem>
                        <SelectItem value="Industrial - Rehab & Expansion">Rehab & Expansion</SelectItem>
                          <SelectItem value="Industrial - Acquisition & Bridge">Acquisition & Bridge</SelectItem>
                        <SelectItem value="Industrial - Long Term Debt">Long Term Debt</SelectItem>
                    </SelectGroup>
                      <SelectGroup>
                          <SelectLabel>Other</SelectLabel>
                        <SelectItem value="SBA 7(a)">SBA 7(a)</SelectItem>
                        <SelectItem value="SBA 504">SBA 504</SelectItem>
                        <SelectItem value="Land Acquisition">Land Acquisition</SelectItem>
                          <SelectItem value="Mezzanine Loans">Mezzanine Loans</SelectItem>
                          <SelectItem value="Mobilization Funding">Mobilization Funding</SelectItem>
                          <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Documents</Label>
            <Input id="file-upload" type="file" multiple onChange={handleFileChange} />
        </div>
        
        {files.length > 0 && (
            <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected files:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {files.map(file => <li key={file.name}>{file.name}</li>)}
                </ul>
            </div>
        )}

        <Button onClick={handleSubmit} disabled={isLoading || !loanProgram || files.length === 0}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Upload and Analyze
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Analysis Results</h3>
            
            <Alert className={getPrequalificationStatusProps(result.prequalificationStatus).className}>
              {getPrequalificationStatusProps(result.prequalificationStatus).icon}
              <AlertTitle>Prequalification Status: {getPrequalificationStatusProps(result.prequalificationStatus).title}</AlertTitle>
            </Alert>
            
            {result.missingDocuments && (result.missingDocuments.borrower.length > 0 || result.missingDocuments.company.length > 0 || result.missingDocuments.subjectProperty.length > 0) && <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-primary" /> Missing Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {[...result.missingDocuments.borrower, ...result.missingDocuments.company, ...result.missingDocuments.subjectProperty].map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </CardContent>
            </Card>}

            {result.potentialIssues && result.potentialIssues.length > 0 && <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-destructive" /> Potential Issues</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {result.potentialIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                </CardContent>
            </Card>}

            {result.documentRequestList && (result.documentRequestList.borrower.length > 0 || result.documentRequestList.company.length > 0 || result.documentRequestList.subjectProperty.length > 0) && <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-primary" /> Full Document Request List</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc list-inside text-sm space-y-1">
                        {[...result.documentRequestList.borrower, ...result.documentRequestList.company, ...result.documentRequestList.subjectProperty].map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </CardContent>
            </Card>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
