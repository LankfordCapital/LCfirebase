
'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUI } from "@/contexts/ui-context";
import { AlertCircle, HelpCircle, PlusCircle, Loader2, RefreshCw, FileText, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useBorrowerLoanActions } from '@/hooks/use-borrower-loan-actions';

export default function DocumentsPage() {
  const { openAssistant } = useUI();
  const { user } = useAuth();
  const { toast } = useToast();
  const { loans, loading, error, refreshData } = useBorrowerLoanActions();

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Refreshing",
      description: "Loading latest loan applications..."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Required</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
            <p className="text-muted-foreground">Manage required documents for your loans.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/dashboard/application">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Start New Application
              </Link>
            </Button>
          </div>
        </div>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Action Required</h2>
          <p className="text-muted-foreground mb-6">
            All your loan applications have the required documents uploaded.
          </p>
          <Button asChild>
            <Link href="/dashboard/application">
              <PlusCircle className="mr-2 h-4 w-4"/>
              Start New Application
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Loan Actions</h1>
          <p className="text-muted-foreground">
            {loans.length} loan{loans.length !== 1 ? 's' : ''} require{loans.length === 1 ? 's' : ''} document uploads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/dashboard/application">
              <PlusCircle className="mr-2 h-4 w-4"/>
              Start New Application
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {loans.map(loan => (
          <Card key={loan.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Missing Documents for {loan.propertyAddress}
              </CardTitle>
              <CardDescription>
                Loan ID: {loan.id} | Type: <Badge variant="secondary">{loan.loanType}</Badge>
                <br/>
                Status: <Badge variant={loan.status === 'Under Review' ? 'default' : 'outline'}>{loan.status}</Badge>
                <br/>
                Progress: {loan.progress}% Complete
                <br/>
                Please upload the following documents to proceed. Notes from our team are included below each item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loan.missingDocuments.map((doc) => (
                <div key={doc.id} className="p-3 rounded-md border bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4b8b71f5" 
                        alt="Lankford Capital Icon" 
                        width={28} 
                        height={28} 
                        style={{ width: 'auto', height: 'auto' }} 
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${loan.id}-${doc.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {doc.name}
                        </Label>
                        {getStatusBadge(doc.status)}
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openAssistant(`I have a question about the "${doc.name}" document for my loan on ${loan.propertyAddress}.`)}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {doc.note && (
                    <p className="mt-2 ml-11 text-xs text-muted-foreground bg-background p-2 rounded-md border">
                      {doc.note}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" asChild>
                  <Link href={`/dashboard/application/${loan.id}`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/application/${loan.id}`}>
                    View Application
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
