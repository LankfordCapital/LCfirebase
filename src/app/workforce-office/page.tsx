
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, BarChart, DollarSign, MoreHorizontal, FileWarning, Search, Briefcase, UserPlus, Home, Mail, Phone, ArrowRight, Percent, Construction, MessageSquare, RefreshCw } from "lucide-react";
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

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount.toLocaleString()}`;
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
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.brokers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
    </div>
  );
}
