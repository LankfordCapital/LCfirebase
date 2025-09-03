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
import { 
  MoreHorizontal, 
  Calendar, 
  Mail, 
  FileWarning, 
  Search, 
  Eye,
  Edit,
  Plus,
  ArrowRight
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample loan applications for testing
const sampleApplications = [
  {
    id: "LL-00125",
    borrowerInfo: {
      fullName: "John Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567"
    },
    propertyInfo: {
      propertyAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "TX",
        zipCode: "12345"
      }
    },
    loanProgram: "residential-noo-fix-and-flip",
    loanProgramDisplay: "Residential NOO - Fix and Flip",
    status: "under_review",
    progress: {
      overallProgress: 60,
      borrowerInfoCompleted: true,
      businessInfoCompleted: true,
      loanDetailsCompleted: true,
      financialInfoCompleted: false,
      propertyInfoCompleted: true,
      employmentInfoCompleted: false,
      documentsUploaded: false
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    missingDocuments: ["2023 Personal Tax Returns", "Proof of Insurance"]
  },
  {
    id: "LL-00126",
    borrowerInfo: {
      fullName: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "(555) 987-6543"
    },
    propertyInfo: {
      propertyAddress: {
        street: "456 Oak Ave",
        city: "Somecity",
        state: "TX",
        zipCode: "67890"
      }
    },
    loanProgram: "residential-noo-dscr",
    loanProgramDisplay: "Residential NOO - DSCR",
    status: "approved",
    progress: {
      overallProgress: 100,
      borrowerInfoCompleted: true,
      businessInfoCompleted: true,
      loanDetailsCompleted: true,
      financialInfoCompleted: true,
      propertyInfoCompleted: true,
      employmentInfoCompleted: true,
      documentsUploaded: true
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    missingDocuments: []
  },
  {
    id: "LL-00127",
    borrowerInfo: {
      fullName: "Sam Wilson",
      email: "sam.wilson@email.com",
      phone: "(555) 456-7890"
    },
    propertyInfo: {
      propertyAddress: {
        street: "789 Pine Ln",
        city: "Otherville",
        state: "TX",
        zipCode: "11223"
      }
    },
    loanProgram: "residential-noo-ground-up-construction",
    loanProgramDisplay: "Residential NOO - Ground Up Construction",
    status: "draft",
    progress: {
      overallProgress: 25,
      borrowerInfoCompleted: true,
      businessInfoCompleted: false,
      loanDetailsCompleted: false,
      financialInfoCompleted: false,
      propertyInfoCompleted: false,
      employmentInfoCompleted: false,
      documentsUploaded: false
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    missingDocuments: ["General Contractor License", "Approved or Pre-approved Plans", "Builder's Risk Insurance Quote"]
  }
];

export default function TestPipelinePage() {
  const router = useRouter();
  
  // State - use only sample data, no database calls
  const [applications] = useState(sampleApplications);
  const [filteredApplications, setFilteredApplications] = useState(sampleApplications);
  const [selectedApplication, setSelectedApplication] = useState<typeof sampleApplications[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  // Filter applications based on search and filters
  const filterApplications = () => {
    let filtered = applications;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.borrowerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.borrowerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.propertyInfo.propertyAddress.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.propertyInfo.propertyAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
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
  };

  // Apply filters when search or filters change
  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, programFilter]);

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
  const openApplication = (application: typeof sampleApplications[0]) => {
    // Navigate to the loan application page with the application ID
    router.push(`/broker-office/application/${application.loanProgram}?applicationId=${application.id}`);
  };

  // Create new application
  const createNewApplication = () => {
    router.push('/broker-office/applications');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Test Broker Pipeline</h1>
          <p className="text-muted-foreground">This is a test page showing how the broker pipeline works with sample data.</p>
        </div>
        <Button onClick={createNewApplication} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Start New Application
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-blue-800">
            <h3 className="font-semibold mb-2">How to Test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click "Continue Application" on any loan to open it</li>
              <li>You'll be taken to the loan application form with all saved data</li>
              <li>Make changes and see them auto-save</li>
              <li>Navigate back to this page to see updated progress</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Note about Sample Data */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="text-yellow-800">
            <h3 className="font-semibold mb-2">⚠️ Note:</h3>
            <p className="text-sm">
              This page uses sample data for demonstration purposes. In production, this would show real loan applications from your database. 
              The "Continue Application" buttons will work and take you to the loan application forms.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by borrower, property, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
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
            
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="residential-noo-fix-and-flip">Fix & Flip</SelectItem>
                  <SelectItem value="residential-noo-dscr">DSCR</SelectItem>
                  <SelectItem value="residential-noo-ground-up-construction">Ground Up Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Loan Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Click "Continue Application" to open and work on an existing application.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found matching your criteria.</p>
              <Button onClick={createNewApplication} className="mt-4">
                Start Your First Application
              </Button>
            </div>
          ) : (
            <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map(application => (
                    <TableRow key={application.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div>{application.borrowerInfo.fullName}</div>
                          <div className="text-sm text-muted-foreground">{application.borrowerInfo.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{application.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{application.propertyInfo.propertyAddress.street}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.propertyInfo.propertyAddress.city}, {application.propertyInfo.propertyAddress.state} {application.propertyInfo.propertyAddress.zipCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {application.loanProgramDisplay.replace('Residential NOO - ', '')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(application.status)}
                          className={getStatusColor(application.status)}
                        >
                          {getStatusDisplayText(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={application.progress.overallProgress} className="w-full md:w-40" />
                          <span className="text-xs text-muted-foreground">{application.progress.overallProgress}%</span>
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
                            <DropdownMenuItem onClick={() => openApplication(application)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Continue Application
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={() => setSelectedApplication(application)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
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
              
              {/* Application Details Dialog */}
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Loan Details for {selectedApplication?.borrowerInfo.fullName}</DialogTitle>
                  <DialogDescription>Loan ID: {selectedApplication?.id}</DialogDescription>
                </DialogHeader>
                
                {selectedApplication && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm">Borrower</h4>
                        <p className="text-sm text-muted-foreground">{selectedApplication.borrowerInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground">{selectedApplication.borrowerInfo.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedApplication.borrowerInfo.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Property</h4>
                        <p className="text-sm text-muted-foreground">{selectedApplication.propertyInfo.propertyAddress.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedApplication.propertyInfo.propertyAddress.city}, {selectedApplication.propertyInfo.propertyAddress.state} {selectedApplication.propertyInfo.propertyAddress.zipCode}
                        </p>
                      </div>
                    </div>

                    {/* Progress Details */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Application Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Borrower Info</span>
                          <Badge variant={selectedApplication.progress.borrowerInfoCompleted ? 'default' : 'secondary'}>
                            {selectedApplication.progress.borrowerInfoCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Business Info</span>
                          <Badge variant={selectedApplication.progress.businessInfoCompleted ? 'default' : 'secondary'}>
                            {selectedApplication.progress.businessInfoCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Loan Details</span>
                          <Badge variant={selectedApplication.progress.loanDetailsCompleted ? 'default' : 'secondary'}>
                            {selectedApplication.progress.loanDetailsCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Financial Info</span>
                          <Badge variant={selectedApplication.progress.financialInfoCompleted ? 'default' : 'secondary'}>
                            {selectedApplication.progress.financialInfoCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Property Info</span>
                          <Badge variant={selectedApplication.progress.propertyInfoCompleted ? 'default' : 'secondary'}>
                            {selectedApplication.progress.propertyInfoCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Documents</span>
                          <Badge variant={selectedApplication.progress.documentsUploaded ? 'default' : 'secondary'}>
                            {selectedApplication.progress.documentsUploaded ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Missing Documents */}
                    {selectedApplication.missingDocuments && selectedApplication.missingDocuments.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Missing Documents:</h4>
                        <ul className="space-y-2">
                          {selectedApplication.missingDocuments.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <FileWarning className="h-4 w-4 text-destructive" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No missing documents. All documents have been submitted.</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={() => openApplication(selectedApplication)} className="flex-1">
                        Continue Application
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Navigation Help */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-green-800">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <div className="space-y-2 text-sm">
              <p>1. Click "Continue Application" on any loan above</p>
              <p>2. You'll be taken to the loan application form</p>
              <p>3. All your data will be automatically loaded</p>
              <p>4. Make changes and see them save automatically</p>
              <p>5. Navigate between pages and return to see your progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
