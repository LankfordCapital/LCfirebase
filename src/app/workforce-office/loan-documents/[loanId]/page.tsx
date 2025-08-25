
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomLoader } from '@/components/ui/custom-loader';
import { FileText, CheckCircle, AlertCircle, Upload, Download, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data - in a real app, this would come from a database
const mockLoans: { [key: string]: any } = {
    "LL-00125": { id: "LL-00125", borrower: "John Doe", property: "123 Main St", type: "Fix and Flip", status: "Underwriting", documents: [ { name: 'Proof of Insurance', status: 'missing' }, { name: 'Purchase Contract', status: 'uploaded' } ] },
    "LL-00126": { id: "LL-00126", borrower: "Jane Smith", property: "456 Oak Ave", type: "DSCR", status: "Approved", documents: [ { name: 'Lease Agreements', status: 'uploaded' }, { name: 'Appraisal', status: 'uploaded' } ] },
    "LL-00127": { id: "LL-00127", borrower: "Sam Wilson", property: "789 Pine Ln", type: "Ground Up", status: "Missing Docs", documents: [ { name: 'Approved Plans', status: 'missing' }, { name: "Builder's Risk Insurance", status: 'missing' }, { name: 'Purchase Contract', status: 'uploaded' } ] },
    "LL-00128": { id: "LL-00128", borrower: "Alpha Corp", property: "101 Factory Rd", type: "Industrial Rehab", status: "Initial Review", documents: [ { name: 'Business Financials (3 years)', status: 'missing' } ] },
    "LL-00129": { id: "LL-00129", borrower: "Bridge Holdings", property: "210 Commerce St", type: "Commercial Bridge", status: "Funded", documents: [ { name: 'Operating Statement', status: 'uploaded' } ] },
};

export default function LoanDocumentsPage() {
    const params = useParams();
    const router = useRouter();
    const loanId = params.loanId as string;
    const [loan, setLoan] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loanId) {
            // Simulate fetching loan data
            setTimeout(() => {
                setLoan(mockLoans[loanId] || null);
                setIsLoading(false);
            }, 500);
        }
    }, [loanId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><CustomLoader className="h-8 w-8" /></div>;
    }

    if (!loan) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">Loan Not Found</h2>
                <p className="text-muted-foreground">The requested loan could not be found.</p>
                 <Button onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/workforce-office')} className="mb-4">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Loan Summary: {loan.id}</CardTitle>
                    <CardDescription>Borrower: {loan.borrower} | Property: {loan.property}</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Badge>{loan.type}</Badge>
                    <Badge variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Docs' ? 'destructive' : 'secondary'} className="ml-2">{loan.status}</Badge>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>Review, upload, and manage all documents for this loan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loan.documents.map((doc: any, index: number) => (
                         <div key={index} className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                            <div className="flex items-center gap-3">
                                {doc.status === 'uploaded' ? <CheckCircle className="h-5 w-5 text-green-500"/> : <AlertCircle className="h-5 w-5 text-yellow-500" />}
                                <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{doc.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t">
                         <Button><Upload className="mr-2 h-4 w-4"/> Upload New Document</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

