
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, BarChart, DollarSign, MoreHorizontal, FileWarning, Search, Briefcase, UserPlus, Home, Mail, Phone, ArrowRight, Percent, Construction, MessageSquare, RefreshCw, FileText, ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle, Eye, Download, Maximize2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useWorkforceData } from "@/hooks/use-workforce-data";
import { authenticatedGet, authenticatedPost, getAuthToken } from "@/lib/api-client";



function InviteUserDialog() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('borrower');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendInvite = async () => {
        if (!name.trim() || !email.trim()) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Please fill in all required fields.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/user-invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: name.trim(),
                    email: email.trim(),
                    role,
                    invitedBy: 'Workforce Team', // You could get this from auth context
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: "Invite Sent!",
                    description: `An invitation has been sent to ${name} at ${email} as a ${role}.`,
                });
                // Reset form
                setName('');
                setEmail('');
                setRole('borrower');
            } else {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: result.error || 'Failed to send invitation.',
                });
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: 'Failed to send invitation. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
         <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Invite User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>Send an invitation link for a new user to join the platform.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="borrower">Borrower</SelectItem>
                                <SelectItem value="broker">Broker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button onClick={handleSendInvite} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Invite'
                            )}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function WorkforceOfficePage() {
    const { data, loading, error, refreshData } = useWorkforceData();
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [selectedBroker, setSelectedBroker] = useState<any>(null);
    const [brokerDocuments, setBrokerDocuments] = useState<any[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [approvalAction, setApprovalAction] = useState<'approve' | 'deny' | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [isViewingDocument, setIsViewingDocument] = useState(false);

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount.toLocaleString()}`;
    };

    const loadBrokerDocuments = async (brokerId: string) => {
        setIsLoadingDocuments(true);
        console.log('Loading documents for broker:', brokerId);
        try {
            const response = await authenticatedGet('/api/workforce/broker-documents', { brokerId });
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result.success && Array.isArray(result.documents)) {
                console.log('Documents loaded:', result.documents.length);
                setBrokerDocuments(result.documents);
            } else {
                console.error('Failed to load documents:', result.error);
                setBrokerDocuments([]);
            }
        } catch (error) {
            console.error('Error loading broker documents:', error);
            setBrokerDocuments([]);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const handleDocumentApproval = async (documentIds: string[], action: 'approve' | 'deny') => {
        try {
            // Convert action to the correct status values
            const status = action === 'approve' ? 'approved' : 'rejected';
            const response = await authenticatedPost('/api/workforce/broker-documents', {
                documentIds,
                status: status,
                notes: `${action === 'approve' ? 'Approved' : 'Rejected'} by workforce`
            });

            const result = await response.json();
            
            if (result.success) {
                // Refresh the data to show updated document counts
                await refreshData();
                // Reload broker documents if a broker is selected
                if (selectedBroker) {
                    await loadBrokerDocuments(selectedBroker.id);
                }
                setApprovalAction(null);
                // Close document viewer if viewing the document that was just approved/denied
                if (selectedDocument && documentIds.includes(selectedDocument.id)) {
                    setIsViewingDocument(false);
                    setSelectedDocument(null);
                }
            } else {
                console.error('Failed to update document status:', result.error);
            }
        } catch (error) {
            console.error('Error updating document status:', error);
        }
    };

    const handleViewDocument = (document: any) => {
        setSelectedDocument(document);
        setIsViewingDocument(true);
    };

    const handleDownloadDocument = async (documentFile: any) => {
        try {
            if (typeof window === 'undefined') {
                console.log('Download URL:', documentFile.fileUrl);
                return;
            }

            console.log('Downloading document:', {
                id: documentFile.id,
                fileName: documentFile.fileName,
                fileUrl: documentFile.fileUrl
            });

            // Use server endpoint to bypass CORS issues
            const downloadUrl = `/api/workforce/download-document?documentId=${documentFile.id}`;
            
            // Use fetch to get the file as a blob to ensure proper binary handling
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status} ${response.statusText}`);
            }

            // Get the file as a blob
            const blob = await response.blob();
            console.log('Downloaded blob:', {
                size: blob.size,
                type: blob.type
            });

            // Create object URL and download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = documentFile.fileName || documentFile.name || 'document';
            link.style.display = 'none';
            
            // Add to DOM, trigger download, then clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the object URL
            window.URL.revokeObjectURL(url);
            
            console.log('Server endpoint download completed successfully');
            
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to direct link download
            try {
                const link = document.createElement('a');
                link.href = documentFile.fileUrl;
                link.download = documentFile.fileName || documentFile.name || 'document';
                link.target = '_blank';
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('Fallback download triggered');
            } catch (fallbackError) {
                console.error('Fallback download also failed:', fallbackError);
            }
        }
    };

    const getDocumentIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            case 'doc':
            case 'docx':
                return '📝';
            default:
                return '📄';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading workforce data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={refreshData} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const summaryCards = [
        { title: "Active Clients", value: data.summary.activeClients.toString(), icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: "Loans in Underwriting", value: data.summary.loansInUnderwriting.toString(), icon: <BarChart className="h-4 w-4 text-muted-foreground" /> },
        { title: "Total Funded (YTD)", value: formatCurrency(data.summary.totalFundedYTD), icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="font-headline text-3xl font-bold">Workforce Dashboard</h1>
            <p className="text-muted-foreground">Manage clients, brokers, and loans.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search clients or loans..." className="pl-8 w-full md:w-64" />
           </div>
           <Button onClick={refreshData} variant="outline" size="sm">
               <RefreshCw className="h-4 w-4 mr-2" />
               Refresh
           </Button>
           <InviteUserDialog />
            <Button asChild>
                <Link href="/workforce-office/applications"><PlusCircle className="mr-2 h-4 w-4"/> New Application</Link>
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
                </CardContent>
            </Card>
        ))}
      </div>
      
       <Tabs defaultValue="client-pipeline">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="client-pipeline"><Users className="mr-2 h-4 w-4" /> Client Pipeline</TabsTrigger>
          <TabsTrigger value="broker-pipeline"><Briefcase className="mr-2 h-4 w-4" /> Broker Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="client-pipeline">
            <Card>
                <CardHeader>
                    <CardTitle>Client Loan Pipeline</CardTitle>
                    <CardDescription>Manage and track all client loan applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Broker</TableHead>
                                    <TableHead>Loan ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.loanApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No loan applications found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.loanApplications.map(loan => (
                                        <TableRow key={loan.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{loan.borrower.name}</TableCell>
                                            <TableCell>{loan.broker.name}</TableCell>
                                            <TableCell>{loan.id}</TableCell>
                                            <TableCell>{loan.type}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Docs' ? 'destructive' : loan.status === 'Funded' ? 'default' : 'secondary'}
                                                className={loan.status === 'Approved' || loan.status === 'Funded' ? 'bg-green-500 hover:bg-green-600' : ''}
                                                >
                                                {loan.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                <Progress value={loan.progress} className="w-full md:w-32" />
                                                <span className="text-xs text-muted-foreground">{loan.progress}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={() => setSelectedLoan(loan)}>View Details</DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/workforce-office/loan-documents/${loan.id}`}>Manage Documents</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/workforce-office/due-diligence">Due Diligence</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                         <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Loan Details: {selectedLoan?.id}</DialogTitle>
                                <DialogDescription>
                                    Comprehensive summary for the loan on {selectedLoan?.property}.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedLoan && (
                                <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
                                    {/* Loan Metrics */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-primary">Loan Metrics</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground">Loan Amount</p>
                                                <p className="font-bold text-lg">${selectedLoan.loanAmount.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground">LTV / ARV</p>
                                                <p className="font-bold text-lg">{selectedLoan.ltv}% / ${selectedLoan.arv.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground">Interest Rate</p>
                                                <p className="font-bold text-lg">{selectedLoan.interestRate}%</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground">Term</p>
                                                <p className="font-bold text-lg">{selectedLoan.term} months</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Separator />

                                    {/* Borrower & Broker Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-primary mb-2">Borrower Contact</h4>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>{selectedLoan.borrower.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{selectedLoan.borrower.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {selectedLoan.borrower.email}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {selectedLoan.borrower.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-primary mb-2">Broker Contact</h4>
                                             {selectedLoan.broker.company ? (
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{selectedLoan.broker.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{selectedLoan.broker.name}</p>
                                                        <p className="text-xs text-muted-foreground">({selectedLoan.broker.company})</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {selectedLoan.broker.email}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {selectedLoan.broker.phone}</p>
                                                    </div>
                                                </div>
                                             ) : <p className="text-sm">Direct</p>}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Property & Status */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-primary">Property & Status</h4>
                                        <div className="text-sm">
                                            <p><span className="font-medium">Property Address:</span> {selectedLoan.property}</p>
                                            <p><span className="font-medium">Loan Type:</span> <Badge variant="outline">{selectedLoan.type}</Badge></p>
                                            <p><span className="font-medium">Current Status:</span> <Badge variant={selectedLoan.status === 'Approved' || selectedLoan.status === 'Funded' ? 'default' : 'destructive'} className={selectedLoan.status === 'Approved' || selectedLoan.status === 'Funded' ? 'bg-green-500 hover:bg-green-600' : ''}>{selectedLoan.status}</Badge></p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Progress</Label>
                                            <Progress value={selectedLoan.progress} className="w-full mt-1" />
                                        </div>
                                    </div>
                                    
                                    <Separator />

                                    {/* Missing Documents */}
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2">Missing Documents</h4>
                                        {selectedLoan.missingDocuments.length > 0 ? (
                                            <ul className="space-y-2">
                                                {selectedLoan.missingDocuments.map((doc, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm p-2 bg-destructive/10 rounded-md">
                                                        <FileWarning className="h-4 w-4 text-destructive" />
                                                        <span>{doc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">No outstanding documents for this loan.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="broker-pipeline">
             <Card>
                <CardHeader>
                    <CardTitle>Approved Broker Pipeline</CardTitle>
                    <CardDescription>Manage and track all approved broker pipelines.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Broker Name</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Active Loans</TableHead>
                                <TableHead>Total Volume</TableHead>
                                <TableHead>Documents</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.brokers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No brokers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.brokers.map(broker => (
                                    <TableRow key={broker.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{broker.name}</TableCell>
                                        <TableCell>{broker.company}</TableCell>
                                        <TableCell>{broker.activeLoans}</TableCell>
                                        <TableCell>{formatCurrency(broker.totalVolume)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-medium">{broker.documentCount}</span>
                                                        <span className="text-xs text-muted-foreground">docs</span>
                                                    </div>
                                                    {broker.pendingDocuments > 0 && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Clock className="h-3 w-3 text-amber-500" />
                                                            <span className="text-xs text-amber-600 font-medium">
                                                                {broker.pendingDocuments} pending
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        setSelectedBroker(broker);
                                                        loadBrokerDocuments(broker.id);
                                                    }}
                                                    className="h-6 w-6 p-0"
                                                    title="Review documents"
                                                >
                                                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                                                    <span className="sr-only">Review documents</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-500 hover:bg-green-600">{broker.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/workforce-office/broker-pipeline/${broker.id}`}>View Pipeline</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/workforce-office/manage-broker/${broker.id}`}>Manage Broker</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/workforce-office/communications?roomId=${broker.id}`}>Send Communication</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Broker Documents Review Dialog */}
      <Dialog open={!!selectedBroker} onOpenChange={() => setSelectedBroker(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Documents - {selectedBroker?.name}</DialogTitle>
            <DialogDescription>
              Review and approve or deny broker documents for {selectedBroker?.company}.
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDocuments ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading documents...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {brokerDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No documents found for this broker.
                </div>
              ) : (
                <>
                  {/* Document Status Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">
                        {brokerDocuments.filter(doc => doc.status === 'pending').length}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Approved</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {brokerDocuments.filter(doc => doc.status === 'approved').length}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                      <span className="text-2xl font-bold text-red-600">
                        {brokerDocuments.filter(doc => doc.status === 'rejected').length}
                      </span>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {brokerDocuments.map((document) => (
                      <div key={document.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getDocumentIcon(document.fileName)}</span>
                              <span className="font-medium">{document.name}</span>
                              <Badge 
                                variant={document.status === 'approved' ? 'default' : 
                                        document.status === 'rejected' ? 'destructive' : 'secondary'}
                                className={document.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                                          document.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 
                                          'bg-amber-500 hover:bg-amber-600'}
                              >
                                {document.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><span className="font-medium">File:</span> {document.fileName}</p>
                              <p><span className="font-medium">Type:</span> {document.type}</p>
                              <p><span className="font-medium">Size:</span> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                              <p><span className="font-medium">Uploaded:</span> {document.uploadedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</p>
                              {document.reviewedBy && (
                                <p><span className="font-medium">Reviewed by:</span> {document.reviewedBy} on {document.reviewedAt?.toDate?.()?.toLocaleDateString()}</p>
                              )}
                              {document.notes && (
                                <p><span className="font-medium">Notes:</span> {document.notes}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDocument(document)}
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadDocument(document)}
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Approval Actions */}
                            {document.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleDocumentApproval([document.id], 'approve')}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDocumentApproval([document.id], 'deny')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deny
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bulk Actions */}
                  {brokerDocuments.filter(doc => doc.status === 'pending').length > 0 && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => {
                          const pendingDocs = brokerDocuments.filter(doc => doc.status === 'pending');
                          handleDocumentApproval(pendingDocs.map(doc => doc.id), 'approve');
                        }}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve All Pending
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const pendingDocs = brokerDocuments.filter(doc => doc.status === 'pending');
                          handleDocumentApproval(pendingDocs.map(doc => doc.id), 'deny');
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Deny All Pending
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={isViewingDocument} onOpenChange={setIsViewingDocument}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-lg">{selectedDocument && getDocumentIcon(selectedDocument.fileName)}</span>
                  {selectedDocument?.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedDocument?.fileName} • {(selectedDocument?.fileSize / 1024 / 1024).toFixed(2)} MB
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={selectedDocument?.status === 'approved' ? 'default' : 
                          selectedDocument?.status === 'rejected' ? 'destructive' : 'secondary'}
                  className={selectedDocument?.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                            selectedDocument?.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 
                            'bg-amber-500 hover:bg-amber-600'}
                >
                  {selectedDocument?.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-4 min-h-0 overflow-hidden">
            {selectedDocument && (
              <div className="h-full flex flex-col gap-4">
                {/* Document Viewer */}
                <div className="flex-1 border rounded-lg overflow-hidden bg-white min-h-0">
                  {selectedDocument.fileName.toLowerCase().includes('.pdf') ? (
                    <iframe
                      src={selectedDocument.fileUrl}
                      className="w-full h-full border-0"
                      title={selectedDocument.name}
                    />
                  ) : selectedDocument.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={selectedDocument.fileUrl}
                          alt={selectedDocument.name}
                          className="max-w-full max-h-full object-contain shadow-sm rounded"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'block';
                          }}
                        />
                        <div className="hidden text-center p-8">
                          <p className="text-muted-foreground mb-4">Unable to display image</p>
                          <Button
                            variant="outline"
                            onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download to view
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center p-8">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Preview not available for this file type
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download to view
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Actions */}
                {selectedDocument.status === 'pending' && (
                  <div className="flex justify-center gap-4 pt-4 border-t flex-shrink-0">
                    <Button
                      onClick={() => handleDocumentApproval([selectedDocument.id], 'approve')}
                      className="bg-green-500 hover:bg-green-600"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approve Document
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDocumentApproval([selectedDocument.id], 'deny')}
                      size="lg"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Deny Document
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
