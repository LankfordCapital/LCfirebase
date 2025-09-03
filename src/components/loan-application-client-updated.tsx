'use client';

import { useState, useEffect, useCallback, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2, Briefcase, FileUp, FileText, Layers, DollarSign, Truck, PlusCircle, Trash2 } from 'lucide-react';
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

type Dealer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Quote = {
  id: string;
  description: string;
  cost: string;
};

export function LoanApplicationClientUpdated({ 
  loanProgram, 
  officeContext = 'borrower',
  applicationId,
  borrowerId
}: { 
  loanProgram: string, 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string,
  borrowerId?: string
}) {
  // NEW: Use the comprehensive hook instead of individual state variables
  const { 
    application,
    saving,
    lastSaved,
    initializeApplication,
    updateField,
    updateFields,
    markPageCompleted,
    getApplicationData
  } = useGroundUpConstructionForm(applicationId);

  const router = useRouter();
  const { uploadDocument, documents } = useDocumentContext();

  // Initialize application when component mounts
  useEffect(() => {
    if (!application && loanProgram === 'residential-noo-ground-up-construction') {
      initializeApplication(borrowerId || 'default-broker-id');
    }
  }, [application, loanProgram, borrowerId, initializeApplication]);

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
    router.push(`${basePath}/application/${loanProgram}/page-${nextPage}`);
  };

  const handlePreviousPage = (currentPage: number) => {
    const previousPage = currentPage - 1;
    const basePath = getOfficeBasePath(officeContext);
    router.push(`${basePath}/application/${loanProgram}/page-${previousPage}`);
  };

  // ============================================================================
  // DOCUMENT UPLOAD HANDLERS
  // ============================================================================
  
  const handleDocumentUpload = async (documentType: string, file: File) => {
    try {
      const result = await uploadDocument(file);
      
      if (result.success) {
        // Update the document in the application
        const documentData = {
          name: documentType,
          fileUrl: result.url,
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
    } catch (error) {
      console.error('Document upload failed:', error);
    }
  };

  // ============================================================================
  // RENDER FORM FIELDS
  // ============================================================================
  
  if (!application) {
    return <div>Loading application...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Application Progress</span>
          <span>{application.progress?.overallProgress || 0}%</span>
        </div>
        <Progress value={application.progress?.overallProgress || 0} />
        {lastSaved && (
          <p className="text-xs text-green-600">
            Last saved: {lastSaved.toLocaleString()}
          </p>
        )}
      </div>

      {/* Page 1: Property & Loan Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property & Loan Information</CardTitle>
          <CardDescription>
            Enter the basic property and loan details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Property Address */}
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              value={application.propertyInfo?.propertyAddress || ''}
              onChange={handlePropertyAddressChange}
              placeholder="Enter property address"
            />
          </div>

          {/* Property APN */}
          <div className="space-y-2">
            <Label htmlFor="propertyApn">Property APN</Label>
            <Input
              id="propertyApn"
              value={application.propertyInfo?.propertyApn || ''}
              onChange={handlePropertyApnChange}
              placeholder="Enter APN number"
            />
          </div>

          {/* Annual Property Taxes */}
          <div className="space-y-2">
            <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
            <Input
              id="propertyTaxes"
              type="number"
              value={application.propertyInfo?.annualPropertyTaxes || ''}
              onChange={handlePropertyTaxesChange}
              placeholder="Enter annual property taxes"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
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

          {/* Loan Amount */}
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <Input
              id="loanAmount"
              type="number"
              value={application.loanDetails?.loanAmount || ''}
              onChange={handleLoanAmountChange}
              placeholder="Enter loan amount"
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
              placeholder="Enter purchase price"
            />
          </div>

          {/* As-Is Value */}
          <div className="space-y-2">
            <Label htmlFor="asIsValue">As-Is Value</Label>
            <Input
              id="asIsValue"
              type="number"
              value={application.propertyInfo?.asIsValue || ''}
              onChange={handleAsIsValueChange}
              placeholder="Enter as-is value"
            />
          </div>

          {/* After Constructed Value */}
          <div className="space-y-2">
            <Label htmlFor="afterConstructedValue">After Constructed Value</Label>
            <Input
              id="afterConstructedValue"
              type="number"
              value={application.propertyInfo?.afterConstructedValue || ''}
              onChange={handleAfterConstructedValueChange}
              placeholder="Enter after constructed value"
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
              placeholder="Enter stabilized value"
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
              placeholder="Enter square footage"
            />
          </div>

          {/* Lot Size */}
          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              value={application.propertyInfo?.lotSize || ''}
              onChange={handleLotSizeChange}
              placeholder="Enter lot size"
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
              placeholder="Enter construction time in months"
            />
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

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
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

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={application.businessInfo?.companyName || ''}
              onChange={handleCompanyNameChange}
              placeholder="Enter company name"
            />
          </div>

          {/* Company EIN */}
          <div className="space-y-2">
            <Label htmlFor="companyEin">Company EIN</Label>
            <Input
              id="companyEin"
              value={application.businessInfo?.companyEin || ''}
              onChange={handleCompanyEinChange}
              placeholder="Enter company EIN"
            />
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
    </div>
  );
}
