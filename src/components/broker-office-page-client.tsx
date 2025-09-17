
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Users, DollarSign, BarChart, Calendar, Upload, MessageSquare, ArrowRight, FileText, Download, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChatClient } from "@/components/chat-client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BrokerDocument } from "@/lib/broker-document-service-admin";
import { useBrokerStats } from "@/hooks/use-broker-stats";
import { useWorkforceMembers } from "@/hooks/use-workforce-members";
import { authenticatedGet } from "@/lib/api-client";

// Pipeline data will be loaded from the database
const pipelinePreview: any[] = [];

export default function BrokerOfficePageClient() {
    const { user, userProfile } = useAuth();
    const [documents, setDocuments] = useState<BrokerDocument[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const { activeBorrowers, loansInProgress, totalFundedVolume, loading: statsLoading, error: statsError } = useBrokerStats();
    const { workforceMembers, loading: workforceLoading, error: workforceError } = useWorkforceMembers();

    // Load documents when component mounts
    useEffect(() => {
        if (user?.uid) {
            loadDocuments();
        }
    }, [user?.uid]);

    const loadDocuments = async () => {
        if (!user?.uid) return;
        
        setIsLoadingDocuments(true);
        try {
            const response = await authenticatedGet('/api/broker-documents', { brokerId: user.uid });
            const data = await response.json();
            
            if (data.success) {
                setDocuments(data.documents || []);
            } else {
                console.error('Failed to load documents:', data.error);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const getDocumentStatusIcon = (status: BrokerDocument['status']) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getDocumentStatusText = (status: BrokerDocument['status']) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Pending Review';
        }
    };

    const getDocumentByType = (type: string) => {
        return documents.find(doc => doc.type === type);
    };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || "https://placehold.co/80x80.png"} />
              <AvatarFallback>{userProfile?.fullName?.charAt(0) || 'B'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-headline text-3xl font-bold">Broker Back Office</h1>
              <p className="text-muted-foreground">{userProfile?.fullName || 'Broker Name'}</p>
            </div>
        </div>
        <Button asChild>
            <Link href="/broker-office/applications"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Borrowers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {statsLoading ? '...' : statsError ? 'Error' : activeBorrowers}
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loans in Progress</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {statsLoading ? '...' : statsError ? 'Error' : loansInProgress}
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funded Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {statsLoading ? '...' : statsError ? 'Error' : `$${(totalFundedVolume / 1000000).toFixed(1)}M`}
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Borrower Pipeline Preview</CardTitle>
                    <CardDescription>A quick look at your most recent loan applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {pipelinePreview.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pipelinePreview.map((loan) => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">{loan.borrower}</TableCell>
                                        <TableCell>{loan.property}</TableCell>
                                        <TableCell>
                                            <Badge variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Docs' ? 'destructive' : 'secondary'}
                                                className={loan.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {loan.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                            <p className="text-muted-foreground mb-4">Your loan applications will appear here once you start submitting them.</p>
                            <Button asChild>
                                <Link href="/broker-office/applications">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Start Your First Application
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                     <Button asChild variant="outline" size="sm" className="ml-auto">
                        <Link href="/broker-office/borrower-pipeline">
                            View Full Pipeline <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Broker Documents</CardTitle>
                            <CardDescription>Your compliance documents and their status.</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/broker-office/profile">
                                <Upload className="mr-2 h-4 w-4" />
                                Manage Documents
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading documents...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* W-9 Document */}
                            {(() => {
                                const w9Doc = getDocumentByType('w9');
                                return (
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">W-9 (Broker)</p>
                                                {w9Doc ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{w9Doc.fileName}</span>
                                                        {getDocumentStatusIcon(w9Doc.status)}
                                                        <span className="text-xs text-muted-foreground">{getDocumentStatusText(w9Doc.status)}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Not uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                        {w9Doc && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(w9Doc.fileUrl, '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Wiring Instructions Document */}
                            {(() => {
                                const wiringDoc = getDocumentByType('wiring_instructions');
                                return (
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">Wiring Instructions (Broker)</p>
                                                {wiringDoc ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{wiringDoc.fileName}</span>
                                                        {getDocumentStatusIcon(wiringDoc.status)}
                                                        <span className="text-xs text-muted-foreground">{getDocumentStatusText(wiringDoc.status)}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Not uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                        {wiringDoc && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(wiringDoc.fileUrl, '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* ID/Driver's License Document */}
                            {(() => {
                                const idDoc = getDocumentByType('id_license');
                                return (
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">ID/Driver's License (Broker)</p>
                                                {idDoc ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{idDoc.fileName}</span>
                                                        {getDocumentStatusIcon(idDoc.status)}
                                                        <span className="text-xs text-muted-foreground">{getDocumentStatusText(idDoc.status)}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Not uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                        {idDoc && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(idDoc.fileUrl, '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Broker Agreement Document */}
                            {(() => {
                                const agreementDoc = getDocumentByType('broker_agreement');
                                return (
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">Signed Broker Agreement</p>
                                                {agreementDoc ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{agreementDoc.fileName}</span>
                                                        {getDocumentStatusIcon(agreementDoc.status)}
                                                        <span className="text-xs text-muted-foreground">{getDocumentStatusText(agreementDoc.status)}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Not uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                        {agreementDoc && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(agreementDoc.fileUrl, '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" size="sm" className="ml-auto">
                        <Link href="/broker-office/profile">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Go to Profile
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Communications
                    </CardTitle>
                    <CardDescription>Chat directly with our team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChatClient roomId={`broker-${user?.uid}`} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Schedule an Appointment
                    </CardTitle>
                    <CardDescription>Book a time with a team member.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workforceLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading team members...</p>
                            </div>
                        </div>
                    ) : workforceError ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">Unable to load team members</p>
                        </div>
                    ) : workforceMembers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">No team members available</p>
                        </div>
                    ) : (
                        workforceMembers.map(member => (
                            <div key={member.uid} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.title}</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/book-appointment/${member.uid}`} target="_blank">Book Now</Link>
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
