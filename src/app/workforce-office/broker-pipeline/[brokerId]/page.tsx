
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BrokerInfo {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
}

interface LoanApplication {
  id: string;
  brokerId: string;
  borrower: {
    name: string;
    email: string;
    phone: string;
  };
  property: string;
  type: string;
  status: string;
  progress: number;
  loanAmount: number;
  createdAt: any;
  updatedAt: any;
}

export default function BrokerPipelinePage() {
    const params = useParams();
    const brokerId = params.brokerId as string;
    const { toast } = useToast();
    
    const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
    const [brokerLoans, setBrokerLoans] = useState<LoanApplication[]>([]);
    const [filteredLoans, setFilteredLoans] = useState<LoanApplication[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch broker information
    useEffect(() => {
        const fetchBrokerInfo = async () => {
            try {
                const response = await fetch('/api/brokers');
                const result = await response.json();
                
                if (result.success && Array.isArray(result.brokers)) {
                    const broker = result.brokers.find((b: any) => b.id === brokerId || b.uid === brokerId);
                    if (broker) {
                        setBrokerInfo({
                            id: broker.id || broker.uid,
                            name: broker.fullName || broker.name || 'Unknown Broker',
                            company: broker.company || 'No company',
                            email: broker.email || 'No email',
                            phone: broker.phone || 'No phone',
                            status: broker.status || 'Active'
                        });
                    } else {
                        setError('Broker not found');
                    }
                } else {
                    setError('Failed to load broker information');
                }
            } catch (err) {
                console.error('Error fetching broker info:', err);
                setError('Failed to load broker information');
            }
        };

        fetchBrokerInfo();
    }, [brokerId]);

    // Fetch broker's loan applications
    useEffect(() => {
        const fetchBrokerLoans = async () => {
            if (!brokerId) return;
            
            try {
                setLoading(true);
                const response = await fetch(`/api/enhanced-loan-applications?action=getByBroker&brokerId=${brokerId}`);
                const result = await response.json();
                
                if (result.success && Array.isArray(result.data)) {
                    const loans = result.data.map((app: any) => ({
                        id: app.id,
                        brokerId: app.brokerId,
                        borrower: {
                            name: app.borrowerInfo?.fullName || app.borrowerInfo?.name || 'Unknown Borrower',
                            email: app.borrowerInfo?.email || 'No email',
                            phone: app.borrowerInfo?.phone || 'No phone'
                        },
                        property: app.propertyAddress || app.propertyInfo?.address || 'Property address not set',
                        type: app.loanProgram || app.loanType || 'Unknown Program',
                        status: app.status || 'Draft',
                        progress: typeof app.progress === 'object' && app.progress?.overallProgress 
                            ? app.progress.overallProgress 
                            : (typeof app.progress === 'number' ? app.progress : 0),
                        loanAmount: app.loanAmount || 0,
                        createdAt: app.createdAt,
                        updatedAt: app.updatedAt
                    }));
                    
                    setBrokerLoans(loans);
                    setFilteredLoans(loans);
                } else {
                    setBrokerLoans([]);
                    setFilteredLoans([]);
                }
            } catch (err) {
                console.error('Error fetching broker loans:', err);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load loan applications'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBrokerLoans();
    }, [brokerId, toast]);

    // Filter loans based on search and status
    useEffect(() => {
        let filtered = brokerLoans;
        if (searchTerm) {
            filtered = filtered.filter(loan => 
                loan.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                loan.property.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(loan => loan.status === statusFilter);
        }
        setFilteredLoans(filtered);
    }, [searchTerm, statusFilter, brokerLoans]);

    if (error) {
        return (
            <div className="space-y-6">
                <Button variant="outline" asChild className="mb-4">
                    <Link href="/workforce-office">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600">Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (!brokerInfo) {
        return (
            <div className="space-y-6">
                <Button variant="outline" asChild className="mb-4">
                    <Link href="/workforce-office">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
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
                <p className="text-sm text-muted-foreground">{brokerInfo.email} • {brokerInfo.phone}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{brokerLoans.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {brokerLoans.filter(loan => 
                                loan.status !== 'Funded' && 
                                loan.status !== 'Cancelled' && 
                                loan.status !== 'Rejected'
                            ).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {brokerLoans.filter(loan => loan.status === 'Funded').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(
                                brokerLoans
                                    .filter(loan => loan.status === 'Funded' || loan.status === 'Approved')
                                    .reduce((sum, loan) => sum + loan.loanAmount, 0)
                            )}
                        </div>
                    </CardContent>
                </Card>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredLoans.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {brokerLoans.length === 0 
                                            ? 'No loan applications found for this broker'
                                            : 'No loans match your search criteria'
                                        }
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLoans.map(loan => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div>{loan.borrower.name}</div>
                                                <div className="text-sm text-muted-foreground">{loan.borrower.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{loan.id}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{loan.property}</TableCell>
                                        <TableCell>{loan.type}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Docs' ? 'destructive' : 'secondary'}
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
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
