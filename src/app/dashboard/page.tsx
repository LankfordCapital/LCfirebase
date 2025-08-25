
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DollarSign, FileCheck, FileClock, PlusCircle, AlertCircle, Calendar, Briefcase, UserCheck, ArrowRight, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  property: string;
  type: string;
  status: string;
  progress: number;
  userId: string;
  createdAt: any;
}

interface Document {
  id: string;
  name: string;
  status: string;
  userId: string;
  createdAt: any;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug logging
    console.log('Dashboard page - User:', user);
    console.log('Dashboard page - User UID:', user?.uid);
    console.log('Dashboard page - User displayName:', user?.displayName);
    
    // Force load after a short delay, regardless of auth state
    const timer = setTimeout(() => {
      console.log('Dashboard loading timeout - forcing load');
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
      status: 'Underwriting',
      progress: 60,
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    },
    {
      id: 'LL-00119',
      property: '456 Oak Ave, Somecity, TX',
      type: 'DSCR',
      status: 'Approved',
      progress: 100,
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    }
  ];

  const documents: Document[] = [
    {
      id: 'doc1',
      name: '2023 Personal Tax Returns',
      status: 'submitted',
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    },
    {
      id: 'doc2',
      name: 'Bank Statement Q1',
      status: 'approved',
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    },
    {
      id: 'doc3',
      name: 'Signed Purchase Agreement',
      status: 'pending',
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    },
    {
      id: 'doc4',
      name: 'Driver\'s License',
      status: 'requested',
      userId: user?.uid || 'demo-user',
      createdAt: new Date()
    }
  ];

  const activeLoans = loanApplications.filter(loan => loan.status !== 'Completed' && loan.status !== 'Cancelled');
  const submittedDocuments = documents.filter(doc => doc.status === 'submitted' || doc.status === 'approved');
  const pendingDocuments = documents.filter(doc => doc.status === 'pending' || doc.status === 'requested');

  const summaryCards = [
    { 
      title: "Available Programs", 
      value: "18", 
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      cta: { href: "/dashboard/applications", text: "View All"}
    },
    { 
      title: "Active Loans", 
      value: activeLoans.length.toString(), 
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Documents Submitted", 
      value: submittedDocuments.length.toString(), 
      icon: <FileCheck className="h-4 w-4 text-muted-foreground" /> 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">User: {user ? 'Logged in' : 'Not logged in'}</p>
        </div>
      </div>
    );
  }

  // If no user, show a message
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Not Logged In</h2>
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Welcome Back, {user?.displayName || 'Borrower'}!</h1>
          <p className="text-muted-foreground">Lankford Lending Solutions</p>
        </div>
        <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Example Toast",
                  description: "This is how you display a toast notification!",
                  duration: 5000,
                });
              }}
            >
              Show Toast
            </Button>
            <Button variant="outline" asChild>
                <Link href="/dashboard/applications">View Programs</Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
            </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                     {card.cta && (
                        <Button variant="link" asChild className="p-0 text-xs">
                          <Link href={card.cta.href}>
                            {card.cta.text}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                </CardContent>
            </Card>
        ))}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Application Status</CardTitle>
                    <CardDescription>Track the progress of your active loan applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Loan ID</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loanApplications.map(loan => (
                                <TableRow key={loan.id}>
                                    <TableCell className="font-medium">{loan.id}</TableCell>
                                    <TableCell>{loan.property}</TableCell>
                                    <TableCell>{loan.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={loan.status === 'Approved' ? 'default' : 'secondary'} className={loan.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}>{loan.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                        <Progress value={loan.progress} className="w-full md:w-40" />
                                        <span className="text-xs text-muted-foreground">{loan.progress}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div id="missing-documents">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Missing Documents
                    </CardTitle>
                    <CardDescription>Please upload the following documents to proceed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingDocuments.map((doc) => (
                         <div key={doc.id} className="flex items-center space-x-2">
                            <Checkbox id={doc.id} />
                            <Label htmlFor={doc.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{doc.name}</Label>
                        </div>
                    ))}
                     <Button className="w-full mt-2" asChild>
                        <Link href="/dashboard/documents">Upload Documents</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {/* Recent activity data would be fetched here if available */}
                        <li className="flex items-start gap-4">
                            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">2 days ago</span>
                            <p className="text-sm">Document 'Bank Statement Q1' was approved.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">3 days ago</span>
                            <p className="text-sm">You uploaded 'Signed Purchase Agreement'.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">5 days ago</span>
                            <p className="text-sm">Loan officer requested 'Proof of Insurance'.</p>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div>
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Schedule an Appointment
                    </CardTitle>
                    <CardDescription>Need to talk? Book a time with one of our team members.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {/* Workforce members data would be fetched here if available */}
                   <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                               <AvatarImage src={`https://i.pravatar.cc/40?u=workforce-user-1`} />
                               <AvatarFallback>AJ</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="font-semibold">Alex Johnson</p>
                               <p className="text-xs text-muted-foreground">Senior Loan Officer</p>
                           </div>
                       </div>
                       <Button asChild variant="outline" size="sm">
                           <Link href={`/book-appointment/workforce-user-1`} target="_blank">Book Now</Link>
                       </Button>
                   </div>
                   <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                               <AvatarImage src={`https://i.pravatar.cc/40?u=workforce-user-2`} />
                               <AvatarFallback>MG</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="font-semibold">Maria Garcia</p>
                               <p className="text-xs text-muted-foreground">Underwriting Manager</p>
                           </div>
                       </div>
                       <Button asChild variant="outline" size="sm">
                           <Link href={`/book-appointment/workforce-user-2`} target="_blank">Book Now</Link>
                       </Button>
                   </div>
                   <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                               <AvatarImage src={`https://i.pravatar.cc/40?u=workforce-user-3`} />
                               <AvatarFallback>CC</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="font-semibold">Closing Coordinator</p>
                               <p className="text-xs text-muted-foreground">Workforce Member</p>
                           </div>
                       </div>
                       <Button asChild variant="outline" size="sm">
                           <Link href={`/book-appointment/workforce-user-3`} target="_blank">Book Now</Link>
                       </Button>
                   </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
