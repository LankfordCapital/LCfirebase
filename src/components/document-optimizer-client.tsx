'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDocumentOptimizationSuggestions, type GetDocumentOptimizationSuggestionsOutput } from '@/ai/flows/document-optimization';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DocumentOptimizerClient() {
  const [documentText, setDocumentText] = useState('');
  const [borrowerProfile, setBorrowerProfile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetDocumentOptimizationSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!documentText || !borrowerProfile) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both the document text and borrower profile.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await getDocumentOptimizationSuggestions({
        documentText,
        borrowerProfile,
      });
      setResult(response);
    } catch (error) {
      console.error('Document Optimizer Error:', error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'An error occurred while generating suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Optimization Engine</CardTitle>
        <CardDescription>Paste your document text and borrower profile to get AI-powered suggestions for improving your loan approval chances.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="documentText">Financial Document Text</Label>
            <Textarea
              id="documentText"
              placeholder="Paste the text from your financial document here..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="h-48 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="borrowerProfile">Borrower Profile</Label>
            <Textarea
              id="borrowerProfile"
              placeholder="Describe the borrower's financial history, goals, etc..."
              value={borrowerProfile}
              onChange={(e) => setBorrowerProfile(e.target.value)}
              className="h-48 resize-none"
            />
          </div>
        </div>
        
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Get Optimization Suggestions
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Optimization Results</h3>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-5 w-5 text-yellow-500" /> Recommended Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-2">
                        {result.suggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                    </ul>
                </CardContent>
            </Card>
            
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Explanation</AlertTitle>
              <AlertDescription>
                {result.explanation}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
