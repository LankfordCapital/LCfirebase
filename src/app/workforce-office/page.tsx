
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, BarChart, DollarSign, MoreHorizontal, FileWarning, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";


const summaryCards = [
    { title: "Active Clients", value: "12", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "Loans in Underwriting", value: "8", icon: <BarChart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Total Funded (YTD)", value: "$5.8M", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
];

const clientLoans = [
    { id: "LL-00125", borrower: "John Doe", broker: "Creative Capital", property: "123 Main St", type: "Fix and Flip", status: "Underwriting", progress: 60, missingDocuments: ["Proof of Insurance"] },
    { id: "LL-00126", borrower: "Jane Smith", broker: "Direct", property: "456 Oak Ave", type: "DSCR", status: "Approved", progress: 100, missingDocuments: [] },
    { id: "LL-00127", borrower: "Sam Wilson", broker: "Mortgage Pro", property: "789 Pine Ln", type: "Ground Up", status: "Missing Docs", progress: 25, missingDocuments: ["Approved Plans", "Builder's Risk Insurance"] },
    { id: "LL-00128", borrower: "Alpha Corp", broker: "Direct", property: "101 Factory Rd", type: "Industrial Rehab", status: "Initial Review", progress: 15, missingDocuments: ["Business Financials (3 years)"] },
    { id: "LL-00129", borrower: "Bridge Holdings", broker: "Capital Partners", property: "210 Commerce St", type: "Commercial Bridge", status: "Funded", progress: 100, missingDocuments: [] },
];

export default function WorkforceOfficePage() {
    const [selectedLoan, setSelectedLoan] = useState<(typeof clientLoans)[0] | null>(null);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 bg-primary/5 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://placehold.co/80x80.png" />
              <AvatarFallback>WM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-headline text-3xl font-bold">Workforce Back Office</h1>
              <p className="text-muted-foreground">Welcome, Workforce Member</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search clients or loans..." className="pl-8 w-full md:w-64" />
           </div>
            <Button asChild>
                <Link href="/workforce-office/new-client"><PlusCircle className="mr-2 h-4 w-4"/> Add New Client</Link>
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
                                    <TableCell className="font-medium">{loan.borrower}</TableCell>
                                    <TableCell>{loan.broker}</TableCell>
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
                     <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Loan Details for {selectedLoan?.borrower}</DialogTitle>
                            <DialogDescription>Loan ID: {selectedLoan?.id} | Property: {selectedLoan?.property}</DialogDescription>
                        </DialogHeader>
                        {selectedLoan?.missingDocuments && selectedLoan.missingDocuments.length > 0 ? (
                            <div>
                                <h3 className="font-semibold mb-2">Missing Documents:</h3>
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
                            <p>All documents have been submitted for this loan.</p>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    </div>
  );
}
