

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOfficeContextFromUrl, getOfficeBasePath, getOfficeReturnPath } from '@/lib/office-routing';
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


export function LoanApplicationClientPage12({ loanProgram, officeContext = 'borrower' }: { loanProgram: string, officeContext?: 'borrower' | 'broker' | 'workforce' }) {
  const router = useRouter();
  const { toast } = useToast();
  const [numberOfSponsors, setNumberOfSponsors] = useState(1);
  
  const handleSubmitApplication = async () => {
    try {
      // Get both borrowerId and applicationId from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const borrowerId = urlParams.get('borrowerId');
      const applicationId = urlParams.get('applicationId');
      
      if (!borrowerId && !applicationId) {
        // Try to get borrower info from sessionStorage as fallback
        const storedBorrowerId = sessionStorage.getItem('currentBorrowerId');
        const storedBorrowerInfo = sessionStorage.getItem('currentBorrowerInfo');
        
        if (storedBorrowerId) {
          // Use stored borrower ID
          const createResponse = await fetch('/api/enhanced-loan-applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'create',
              userId: storedBorrowerId,
              brokerId: storedBorrowerId, // Use same ID as broker for now
              loanProgram: loanProgram
            }),
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.error || 'Failed to create application');
          }

          const createResult = await createResponse.json();
          if (!createResult.success) {
            throw new Error(createResult.error || 'Failed to create application');
          }
          
          // Submit the application
          const response = await fetch('/api/enhanced-loan-applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'submit',
              applicationId: createResult.data.applicationId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit application');
          }

          const submitResult = await response.json();
          if (!submitResult.success) {
            throw new Error(submitResult.error || 'Failed to submit application');
          }

          toast({
            title: "Application Submitted!",
            description: "Thank you. Your loan application has been received and is under review.",
          });
          
          // Route back to the correct office context
          const currentOfficeContext = getOfficeContextFromUrl();
          const returnPath = getOfficeReturnPath(currentOfficeContext);
          router.push(returnPath);
          return;
        }
        
        // If no borrower ID but we have borrower info, create a new borrower first
        if (storedBorrowerInfo) {
          try {
            const borrowerData = JSON.parse(storedBorrowerInfo);
            
            // Create borrower first
            const borrowerResponse = await fetch('/api/borrowers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fullName: borrowerData.name,
                email: borrowerData.email,
                phoneNumber: borrowerData.phone,
                companyName: borrowerData.company,
                propertyAddress: '',
                createdBy: 'broker'
              }),
            });

            if (!borrowerResponse.ok) {
              const errorData = await borrowerResponse.json();
              throw new Error(errorData.error || 'Failed to create borrower');
            }

            const borrowerResult = await borrowerResponse.json();
            
            // Now create and submit the application
            const createResponse = await fetch('/api/enhanced-loan-applications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'create',
                userId: borrowerResult.borrowerId,
                brokerId: borrowerResult.borrowerId, // Use same ID as broker for now
                loanProgram: loanProgram
              }),
            });

            if (!createResponse.ok) {
              const errorData = await createResponse.json();
              throw new Error(errorData.error || 'Failed to create application');
            }

            const createResult = await createResponse.json();
            if (!createResult.success) {
              throw new Error(createResult.error || 'Failed to create application');
            }
            
            // Submit the application
            const response = await fetch('/api/enhanced-loan-applications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'submit',
                applicationId: createResult.data.applicationId
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to submit application');
            }

            const submitResult = await response.json();
            if (!submitResult.success) {
              throw new Error(submitResult.error || 'Failed to submit application');
            }

            toast({
              title: "Application Submitted!",
              description: "Thank you. Your loan application has been received and is under review.",
            });
            
            // Route back to the correct office context
            const currentOfficeContext = getOfficeContextFromUrl();
            const returnPath = getOfficeReturnPath(currentOfficeContext);
            router.push(returnPath);
            return;
          } catch (error) {
            console.error('Error creating borrower and application:', error);
            toast({
              variant: 'destructive',
              title: "Submission Failed",
              description: "There was an error creating the borrower and application. Please try again.",
            });
            return;
          }
        }
        
        toast({
          variant: 'destructive',
          title: "Error",
          description: "No borrower or application information found. Please restart the application.",
        });
        return;
      }

      // If we have an applicationId, submit it; otherwise create a new application and submit
      let finalApplicationId = applicationId;
      
      if (!applicationId && borrowerId) {
        // Create a new loan application first
        const createResponse = await fetch('/api/enhanced-loan-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create',
            userId: borrowerId,
            brokerId: borrowerId, // Use same ID as broker for now
            loanProgram: loanProgram
          }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.error || 'Failed to create application');
        }

        const createResult = await createResponse.json();
        if (!createResult.success) {
          throw new Error(createResult.error || 'Failed to create application');
        }
        finalApplicationId = createResult.data.applicationId;
      }

      if (!finalApplicationId) {
        throw new Error('Could not determine application ID');
      }

      // Submit the loan application
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit',
          applicationId: finalApplicationId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const submitResult = await response.json();
      if (!submitResult.success) {
        throw new Error(submitResult.error || 'Failed to submit application');
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you. Your loan application has been received and is under review.",
      });
      
      // Route back to the correct office context
      const currentOfficeContext = getOfficeContextFromUrl();
      const returnPath = getOfficeReturnPath(currentOfficeContext);
      router.push(returnPath);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
      });
    }
  };
  
  const formattedLoanProgram = loanProgram
    .replace(/noo/i, 'NOO')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Dscr/g, 'DSCR');


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
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 10
            </Button>
            <Button onClick={handleSubmitApplication}>
                Submit Final Application
            </Button>
        </div>
    </div>
  );
}
