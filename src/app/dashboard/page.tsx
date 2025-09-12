
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DollarSign, FileCheck, FileClock, PlusCircle, AlertCircle, Calendar, Briefcase, UserCheck, ArrowRight, FileText, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { data, loading, error, refreshData } = useDashboardData();

  // Use real data from the hook
  const { loanApplications, documents, recentActivity, workforceMembers, summary } = data;
  
  const activeLoans = loanApplications.filter(loan => 
    loan.status !== 'Completed' && loan.status !== 'Cancelled' && loan.status !== 'Draft'
  );
  const submittedDocuments = documents.filter(doc => 
    doc.status === 'submitted' || doc.status === 'approved'
  );
  const pendingDocuments = documents.filter(doc => 
    doc.status === 'pending' || doc.status === 'requested'
  );

  const summaryCards = [
    { 
      title: "Available Programs", 
      value: summary.availablePrograms.toString(), 
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      cta: { href: "/dashboard/applications", text: "View All"}
    },
    { 
      title: "Active Loans", 
      value: summary.activeLoans.toString(), 
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Documents Submitted", 
      value: summary.documentsSubmitted.toString(), 
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

  // If there's an error, show it with a refresh button
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
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
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" asChild>
                <Link href="/dashboard/applications">View Programs</Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/application">
                  <PlusCircle className="mr-2 h-4 w-4"/> Start New Application
                </Link>
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
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity) => (
                            <li key={activity.id} className="flex items-start gap-4">
                              <span className="text-xs text-muted-foreground w-24 flex-shrink-0">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                              <p className="text-sm">{activity.message}</p>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-4">
                            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">No recent activity</span>
                            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                          </li>
                        )}
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
                   {workforceMembers.map((member) => (
                     <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                               <AvatarImage src={member.avatar} />
                               <AvatarFallback>
                                 {member.name.split(' ').map(n => n[0]).join('')}
                               </AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="font-semibold">{member.name}</p>
                               <p className="text-xs text-muted-foreground">{member.title}</p>
                           </div>
                       </div>
                       <Button asChild variant="outline" size="sm" disabled={!member.isAvailable}>
                           <Link href={`/book-appointment/${member.id}`} target="_blank">
                             {member.isAvailable ? 'Book Now' : 'Unavailable'}
                           </Link>
                       </Button>
                     </div>
                   ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
