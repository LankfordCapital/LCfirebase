'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle, ListTodo } from 'lucide-react';
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
    if (!loanProgram || files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a loan program and upload at least one document.',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Pre-Underwriting</CardTitle>
        <CardDescription>Select a loan program and upload your documents to get an instant pre-qualification analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Loan Program</Label>
                <Select onValueChange={setLoanProgram} value={loanProgram}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a program..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Residential NOO</SelectLabel>
                            <SelectItem value="Residential NOO - Ground Up Construction">Ground Up Construction</SelectItem>
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
                <Label>Upload Documents</Label>
                <Input type="file" multiple onChange={handleFileChange} />
            </div>
        </div>
        
        {files.length > 0 && (
            <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected files:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {files.map(file => <li key={file.name}>{file.name}</li>)}
                </ul>
            </div>
        )}
        
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Analyze Documents
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Analysis Result</h3>
            <Alert className={
                result.prequalificationStatus === 'Prequalified' ? 'border-green-500' :
                result.prequalificationStatus === 'Needs Review' ? 'border-yellow-500' : 'border-red-500'
            }>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Prequalification Status: {result.prequalificationStatus}</AlertTitle>
            </Alert>
            
            <div className="grid md:grid-cols-2 gap-4">
                {result.potentialIssues.length > 0 && <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-destructive" /> Potential Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {result.potentialIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    </CardContent>
                </Card>}

                {result.missingDocuments.length > 0 && <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-yellow-600" /> Missing Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {result.missingDocuments.map((doc, i) => <li key={i}>{doc}</li>)}
                        </ul>
                    </CardContent>
                </Card>}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><ListTodo className="h-5 w-5 text-primary" /> Full Document Request List</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc list-inside text-sm space-y-1">
                        {result.documentRequestList.map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </CardContent>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
