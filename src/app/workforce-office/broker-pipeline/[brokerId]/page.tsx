
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock Data - In a real app, this would be fetched based on brokerId
const allLoans = [
    { id: "LL-00125", brokerId: "BRK-001", borrower: "John Doe", property: "123 Main St", type: "Fix and Flip", status: "Underwriting", progress: 60 },
    { id: "LL-00130", brokerId: "BRK-001", borrower: "Emily White", property: "345 Maple Dr", type: "DSCR", status: "Approved", progress: 100 },
    { id: "LL-00131", brokerId: "BRK-002", borrower: "Sam Wilson", property: "789 Pine Ln", type: "Ground Up", status: "Missing Docs", progress: 25 },
    { id: "LL-00132", brokerId: "BRK-002", borrower: "Michael Brown", property: "555 Birch Rd", type: "Fix and Flip", status: "Funded", progress: 100 },
    { id: "LL-00133", brokerId: "BRK-001", borrower: "Sarah Green", property: "987 Cedar Ave", type: "DSCR", status: "Initial Review", progress: 15 },
];

const brokers = {
    "BRK-001": { name: "Alice Johnson", company: "Creative Capital" },
    "BRK-002": { name: "Bob Williams", company: "Mortgage Pro" },
    "BRK-003": { name: "Charlie Brown", company: "Prestige Lending" },
    "BRK-004": { name: "Diana Prince", company: "Capital Partners" },
};

export default function BrokerPipelinePage() {
    const params = useParams();
    const brokerId = params.brokerId as string;
    
    const [brokerLoans, setBrokerLoans] = useState(allLoans.filter(loan => loan.brokerId === brokerId));
    const [filteredLoans, setFilteredLoans] = useState(brokerLoans);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // @ts-ignore
    const brokerInfo = brokers[brokerId];

    useEffect(() => {
        let filtered = brokerLoans;
        if (searchTerm) {
            filtered = filtered.filter(loan => 
                loan.borrower.toLowerCase().includes(searchTerm.toLowerCase()) || 
                loan.property.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(loan => loan.status === statusFilter);
        }
        setFilteredLoans(filtered);
    }, [searchTerm, statusFilter, brokerLoans]);

    if (!brokerInfo) {
        return <div>Broker not found.</div>
    }

    return (
        <div className="space-y-6">
            <Link href="/workforce-office" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
            <div>
                <h1 className="font-headline text-3xl font-bold">{brokerInfo.name}'s Pipeline</h1>
                <p className="text-muted-foreground">{brokerInfo.company}</p>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                     <div className="relative flex-grow">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input 
                            placeholder="Search by borrower or property..." 
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                       </div>
                       <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Initial Review">Initial Review</SelectItem>
                                <SelectItem value="Missing Docs">Missing Docs</SelectItem>
                                <SelectItem value="Underwriting">Underwriting</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Funded">Funded</SelectItem>
                            </SelectContent>
                        </Select>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Loan ID</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLoans.map(loan => (
                                <TableRow key={loan.id}>
                                    <TableCell className="font-medium">{loan.borrower}</TableCell>
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell>{loan.property}</TableCell>
                                    <TableCell>{loan.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Docs' ? 'destructive' : 'secondary'}
                                        className={loan.status === 'Approved' || loan.status === 'Funded' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {loan.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={loan.progress} className="w-full md:w-32" />
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
    )
}
