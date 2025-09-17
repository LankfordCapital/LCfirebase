
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { authenticatedGet } from '@/lib/api-client';
import { 
  MoreHorizontal, 
  Calendar, 
  Mail, 
  FileWarning, 
  Search, 
  Eye,
  Edit,
  Plus,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DebugDatabase } from '@/components/debug-database';

// Updated Types for loan applications
interface LoanApplication {
  id: string;
  userId: string;
  brokerId: string;
  loanCategory: string;
  loanProgram: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'closed';
  
  // Borrower Information
  borrowerInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    ssn?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    employmentStatus?: string;
    annualIncome?: number;
    creditScore?: number;
  };
  
  // Business Information
  businessInfo: {
    businessName?: string;
    businessType?: string;
    ein?: string;
    businessAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    yearsInBusiness?: number;
    annualRevenue?: number;
  };
  
  // Loan Details
  loanDetails: {
    loanAmount?: number;
    loanPurpose?: string;
    term?: number;
    propertyType?: string;
    propertyAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    downPayment?: number;
    downPaymentPercentage?: number;
    interestRate?: number;
    monthlyPayment?: number;
  };
  
  // Financial Information
  financialInfo: {
    monthlyDebt?: number;
    assets?: number;
    liabilities?: number;
    debtToIncomeRatio?: number;
    loanToValueRatio?: number;
  };
  
  // Property Information
  propertyInfo: {
    propertyType?: string;
    propertyAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    propertyValue?: number;
    purchasePrice?: number;
    afterRepairValue?: number;
    lotSize?: number;
    propertySqFt?: number;
  };
  
  // Progress and Status
  progress: {
    borrowerInfoCompleted: boolean;
    businessInfoCompleted: boolean;
    loanDetailsCompleted: boolean;
    financialInfoCompleted: boolean;
    propertyInfoCompleted: boolean;
    employmentInfoCompleted: boolean;
    documentsUploaded: boolean;
    overallProgress: number;
  };
  
  // History and Notes
  history: Array<{
    action: string;
    description: string;
    performedBy: string;
    timestamp: any;
    details?: any;
  }>;
  notes: string;
  
  createdAt: any;
  updatedAt: any;
  missingDocuments?: string[];
}

export default function BorrowerPipelinePage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  // State
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [showDebug, setShowDebug] = useState(false);

  // Load broker's loan applications
  useEffect(() => {
    if (user && userProfile) {
      loadBrokerApplications();
      loadResidentialNOOApplications(); // Also load Residential NOO applications
    }
  }, [user, userProfile]);

  // Filter applications based on search and filters
  useEffect(() => {
    let filtered = applications;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        (app.borrowerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (app.borrowerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (app.propertyInfo?.propertyAddress?.street?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (app.propertyInfo?.propertyAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply program filter
    if (programFilter !== 'all') {
      filtered = filtered.filter(app => app.loanProgram === programFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, programFilter]);

  const loadBrokerApplications = async () => {
    if (!user || !userProfile || (userProfile.role !== 'broker' && userProfile.role !== 'admin')) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading applications for broker:', user.uid);
      
      const response = await authenticatedGet(`/api/enhanced-loan-applications?action=getByBroker&brokerId=${user.uid}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Failed to load applications: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('Applications loaded successfully:', result.data);
        setApplications(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to load applications');
      }
      
    } catch (error) {
      console.error('Error loading applications:', error);
      
      // Check if it's a permission error (user not authenticated)
      if (error instanceof Error && error.message.includes('permission-denied')) {
        toast({
          variant: 'destructive',
          title: 'Authentication Required',
          description: 'Please sign in to view your loan applications.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Load Applications',
          description: 'Unable to load your loan applications. Please try again.',
        });
      }
      
      // Set empty applications array
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Load Residential NOO applications from the new database collection
  const loadResidentialNOOApplications = async () => {
    if (!user || !userProfile || (userProfile.role !== 'broker' && userProfile.role !== 'admin')) {
      return;
    }

    try {
      console.log('Loading Residential NOO applications for broker:', user.uid);
      
      // Use the Residential NOO service to get applications
      const { residentialNOOService } = await import('@/lib/residential-noo-loan-application-service');
      const nooApplications = await residentialNOOService.getBrokerApplications(user.uid);
      
      console.log('Residential NOO applications loaded:', nooApplications);
      
      // Convert Residential NOO applications to the format expected by the pipeline
      const convertedApplications = nooApplications.map(nooApp => ({
        id: nooApp.id || '',
        userId: nooApp.userId,
        brokerId: nooApp.brokerId,
        loanCategory: 'residential_noo',
        loanProgram: nooApp.program,
        status: nooApp.status,
        
        // Borrower Information
        borrowerInfo: {
          fullName: nooApp.borrowerInfo?.fullName || '',
          email: nooApp.borrowerInfo?.email || '',
          phone: nooApp.borrowerInfo?.phone || '',
          dateOfBirth: nooApp.borrowerInfo?.dateOfBirth || '',
          ssn: nooApp.borrowerInfo?.ssn || '',
          address: {
            street: nooApp.borrowerInfo?.currentAddress?.street || '',
            city: nooApp.borrowerInfo?.currentAddress?.city || '',
            state: nooApp.borrowerInfo?.currentAddress?.state || '',
            zipCode: nooApp.borrowerInfo?.currentAddress?.zipCode || ''
          },
          employmentStatus: nooApp.borrowerInfo?.employmentStatus || '',
          annualIncome: nooApp.borrowerInfo?.annualIncome || 0,
          creditScore: nooApp.borrowerInfo?.creditScore || 0
        },
        
        // Business Information
        businessInfo: {
          businessName: nooApp.businessInfo?.businessName || '',
          businessType: nooApp.businessInfo?.businessType || '',
          ein: nooApp.businessInfo?.ein || '',
          businessAddress: {
            street: nooApp.businessInfo?.businessAddress?.street || '',
            city: nooApp.businessInfo?.businessAddress?.city || '',
            state: nooApp.businessInfo?.businessAddress?.state || '',
            zipCode: nooApp.businessInfo?.businessAddress?.zipCode || ''
          },
          yearsInBusiness: nooApp.businessInfo?.yearsInBusiness || 0,
          annualRevenue: nooApp.businessInfo?.annualRevenue || 0
        },
        
        // Loan Details
        loanDetails: {
          loanAmount: nooApp.loanDetails?.loanAmount || 0,
          loanPurpose: nooApp.loanDetails?.loanPurpose || '',
          term: nooApp.loanDetails?.term || 0,
          propertyType: nooApp.loanDetails?.propertyType || '',
          propertyAddress: {
            street: nooApp.loanDetails?.propertyAddress?.street || '',
            city: nooApp.loanDetails?.propertyAddress?.city || '',
            state: nooApp.loanDetails?.propertyAddress?.state || '',
            zipCode: nooApp.loanDetails?.propertyAddress?.zipCode || ''
          },
          downPayment: nooApp.loanDetails?.downPayment || 0,
          downPaymentPercentage: nooApp.loanDetails?.downPaymentPercentage || 0,
          interestRate: nooApp.loanDetails?.interestRate || 0,
          monthlyPayment: nooApp.loanDetails?.monthlyPayment || 0
        },
        
        // Financial Information
        financialInfo: {
          monthlyDebt: 0, // Calculate from liabilities
          assets: nooApp.financialAssets?.totalAssets || 0,
          liabilities: nooApp.financialLiabilities?.totalLiabilities || 0,
          debtToIncomeRatio: 0, // Calculate from income and liabilities
          loanToValueRatio: 0 // Calculate from loan amount and property value
        },
        
        // Property Information
        propertyInfo: {
          propertyType: nooApp.propertyInfo?.propertyType || '',
          propertyAddress: {
            street: nooApp.loanDetails?.propertyAddress?.street || '',
            city: nooApp.loanDetails?.propertyAddress?.city || '',
            state: nooApp.loanDetails?.propertyAddress?.state || '',
            zipCode: nooApp.loanDetails?.propertyAddress?.zipCode || ''
          },
          propertyValue: nooApp.loanDetails?.propertyValue || 0,
          purchasePrice: nooApp.loanDetails?.purchasePrice || 0,
          afterRepairValue: nooApp.loanDetails?.afterRepairValue || 0,
          lotSize: nooApp.propertyInfo?.lotSize || 0,
          propertySqFt: nooApp.propertyInfo?.squareFootage || 0
        },
        
        // Progress and Status
        progress: {
          borrowerInfoCompleted: nooApp.progress?.borrowerInfoCompleted || false,
          businessInfoCompleted: nooApp.progress?.businessInfoCompleted || false,
          loanDetailsCompleted: nooApp.progress?.loanDetailsCompleted || false,
          financialInfoCompleted: nooApp.progress?.financialInfoCompleted || false,
          propertyInfoCompleted: nooApp.progress?.propertyInfoCompleted || false,
          employmentInfoCompleted: nooApp.progress?.employmentInfoCompleted || false,
          documentsUploaded: nooApp.progress?.documentsUploaded || false,
          overallProgress: nooApp.progress?.overallProgress || 0
        },
        
        // History and Notes
        history: nooApp.history || [],
        notes: nooApp.notes?.generalNotes || '',
        
        createdAt: nooApp.createdAt,
        updatedAt: nooApp.updatedAt,
        missingDocuments: [] // TODO: Calculate from document tracking
      }));
      
      // Merge with existing applications
      setApplications(prev => [...prev, ...convertedApplications]);
      
    } catch (error) {
      console.error('Error loading Residential NOO applications:', error);
      // Don't show error toast for this, just log it
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'under_review': return 'secondary';
      case 'submitted': return 'outline';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      case 'submitted': return 'Submitted';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500 hover:bg-green-600';
      case 'rejected': return 'bg-red-500 hover:bg-red-600';
      case 'under_review': return 'bg-blue-500 hover:bg-blue-600';
      case 'submitted': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'draft': return 'bg-gray-500 hover:bg-gray-600';
      default: return '';
    }
  };

  // Open application to continue working on it
  const openApplication = (application: LoanApplication) => {
    // Navigate to the loan application page with the application ID
    const programSlug = application.loanProgram.toLowerCase()
      .replace(/ /g, '-')
      .replace(/&/g, 'and')
      .replace(/noo/g, 'noo')
      .replace(/dscr/g, 'dscr');
    
    router.push(`/broker-office/application/${programSlug}?applicationId=${application.id}`);
  };

  // Create new application
  const createNewApplication = () => {
    router.push('/broker-office/applications');
  };

  // Refresh applications
  const refreshApplications = () => {
    loadBrokerApplications();
  };

  // Check if user is authenticated and is a broker
  if (!user || !userProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your borrower pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You must be signed in to access this page.</p>
              <Button asChild className="mt-4">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile.role !== 'broker' && userProfile.role !== 'admin') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only brokers and admins can access the borrower pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your account does not have broker or admin privileges.</p>
              <Button asChild className="mt-4">
                <Link href="/broker-office">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Borrower Pipeline</CardTitle>
            <CardDescription>Loading your loan applications...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create New Application button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Borrower Pipeline</h1>
          <p className="text-muted-foreground">Track the status and progress of all loans submitted.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={refreshApplications} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={createNewApplication} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start New Application
          </Button>
        </div>
      </div>

      {/* Debug Database Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </Button>
      </div>

      {/* Debug Database Component */}
      {showDebug && <DebugDatabase />}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific applications or filter by status and program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Search Applications</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="program">Program Filter</Label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="residential-noo-ground-up-construction">Residential NOO - Ground Up Construction</SelectItem>
                  <SelectItem value="residential-noo-fix-and-flip">Residential NOO - Fix and Flip</SelectItem>
                  <SelectItem value="residential-noo-dscr">Residential NOO - DSCR</SelectItem>
                  <SelectItem value="commercial-ground-up-construction">Commercial - Ground Up Construction</SelectItem>
                  <SelectItem value="commercial-fix-and-flip">Commercial - Fix and Flip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No applications found matching your criteria.</p>
              <Button onClick={createNewApplication} className="mt-4">
                Start Your First Application
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.borrowerInfo?.fullName || 'Not provided'}</div>
                        <div className="text-sm text-muted-foreground">{application.borrowerInfo?.email || 'No email'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.loanProgram}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(application.status)}>
                        {getStatusDisplayText(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={application.progress?.overallProgress || 0} className="w-20" />
                        <span className="text-sm text-muted-foreground">
                          {application.progress?.overallProgress || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {application.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openApplication(application)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Application
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openApplication(application)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Continue Editing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
