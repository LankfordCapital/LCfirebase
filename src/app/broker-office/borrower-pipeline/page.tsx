
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MoreHorizontal, Calendar, Mail, FileWarning } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const borrowerLoans = [
    { id: "LL-00125", borrower: "John Doe", property: "123 Main St, Anytown", type: "Fix and Flip", status: "Underwriting", progress: 60, missingDocuments: ["2023 Personal Tax Returns", "Proof of Insurance"] },
    { id: "LL-00126", borrower: "Jane Smith", property: "456 Oak Ave, Somecity", type: "DSCR", status: "Approved", progress: 100, missingDocuments: [] },
    { id: "LL-00127", borrower: "Sam Wilson", property: "789 Pine Ln, Otherville", type: "Ground Up Construction", status: "Missing Documents", progress: 25, missingDocuments: ["General Contractor License", "Approved or Pre-approved Plans", "Builder's Risk Insurance Quote"] },
];

export default function BorrowerPipelinePage() {
    const [selectedLoan, setSelectedLoan] = useState<(typeof borrowerLoans)[0] | null>(null);

    return (
        <div className="space-y-6">
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
        </div>
    );
}
