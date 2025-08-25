
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, BarChart, DollarSign, MoreHorizontal, FileWarning, Search, Briefcase, UserPlus, Home, Mail, Phone } from "lucide-react";
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


const summaryCards = [
    { title: "Active Clients", value: "12", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "Loans in Underwriting", value: "8", icon: <BarChart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Total Funded (YTD)", value: "$5.8M", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
];

const clientLoans = [
    { id: "LL-00125", borrower: { name: "John Doe", email: "john.d@example.com", phone: "555-123-4567" }, broker: { name: "Alice Johnson", company: "Creative Capital", email: "alice.j@cc.com", phone: "555-987-6543"}, property: "123 Main St", type: "Fix and Flip", status: "Underwriting", progress: 60, missingDocuments: ["Proof of Insurance"] },
    { id: "LL-00126", borrower: { name: "Jane Smith", email: "jane.s@example.com", phone: "555-234-5678" }, broker: { name: "Direct" }, property: "456 Oak Ave", type: "DSCR", status: "Approved", progress: 100, missingDocuments: [] },
    { id: "LL-00127", borrower: { name: "Sam Wilson", email: "sam.w@example.com", phone: "555-345-6789" }, broker: { name: "Bob Williams", company: "Mortgage Pro", email: "bob.w@mp.com", phone: "555-876-5432" }, property: "789 Pine Ln", type: "Ground Up", status: "Missing Docs", progress: 25, missingDocuments: ["Approved Plans", "Builder's Risk Insurance"] },
    { id: "LL-00128", borrower: { name: "Alpha Corp", email: "contact@alphacorp.com", phone: "555-456-7890" }, broker: { name: "Direct" }, property: "101 Factory Rd", type: "Industrial Rehab", status: "Initial Review", progress: 15, missingDocuments: ["Business Financials (3 years)"] },
    { id: "LL-00129", borrower: { name: "Bridge Holdings", email: "deals@bridgeholdings.com", phone: "555-567-8901" }, broker: { name: "Diana Prince", company: "Capital Partners", email: "diana.p@cp.com", phone: "555-765-4321" }, property: "210 Commerce St", type: "Commercial Bridge", status: "Funded", progress: 100, missingDocuments: [] },
];

const brokerPipeline = [
    { id: "BRK-001", name: "Alice Johnson", company: "Creative Capital", activeLoans: 5, totalVolume: "$2.1M", status: "Approved" },
    { id: "BRK-002", name: "Bob Williams", company: "Mortgage Pro", activeLoans: 8, totalVolume: "$3.5M", status: "Approved" },
    { id: "BRK-003", name: "Charlie Brown", company: "Prestige Lending", activeLoans: 2, totalVolume: "$850K", status: "Approved" },
    { id: "BRK-004", name: "Diana Prince", company: "Capital Partners", activeLoans: 12, totalVolume: "$7.2M", status: "Approved" },
];

function InviteUserDialog() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('borrower');

    const handleSendInvite = () => {
        // Here you would typically call a backend service to send an email
        toast({
            title: "Invite Sent!",
            description: `An invitation has been sent to ${name} at ${email}.`,
        });
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
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button onClick={handleSendInvite}>Send Invite</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function WorkforceOfficePage() {
    const [selectedLoan, setSelectedLoan] = useState<(typeof clientLoans)[0] | null>(null);

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
           <InviteUserDialog />
            <Button asChild>
                <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> New Application</Link>
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
                                {clientLoans.map(loan => (
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
                                                <DropdownMenuItem>Manage Documents</DropdownMenuItem>
                                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Loan Details: {selectedLoan?.id}</DialogTitle>
                                <DialogDescription>
                                    Summary for property at {selectedLoan?.property}
                                </DialogDescription>
                            </DialogHeader>
                            {selectedLoan && (
                                <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm">Borrower</h4>
                                            <p>{selectedLoan.borrower.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {selectedLoan.borrower.email}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {selectedLoan.borrower.phone}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-sm">Broker</h4>
                                             {selectedLoan.broker.company ? (
                                                <>
                                                    <p>{selectedLoan.broker.name} ({selectedLoan.broker.company})</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {selectedLoan.broker.email}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {selectedLoan.broker.phone}</p>
                                                </>
                                             ) : <p>{selectedLoan.broker.name}</p>}
                                        </div>
                                    </div>
                                    <Separator />
                                     <div>
                                        <h4 className="font-semibold text-sm mb-2">Loan Info</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Type: <Badge variant="outline">{selectedLoan.type}</Badge></span>
                                            <span>Status: <Badge variant={selectedLoan.status === 'Approved' || selectedLoan.status === 'Funded' ? 'default' : 'destructive'} className={selectedLoan.status === 'Approved' || selectedLoan.status === 'Funded' ? 'bg-green-500 hover:bg-green-600' : ''}>{selectedLoan.status}</Badge></span>
                                        </div>
                                        <div className="mt-2">
                                            <Label>Progress</Label>
                                            <Progress value={selectedLoan.progress} className="w-full" />
                                        </div>
                                    </div>
                                    <Separator />
                                    {selectedLoan.missingDocuments.length > 0 ? (
                                        <div>
                                            <h4 className="font-semibold text-sm text-destructive mb-2">Missing Documents</h4>
                                            <ul className="space-y-2">
                                                {selectedLoan.missingDocuments.map((doc, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm p-2 bg-destructive/10 rounded-md">
                                                        <FileWarning className="h-4 w-4 text-destructive" />
                                                        <span>{doc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No outstanding documents for this loan.</p>
                                    )}
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
                            {brokerPipeline.map(broker => (
                                <TableRow key={broker.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{broker.name}</TableCell>
                                    <TableCell>{broker.company}</TableCell>
                                    <TableCell>{broker.activeLoans}</TableCell>
                                    <TableCell>{broker.totalVolume}</TableCell>
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
                                            <DropdownMenuItem>View Pipeline</DropdownMenuItem>
                                            <DropdownMenuItem>Manage Broker</DropdownMenuItem>
                                            <DropdownMenuItem>Send Communication</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
