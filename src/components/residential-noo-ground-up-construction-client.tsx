'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2, Briefcase, FileUp, FileText, Layers, DollarSign, Truck, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDocumentContext } from '@/contexts/document-context';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { getOfficeContextFromUrl, getOfficeBasePath } from '@/lib/office-routing';
import { useGroundUpConstructionForm } from '@/hooks/use-ground-up-construction-form';

export function ResidentialNOOGroundUpConstructionClient({ 
  officeContext = 'broker',
  applicationId,
  borrowerId
}: { 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string,
  borrowerId?: string
}) {
  // NEW: Use the comprehensive hook instead of individual state variables
  const { 
    application,
    saving,
    lastSaved,
    isInitialized,
    initializeApplication,
    updateField,
    updateFields,
    markPageCompleted,
    getApplicationData,
    isPageCompleted,
    getOverallProgress
  } = useGroundUpConstructionForm(applicationId);

  const router = useRouter();
  const { uploadDocument, documents } = useDocumentContext();

  // Initialize application when component mounts and contexts are ready
  useEffect(() => {
    if (isInitialized && !application) {
      initializeApplication(borrowerId || 'default-broker-id');
    }
  }, [isInitialized, application, borrowerId, initializeApplication]);

  // ============================================================================
  // FORM FIELD HANDLERS - NO MORE INDIVIDUAL STATE VARIABLES!
  // ============================================================================
  
  // Property Information
  const handlePropertyAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.propertyAddress', e.target.value);
  };

  const handlePropertyApnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.propertyApn', e.target.value);
  };

  const handlePropertyTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.annualPropertyTaxes', parseFloat(e.target.value) || 0);
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('loanDetails.loanAmount', parseFloat(e.target.value) || 0);
  };

  const handlePurchasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('loanDetails.purchasePrice', parseFloat(e.target.value) || 0);
  };

  const handleAsIsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.asIsValue', parseFloat(e.target.value) || 0);
  };

  const handleAfterConstructedValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.afterConstructedValue', parseFloat(e.target.value) || 0);
  };

  const handleStabilizedValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.stabilizedValue', parseFloat(e.target.value) || 0);
  };

  const handleLotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.lotSize', e.target.value);
  };

  const handlePropertySqFtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.propertySquareFootage', parseFloat(e.target.value) || 0);
  };

  const handleConstructionTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('propertyInfo.constructionTime', parseFloat(e.target.value) || 0);
  };

  const handleRequestedClosingDateChange = (date: Date | undefined) => {
    updateField('propertyInfo.requestedClosingDate', date);
  };

  const handleTransactionTypeChange = (value: string) => {
    updateField('loanDetails.transactionType', value);
  };

  const handlePropertyTypeChange = (value: string) => {
    updateField('propertyInfo.propertyType', value);
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('businessInfo.companyName', e.target.value);
  };

  const handleCompanyEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('businessInfo.companyEin', e.target.value);
  };

  // ============================================================================
  // PAGE NAVIGATION WITH AUTO-SAVE
  // ============================================================================
  
  const handleNextPage = (currentPage: number) => {
    // Mark current page as complete
    markPageCompleted(currentPage);
    
    // Navigate to next page
    const nextPage = currentPage + 1;
    const basePath = getOfficeBasePath(officeContext);
    router.push(`${basePath}/residential-noo-ground-up-construction/page-${nextPage}`);
  };

  const handlePreviousPage = (currentPage: number) => {
    const previousPage = currentPage - 1;
    const basePath = getOfficeBasePath(officeContext);
    if (previousPage === 0) {
      router.push(`${basePath}/residential-noo-ground-up-construction`);
    } else {
      router.push(`${basePath}/residential-noo-ground-up-construction/page-${previousPage}`);
    }
  };

  // ============================================================================
  // DOCUMENT UPLOAD HANDLERS
  // ============================================================================
  
  const handleDocumentUpload = async (documentType: string, file: File) => {
    try {
      const success = await addDocument({
        name: documentType,
        file
      });
      
      if (success) {
        // Get the uploaded document from context
        const uploadedDoc = documents[documentType];
        
        if (uploadedDoc && uploadedDoc.downloadURL) {
          // Update the document in the application
          const documentData = {
            name: documentType,
            fileUrl: uploadedDoc.downloadURL,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date(),
            uploadedBy: borrowerId || 'unknown',
            status: 'uploaded' as const
          };

          // Update the specific document field
          updateField(`documents.${documentType}`, documentData);
        }
      }
    } catch (error) {
      console.error('Document upload failed:', error);
    }
  };

  // ============================================================================
  // RENDER FORM FIELDS
  // ============================================================================
  
  if (!isInitialized || !application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{!isInitialized ? 'Loading...' : 'Initializing application...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Application Progress</span>
              <span className="text-blue-600 font-semibold">{getOverallProgress()}%</span>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
            
            {/* Page Completion Status */}
            <div className="grid grid-cols-6 gap-2 text-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pageNum) => (
                <div key={pageNum} className="text-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1",
                    isPageCompleted(pageNum) 
                      ? "bg-green-100 text-green-600 border-2 border-green-300" 
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  )}>
                    {isPageCompleted(pageNum) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      pageNum
                    )}
                  </div>
                  <span className="text-xs">Page {pageNum}</span>
                </div>
              ))}
            </div>

            {lastSaved && (
              <p className="text-xs text-green-600 text-center">
                ✓ Last saved: {lastSaved.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Page 1: Property & Loan Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Property & Loan Information
          </CardTitle>
          <CardDescription>
            Enter the basic property and loan details for your ground up construction project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Address */}
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={application.propertyInfo?.propertyAddress || ''}
                  onChange={handlePropertyAddressChange}
                  placeholder="123 Main Street, Austin, TX 78701"
                  className="w-full"
                />
              </div>

              {/* Property APN */}
              <div className="space-y-2">
                <Label htmlFor="propertyApn">Property APN</Label>
                <Input
                  id="propertyApn"
                  value={application.propertyInfo?.propertyApn || ''}
                  onChange={handlePropertyApnChange}
                  placeholder="123-456-789"
                  className="w-full"
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={application.propertyInfo?.propertyType || ''}
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">Single Family</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Annual Property Taxes */}
              <div className="space-y-2">
                <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
                <Input
                  id="propertyTaxes"
                  type="number"
                  value={application.propertyInfo?.annualPropertyTaxes || ''}
                  onChange={handlePropertyTaxesChange}
                  placeholder="5000"
                  className="w-full"
                />
              </div>

              {/* Property Square Footage */}
              <div className="space-y-2">
                <Label htmlFor="propertySqFt">Property Square Footage</Label>
                <Input
                  id="propertySqFt"
                  type="number"
                  value={application.propertyInfo?.propertySquareFootage || ''}
                  onChange={handlePropertySqFtChange}
                  placeholder="2000"
                  className="w-full"
                />
              </div>

              {/* Lot Size */}
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  value={application.propertyInfo?.lotSize || ''}
                  onChange={handleLotSizeChange}
                  placeholder="10,000 sq. ft."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Property Values Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Property Values</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* As-Is Value */}
              <div className="space-y-2">
                <Label htmlFor="asIsValue">As-Is Value *</Label>
                <Input
                  id="asIsValue"
                  type="number"
                  value={application.propertyInfo?.asIsValue || ''}
                  onChange={handleAsIsValueChange}
                  placeholder="350000"
                  className="w-full"
                />
              </div>

              {/* After Constructed Value */}
              <div className="space-y-2">
                <Label htmlFor="afterConstructedValue">After Constructed Value *</Label>
                <Input
                  id="afterConstructedValue"
                  type="number"
                  value={application.propertyInfo?.afterConstructedValue || ''}
                  onChange={handleAfterConstructedValueChange}
                  placeholder="1000000"
                  className="w-full"
                />
              </div>

              {/* Stabilized Value */}
              <div className="space-y-2">
                <Label htmlFor="stabilizedValue">Stabilized Value</Label>
                <Input
                  id="stabilizedValue"
                  type="number"
                  value={application.propertyInfo?.stabilizedValue || ''}
                  onChange={handleStabilizedValueChange}
                  placeholder="1200000"
                  className="w-full"
                />
              </div>

              {/* Construction Time */}
              <div className="space-y-2">
                <Label htmlFor="constructionTime">Construction Time (months)</Label>
                <Input
                  id="constructionTime"
                  type="number"
                  value={application.propertyInfo?.constructionTime || ''}
                  onChange={handleConstructionTimeChange}
                  placeholder="6"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Loan Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Loan Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={application.loanDetails?.loanAmount || ''}
                  onChange={handleLoanAmountChange}
                  placeholder="300000"
                  className="w-full"
                />
              </div>

              {/* Purchase Price */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={application.loanDetails?.purchasePrice || ''}
                  onChange={handlePurchasePriceChange}
                  placeholder="400000"
                  className="w-full"
                />
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="transactionType">Transaction Type *</Label>
                <Select
                  value={application.loanDetails?.transactionType || ''}
                  onValueChange={handleTransactionTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requested Closing Date */}
              <div className="space-y-2">
                <Label htmlFor="closingDate">Requested Closing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !application.propertyInfo?.requestedClosingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {application.propertyInfo?.requestedClosingDate ? (
                        format(application.propertyInfo.requestedClosingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={application.propertyInfo?.requestedClosingDate}
                      onSelect={handleRequestedClosingDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={application.businessInfo?.companyName || ''}
                  onChange={handleCompanyNameChange}
                  placeholder="Real Estate Holdings LLC"
                  className="w-full"
                />
              </div>

              {/* Company EIN */}
              <div className="space-y-2">
                <Label htmlFor="companyEin">Company EIN</Label>
                <Input
                  id="companyEin"
                  value={application.businessInfo?.companyEin || ''}
                  onChange={handleCompanyEinChange}
                  placeholder="12-3456789"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handlePreviousPage(1)}
          disabled={true} // Can't go back from page 1
        >
          Previous
        </Button>
        
        <Button
          onClick={() => handleNextPage(1)}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Next Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Debug Information (remove in production) */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Application ID: {applicationId || 'New Application'}</p>
            <p>Status: {application.status}</p>
            <p>Created: {application.createdAt?.toString()}</p>
            <p>Last Updated: {application.updatedAt?.toString()}</p>
            <p>Progress: {getOverallProgress()}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
