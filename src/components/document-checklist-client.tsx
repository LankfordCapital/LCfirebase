'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { aiPreUnderwriter, type AiPreUnderwriterOutput } from '@/ai/flows/ai-pre-underwriter';
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle, ListTodo, Circle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

function DocumentChecklistComponent() {
  const searchParams = useSearchParams();
  const loanProgram = searchParams.get('program') || '';

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AiPreUnderwriterOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (loanProgram) {
      setIsLoading(true);
      aiPreUnderwriter({ loanProgram, uploadedDocuments: [] })
        .then(response => {
          const initialResult: AiPreUnderwriterOutput = {
            prequalificationStatus: 'Needs Documents',
            missingDocuments: response.documentRequestList,
            potentialIssues: [],
            documentRequestList: response.documentRequestList,
          };
          setResult(initialResult);
        })
        .catch(error => {
          console.error('AI Pre-Underwriter Error:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch document list.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [loanProgram, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleAnalyzeDocuments = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Files Uploaded',
        description: 'Please upload documents to analyze.',
      });
      return;
    }

    setIsAnalyzing(true);

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
      setFiles([]); // Clear file input after successful analysis
    } catch (error) {
      console.error('AI Pre-Underwriter Error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing your documents. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
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
           title: 'Needs Documents'
        }
    }
  };
  
  const prequalProps = getPrequalificationStatusProps(result?.prequalificationStatus);

  if (!loanProgram) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-2">No Loan Program Selected</h2>
            <p className="text-muted-foreground mb-4">Please go back and select a loan program to view the checklist.</p>
            <Button asChild>
                <Link href="/dashboard/documents">Go Back</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Document Checklist</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><ListTodo className="h-5 w-5 text-primary" /> Required Documents</CardTitle>
                    <CardDescription>Upload the documents below. The AI will verify them and check them off the list.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                           <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Loading checklist...
                        </div>
                    ) : result ? (
                         <ul className="space-y-3">
                            {result.documentRequestList.map((doc, i) => {
                                const isUploaded = !result.missingDocuments.includes(doc);
                                return (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        {isUploaded ? (
                                            <Check className="h-5 w-5 text-green-600 bg-green-100 rounded-full p-0.5" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className={cn(isUploaded && "line-through text-muted-foreground")}>{doc}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">Select a loan program to see the required documents.</p>}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload & Analyze</CardTitle>
                        <CardDescription>Upload one or more files. The AI will scan them and update the checklist.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Select Files</Label>
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
                        <Button onClick={handleAnalyzeDocuments} disabled={isAnalyzing || files.length === 0}>
                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Analyze Documents
                        </Button>
                    </CardContent>
                </Card>
                
                 {result && result.prequalificationStatus !== 'Needs Documents' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold font-headline">Analysis Result</h3>
                        <Alert className={prequalProps.className}>
                        {prequalProps.icon}
                        <AlertTitle>Prequalification Status: {prequalProps.title}</AlertTitle>
                        </Alert>
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
                    </div>
                 )}
            </div>
        </div>
    </div>
  )
}

export function DocumentChecklistClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocumentChecklistComponent />
        </Suspense>
    )
}
