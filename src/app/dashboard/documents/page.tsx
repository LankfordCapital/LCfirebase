
'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUI } from "@/contexts/ui-context";
import { AlertCircle, HelpCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface LoanApplication {
  id: string;
  property: string;
  type: string;
  userId: string;
  createdAt: any;
}

interface Document {
  id: string;
  name: string;
  status: string;
  loanId?: string;
  userId: string;
  createdAt: any;
  note?: string | null;
}

export default function DocumentsPage() {
  const { openAssistant } = useUI();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force load after a short delay, regardless of auth state
    const timer = setTimeout(() => {
      console.log('Documents loading timeout - forcing load');
      setLoading(false);
    }, 1500); // 1.5 second timeout

    return () => clearTimeout(timer);
  }, []); // Remove user dependency to prevent re-renders

  // Demo data
  const loanApplications: LoanApplication[] = [
    {
      id: 'LL-00124',
      property: '123 Main St, Anytown, CA',
      type: 'Fix and Flip',
      userId: user?.uid || '',
      createdAt: new Date()
    },
    {
      id: 'LL-00119',
      property: '456 Oak Ave, Somecity, TX',
      type: 'DSCR',
      userId: user?.uid || '',
      createdAt: new Date()
    }
  ];

  const documents: Document[] = [
    {
      id: 'doc1',
      name: '2023 Personal Tax Returns',
      status: 'pending',
      loanId: 'LL-00124',
      userId: user?.uid || '',
      createdAt: new Date(),
      note: 'Please provide the complete, signed return including all schedules.'
    },
    {
      id: 'doc2',
      name: 'Driver\'s License',
      status: 'requested',
      loanId: 'LL-00124',
      userId: user?.uid || '',
      createdAt: new Date(),
      note: 'Ensure the image is clear and not expired.'
    },
    {
      id: 'doc3',
      name: '2023 Business Tax Returns',
      status: 'missing',
      loanId: 'LL-00119',
      userId: user?.uid || '',
      createdAt: new Date(),
      note: 'Must be the final version filed with the IRS.'
    },
    {
      id: 'doc4',
      name: 'Signed Purchase Agreement',
      status: 'pending',
      loanId: 'LL-00119',
      userId: user?.uid || '',
      createdAt: new Date(),
      note: null
    }
  ];

  // Group documents by loan application
  const getDocumentsByLoan = () => {
    const loanFiles = loanApplications.map(loan => {
      const loanDocuments = documents.filter(doc => doc.loanId === loan.id);
      const missingDocuments = loanDocuments.filter(doc => 
        doc.status === 'pending' || doc.status === 'requested' || doc.status === 'missing'
      );
      
      return {
        id: loan.id,
        property: loan.property,
        type: loan.type,
        missingDocuments: missingDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          note: doc.note
        }))
      };
    }).filter(loan => loan.missingDocuments.length > 0);

    return loanFiles;
  };

  const loanFiles = getDocumentsByLoan();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  if (loanFiles.length === 0) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Pending Actions</h2>
            <p className="text-muted-foreground mb-4">All your documents are up to date!</p>
            <Button asChild>
              <Link href="/dashboard/application">Start New Application</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
        </div>
        <Button asChild>
            <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
        </Button>
       </div>
       <div className="space-y-6">
        {loanFiles.map(loan => (
          <Card key={loan.id}>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Missing Documents for {loan.property}
                  </CardTitle>
                  <CardDescription>
                      Loan ID: {loan.id} | Type: {loan.type}
                      <br/>
                      Please upload the following documents to proceed. Notes from our team are included below each item.
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="secondary">{loan.type}</Badge>
                  </div>
              </CardHeader>
              <CardContent className="space-y-4">
                  {loan.missingDocuments.map((doc) => (
                       <div key={doc.id} className="p-3 rounded-md border bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" alt="Lankford Capital Icon" width={28} height={28} style={{ width: 'auto', height: 'auto' }} />
                                <Label htmlFor={`${loan.id}-${doc.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{doc.name}</Label>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAssistant(`I have a question about the "${doc.name}" document for my loan on ${loan.property}.`)}>
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">Ask a question about {doc.name}</span>
                            </Button>
                          </div>
                          {doc.note && (
                            <p className="mt-2 ml-11 text-xs text-muted-foreground bg-background p-2 rounded-md border">{doc.note}</p>
                          )}
                      </div>
                  ))}
                   <Button className="w-full mt-4" asChild>
                      <Link href="/dashboard/profile">Upload Documents</Link>
                  </Button>
              </CardContent>
          </Card>
        ))}
       </div>
    </div>
  )
}
