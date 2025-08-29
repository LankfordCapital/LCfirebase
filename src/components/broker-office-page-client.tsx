
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, DollarSign, BarChart, MoreHorizontal, Calendar, Mail, Upload, FileWarning, MessageSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChatClient } from "../chat-client";


const summaryCards = [
    { title: "Active Borrowers", value: "5", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "Loans in Progress", value: "3", icon: <BarChart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Total Funded Volume", value: "$1.2M", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
];

const borrowerLoans = [
    { id: "LL-00125", borrower: "John Doe", property: "123 Main St, Anytown", type: "Fix and Flip", status: "Underwriting", progress: 60, missingDocuments: ["2023 Personal Tax Returns", "Proof of Insurance"] },
    { id: "LL-00126", borrower: "Jane Smith", property: "456 Oak Ave, Somecity", type: "DSCR", status: "Approved", progress: 100, missingDocuments: [] },
    { id: "LL-00127", borrower: "Sam Wilson", property: "789 Pine Ln, Otherville", type: "Ground Up Construction", status: "Missing Documents", progress: 25, missingDocuments: ["General Contractor License", "Approved or Pre-approved Plans", "Builder's Risk Insurance Quote"] },
];

// Mock data for workforce members. In a real app, this would come from a database.
const workforceMembers = [
    { uid: 'workforce-user-1', name: 'Alex Johnson', title: 'Senior Loan Officer' },
    { uid: 'workforce-user-2', name: 'Maria Garcia', title: 'Underwriting Manager' },
    { uid: 'workforce-user-3', name: 'Chris Lee', title: 'Closing Coordinator' },
];

export default function BrokerOfficePageClient() {
    const { user, userProfile } = useAuth();
    const [selectedLoan, setSelectedLoan] = useState<(typeof borrowerLoans)[0] | null>(null);

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
            <Link href="/dashboard/application"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
        </Button>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Borrower Pipeline</CardTitle>
                    <CardDescription>Track the status and progress of all loans submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog open={!!selectedLoan} onOpenChange={(open) => !open && setSelectedLoan(null)}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Loan ID</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowerLoans.map(loan => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">{loan.borrower}</TableCell>
                                        <TableCell>{loan.id}</TableCell>
                                        <TableCell>{loan.property}</TableCell>
                                        <TableCell>{loan.type}</TableCell>
                                        <TableCell>
                                            <Badge 
                                            variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Documents' ? 'destructive' : 'secondary'}
                                            className={loan.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                                            >
                                            {loan.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                            <Progress value={loan.progress} className="w-full md:w-40" />
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
                                                <DropdownMenuItem>
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Schedule Call
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Email
                                                </DropdownMenuItem>
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
                                <DialogDescription>Loan ID: {selectedLoan?.id}</DialogDescription>
                            </DialogHeader>
                            {selectedLoan?.missingDocuments && selectedLoan.missingDocuments.length > 0 ? (
                                <div>
                                    <h3 className="font-semibold mb-2">Missing Documents:</h3>
                                    <ul className="space-y-2">
                                        {selectedLoan.missingDocuments.map((doc, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <FileWarning className="h-4 w-4 text-destructive" />
                                                <span>{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>No missing documents. All documents have been submitted.</p>
                            )}
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
             <Card className="mt-6">
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
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Broker Documents</CardTitle>
                    <CardDescription>Upload your compliance documents here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> W-9 (Broker)</Button>
                     <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Wiring Instructions (Broker)</Button>
                     <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> ID/Driver's License (Broker)</Button>
                     <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Signed Broker Agreement</Button>
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
                   {workforceMembers.map(member => (
                       <div key={member.uid} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                           <div className="flex items-center gap-3">
                               <Avatar className="h-10 w-10">
                                   <AvatarImage src={`https://i.pravatar.cc/40?u=${member.uid}`} />
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
                   ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
