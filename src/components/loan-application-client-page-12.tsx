

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

const ESignatureSection = ({ sponsorIndex }: { sponsorIndex: number }) => {
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-semibold text-lg">Sponsor #{sponsorIndex + 1} Signature</h4>
        <div className="space-y-2">
            <Label htmlFor={`signature-${sponsorIndex}`}>E-Signature</Label>
            <p className="text-sm text-muted-foreground">Please type your full legal name below. This will serve as your electronic signature.</p>
            <Input 
                id={`signature-${sponsorIndex}`} 
                placeholder="Type your full name" 
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
            />
        </div>
        <div className="flex items-start space-x-2">
            <Checkbox 
                id={`terms-${sponsorIndex}`} 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
                <label
                htmlFor={`terms-${sponsorIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                I have read and agree to the terms and disclosures.
                </label>
            </div>
        </div>
    </div>
  )
}


export function LoanApplicationClientPage12({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { toast } = useToast();
  const [numberOfSponsors, setNumberOfSponsors] = useState(1);
  
  const handleSubmitApplication = () => {
    toast({
        title: "Application Submitted!",
        description: "Thank you. Your loan application has been received.",
    });
    router.push('/dashboard');
  };
  
  const formattedLoanProgram = loanProgram
    .replace(/noo/i, 'NOO')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());


  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Final Submission</h1>
            <p className="text-muted-foreground">{formattedLoanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Disclosures & Authorization</CardTitle>
                <CardDescription>Please review the following disclosures carefully before submitting your application.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
                <p>By signing below, you certify that all information provided in this application is true and correct. You authorize Lankford Capital to verify all information provided and to obtain credit reports. You understand that making false statements can result in denial of your application and may be punishable by law.</p>
                
                <h5 className="font-semibold">Data Room and Third-Party Reports</h5>
                <p>You acknowledge and agree that Lankford Capital will create a data room for this transaction and that the sponsorship (all sponsors collectively) is responsible for the associated costs. Furthermore, you authorize Lankford Capital to order any necessary third-party reports (such as appraisals, environmental reports, etc.) required for the specific deal type. The sponsorship assumes full financial responsibility for the costs of these reports, regardless of whether the loan closes.</p>

                <h5 className="font-semibold">Fair Credit Reporting Act (FCRA) Disclosure</h5>
                <p>You have the right to know what is in your credit file. You may request and obtain all the information about you in the files of a consumer reporting agency (your "file disclosure").</p>

                <h5 className="font-semibold">Equal Credit Opportunity Act (ECOA) Notice</h5>
                <p>The Federal Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age (provided the applicant has the capacity to enter into a binding contract); because all or part of the applicant's income derives from any public assistance program; or because the applicant has in good faith exercised any right under the Consumer Credit Protection Act.</p>

            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sponsor E-Signatures</CardTitle>
                <CardDescription>Each sponsor must provide their electronic signature below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="w-full sm:w-1/2 md:w-1/3">
                    <Label htmlFor="num-sponsors">Number of Sponsors</Label>
                    <Select value={String(numberOfSponsors)} onValueChange={(value) => setNumberOfSponsors(Number(value))}>
                        <SelectTrigger id="num-sponsors">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Separator />

                {Array.from({ length: numberOfSponsors }).map((_, index) => (
                    <ESignatureSection key={index} sponsorIndex={index} />
                ))}

            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 11
            </Button>
            <Button onClick={handleSubmitApplication}>
                Submit Final Application
            </Button>
        </div>
    </div>
  );
}
