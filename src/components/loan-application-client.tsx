

'use client';

import { useState, useEffect, useCallback, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Calendar as CalendarIcon, Building2, Briefcase, FileUp, FileText, Layers, DollarSign, Truck, PlusCircle, Trash2, Eye } from 'lucide-react';
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
import { useLoanApplication } from '@/hooks/use-loan-application';
import { useResidentialNOOGroundUpConstructionState } from '@/hooks/use-residential-noo-ground-up-construction-state';
import { useAuth } from '@/contexts/auth-context';

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

// ============================================================================
// LOAN APPLICATION PAGE 1 DATA TYPES
// ============================================================================

export interface LoanApplicationPage1Data {
  // Core Property Information
  propertyAddress: string;
  propertyApn: string;
  propertyTaxes: number;
  propertyType: string;
  otherPropertyType?: string;
  propertySqFt: number;
  lotSize: string;
  
  // Loan Details
  loanAmount: number;
  transactionType: 'purchase' | 'refinance';
  
  // Transaction-specific data
  purchasePrice?: number;
  originalPurchasePrice?: number;
  purchaseDate?: Date;
  currentDebt?: number;
  
  // Property Values
  asIsValue: number;
  afterRepairValue?: number;
  afterConstructedValue?: number;
  stabilizedValue?: number;
  
  // Construction Details
  constructionTime?: number;
  requestedClosingDate?: Date;
  
  // Business Information
  companyName: string;
  companyEin: string;
  
  // Land Acquisition specific
  entitlementStatus?: string;
  developmentCosts?: number;
  afterDevelopmentValue?: number;
  
  // Mezzanine Loan specific
  seniorLoanAmount?: number;
  capitalStack?: string;
  
  // Mobilization Funding specific
  contractValue?: number;
  projectDescription?: string;
  clientName?: string;
  
  // Equipment Financing specific
  dealers?: Dealer[];
  quotes?: Quote[];
  
  // Documents uploaded on page 1
  documents: {
    purchaseContract?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    earnestMoneyDeposit?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    feasibilityStudy?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    zoningDocuments?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    environmentalReport?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    executedContract?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    useOfFunds?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    equipmentQuote?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    seniorDebtTermSheet?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    capitalStackOverview?: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    // Additional documents that might be uploaded
    [key: string]: {
      name: string;
      status: string;
      storagePath: string;
      downloadURL: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    } | undefined;
  };
}


export function LoanApplicationClient({ 
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
  // Get current user information
  const { user, userProfile } = useAuth();
  
  // Enhanced loan application hook
  const { 
    application, 
    loading, 
    saving, 
    updateField, 
    updateFields,
    createApplication 
  } = useLoanApplication(applicationId);

  // Check if this is a Ground Up Construction loan
  const isGroundUpConstruction = loanProgram.toLowerCase().includes('ground up construction');
  
  // Ground Up Construction state management
  const groundUpConstructionState = useResidentialNOOGroundUpConstructionState(
    application?.userId || 'QpEPcl01X4Moc1vZdhNcB3dtnQ22', // Use actual user ID from logs
    application?.brokerId || 'QpEPcl01X4Moc1vZdhNcB3dtnQ22' // Use actual broker ID from logs
  );

  // Populate form fields from Ground Up Construction state when available
  useEffect(() => {
    if (isGroundUpConstruction && groundUpConstructionState.application) {
      const app = groundUpConstructionState.application;
      console.log(`🏗️ [Ground Up Construction] ===== FORM POPULATION DEBUG START =====`);
      console.log(`🏗️ [Ground Up Construction] Full application state:`, app);
      console.log(`🏗️ [Ground Up Construction] Property Info:`, app.propertyInfo);
      console.log(`🏗️ [Ground Up Construction] Loan Details:`, app.loanDetails);
      console.log(`🏗️ [Ground Up Construction] Business Info:`, app.businessInfo);
      console.log(`🏗️ [Ground Up Construction] Property Address specifically:`, app.propertyInfo?.propertyAddress);
      console.log(`🏗️ [Ground Up Construction] Loan Amount specifically:`, app.loanDetails?.loanAmount);
      console.log(`🏗️ [Ground Up Construction] Company Name specifically:`, app.businessInfo?.companyName);
      
      // Always populate form fields from saved state
      console.log(`🏗️ [Ground Up Construction] --- POPULATING PROPERTY INFO ---`);
      if (app.propertyInfo?.propertyAddress) {
        console.log(`🏗️ [Ground Up Construction] Setting propertyAddress:`, app.propertyInfo.propertyAddress);
        setPropertyAddress(app.propertyInfo.propertyAddress);
      } else {
        console.log(`🏗️ [Ground Up Construction] No propertyAddress found in state`);
      }
      
      if (app.propertyInfo?.propertyApn) {
        console.log(`🏗️ [Ground Up Construction] Setting propertyApn:`, app.propertyInfo.propertyApn);
        setPropertyApn(app.propertyInfo.propertyApn);
      } else {
        console.log(`🏗️ [Ground Up Construction] No propertyApn found in state`);
      }
      
      if (app.propertyInfo?.annualPropertyTaxes) {
        console.log(`🏗️ [Ground Up Construction] Setting propertyTaxes:`, app.propertyInfo.annualPropertyTaxes);
        setPropertyTaxes(app.propertyInfo.annualPropertyTaxes.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No annualPropertyTaxes found in state`);
      }
      
      if (app.propertyInfo?.propertyType) {
        console.log(`🏗️ [Ground Up Construction] Setting propertyType:`, app.propertyInfo.propertyType);
        setPropertyType(app.propertyInfo.propertyType);
      } else {
        console.log(`🏗️ [Ground Up Construction] No propertyType found in state`);
      }
      
      if (app.propertyInfo?.asIsValue) {
        console.log(`🏗️ [Ground Up Construction] Setting asIsValue:`, app.propertyInfo.asIsValue);
        setAsIsValue(app.propertyInfo.asIsValue.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No asIsValue found in state`);
      }
      
      if (app.propertyInfo?.afterConstructedValue) {
        console.log(`🏗️ [Ground Up Construction] Setting afterConstructedValue:`, app.propertyInfo.afterConstructedValue);
        setAfterConstructedValue(app.propertyInfo.afterConstructedValue.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No afterConstructedValue found in state`);
      }
      
      if (app.propertyInfo?.stabilizedValue) {
        console.log(`🏗️ [Ground Up Construction] Setting stabilizedValue:`, app.propertyInfo.stabilizedValue);
        setStabilizedValue(app.propertyInfo.stabilizedValue.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No stabilizedValue found in state`);
      }
      
      if (app.propertyInfo?.propertySquareFootage) {
        console.log(`🏗️ [Ground Up Construction] Setting propertySqFt:`, app.propertyInfo.propertySquareFootage);
        setPropertySqFt(app.propertyInfo.propertySquareFootage.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No propertySquareFootage found in state`);
      }
      
      if (app.propertyInfo?.lotSize) {
        console.log(`🏗️ [Ground Up Construction] Setting lotSize:`, app.propertyInfo.lotSize);
        setLotSize(app.propertyInfo.lotSize);
      } else {
        console.log(`🏗️ [Ground Up Construction] No lotSize found in state`);
      }
      
      if (app.propertyInfo?.constructionTime) {
        console.log(`🏗️ [Ground Up Construction] Setting constructionTime:`, app.propertyInfo.constructionTime);
        setConstructionTime(app.propertyInfo.constructionTime.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No constructionTime found in state`);
      }
      
      if (app.propertyInfo?.requestedClosingDate) {
        const date = app.propertyInfo.requestedClosingDate;
        console.log(`🏗️ [Ground Up Construction] Setting requestedClosingDate:`, date);
        // Handle different date formats safely
        let dateObj: Date;
        if (date instanceof Date) {
          dateObj = date;
        } else if (typeof date === 'string') {
          dateObj = new Date(date);
        } else if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else {
          console.warn('Invalid date format for requestedClosingDate:', date);
          dateObj = new Date();
        }
        setRequestedClosingDate(dateObj);
      } else {
        console.log(`🏗️ [Ground Up Construction] No requestedClosingDate found in state`);
      }
      
      // Populate loan details
      console.log(`🏗️ [Ground Up Construction] --- POPULATING LOAN DETAILS ---`);
      if (app.loanDetails?.loanAmount) {
        console.log(`🏗️ [Ground Up Construction] Setting loanAmount:`, app.loanDetails.loanAmount);
        setLoanAmount(app.loanDetails.loanAmount.toString());
      } else {
        console.log(`🏗️ [Ground Up Construction] No loanAmount found in state`);
      }
      
      if (app.loanDetails?.transactionType) {
        console.log(`🏗️ [Ground Up Construction] Setting transactionType:`, app.loanDetails.transactionType);
        setTransactionType(app.loanDetails.transactionType);
      } else {
        console.log(`🏗️ [Ground Up Construction] No transactionType found in state`);
      }
      
      // Populate business info
      console.log(`🏗️ [Ground Up Construction] --- POPULATING BUSINESS INFO ---`);
      if (app.businessInfo?.companyName) {
        console.log(`🏗️ [Ground Up Construction] Setting companyName:`, app.businessInfo.companyName);
        setCompanyName(app.businessInfo.companyName);
      } else {
        console.log(`🏗️ [Ground Up Construction] No companyName found in state`);
      }
      
      if (app.businessInfo?.companyEin) {
        console.log(`🏗️ [Ground Up Construction] Setting companyEin:`, app.businessInfo.companyEin);
        setCompanyEin(app.businessInfo.companyEin);
      } else {
        console.log(`🏗️ [Ground Up Construction] No companyEin found in state`);
      }
      
      console.log(`🏗️ [Ground Up Construction] ===== FORM POPULATION DEBUG END =====`);
      
      // Debug: Check form field values after setting them
      setTimeout(() => {
        console.log(`🔍 [Ground Up Construction] Form field values after initial population:`);
        console.log(`  propertyAddress:`, propertyAddress);
        console.log(`  propertyApn:`, propertyApn);
        console.log(`  loanAmount:`, loanAmount);
        console.log(`  asIsValue:`, asIsValue);
        console.log(`  companyName:`, companyName);
      }, 100);
    }
  }, [isGroundUpConstruction]); // Remove groundUpConstructionState.application from dependencies to prevent infinite loop

  // Trigger form population when Ground Up Construction state changes (for navigation back)
  useEffect(() => {
    if (isGroundUpConstruction && groundUpConstructionState.application) {
      console.log(`🔄 [Ground Up Construction] ===== STATE CHANGE DEBUG START =====`);
      console.log(`🔄 [Ground Up Construction] State changed, refreshing form fields...`);
      const app = groundUpConstructionState.application;
      console.log(`🔄 [Ground Up Construction] Updated application state:`, app);
      console.log(`🔄 [Ground Up Construction] Property Info:`, app.propertyInfo);
      console.log(`🔄 [Ground Up Construction] Loan Details:`, app.loanDetails);
      console.log(`🔄 [Ground Up Construction] Business Info:`, app.businessInfo);
      console.log(`🔄 [Ground Up Construction] Property Address specifically:`, app.propertyInfo?.propertyAddress);
      console.log(`🔄 [Ground Up Construction] Loan Amount specifically:`, app.loanDetails?.loanAmount);
      console.log(`🔄 [Ground Up Construction] Company Name specifically:`, app.businessInfo?.companyName);
      
      // Always populate form fields from saved state
      console.log(`🔄 [Ground Up Construction] --- REFRESHING FORM FIELDS ---`);
      if (app.propertyInfo?.propertyAddress) {
        console.log(`🔄 [Ground Up Construction] Refreshing propertyAddress:`, app.propertyInfo.propertyAddress);
        setPropertyAddress(app.propertyInfo.propertyAddress);
      }
      if (app.propertyInfo?.propertyApn) {
        console.log(`🔄 [Ground Up Construction] Refreshing propertyApn:`, app.propertyInfo.propertyApn);
        setPropertyApn(app.propertyInfo.propertyApn);
      }
      if (app.propertyInfo?.annualPropertyTaxes) {
        console.log(`🔄 [Ground Up Construction] Refreshing propertyTaxes:`, app.propertyInfo.annualPropertyTaxes);
        setPropertyTaxes(app.propertyInfo.annualPropertyTaxes.toString());
      }
      if (app.propertyInfo?.propertyType) {
        console.log(`🔄 [Ground Up Construction] Refreshing propertyType:`, app.propertyInfo.propertyType);
        setPropertyType(app.propertyInfo.propertyType);
      }
      if (app.propertyInfo?.asIsValue) {
        console.log(`🔄 [Ground Up Construction] Refreshing asIsValue:`, app.propertyInfo.asIsValue);
        setAsIsValue(app.propertyInfo.asIsValue.toString());
      }
      if (app.propertyInfo?.afterConstructedValue) {
        console.log(`🔄 [Ground Up Construction] Refreshing afterConstructedValue:`, app.propertyInfo.afterConstructedValue);
        setAfterConstructedValue(app.propertyInfo.afterConstructedValue.toString());
      }
      if (app.propertyInfo?.stabilizedValue) {
        console.log(`🔄 [Ground Up Construction] Refreshing stabilizedValue:`, app.propertyInfo.stabilizedValue);
        setStabilizedValue(app.propertyInfo.stabilizedValue.toString());
      }
      if (app.propertyInfo?.propertySquareFootage) {
        console.log(`🔄 [Ground Up Construction] Refreshing propertySqFt:`, app.propertyInfo.propertySquareFootage);
        setPropertySqFt(app.propertyInfo.propertySquareFootage.toString());
      }
      if (app.propertyInfo?.lotSize) {
        console.log(`🔄 [Ground Up Construction] Refreshing lotSize:`, app.propertyInfo.lotSize);
        setLotSize(app.propertyInfo.lotSize);
      }
      if (app.propertyInfo?.constructionTime) {
        console.log(`🔄 [Ground Up Construction] Refreshing constructionTime:`, app.propertyInfo.constructionTime);
        setConstructionTime(app.propertyInfo.constructionTime.toString());
      }
      if (app.propertyInfo?.requestedClosingDate) {
        const date = app.propertyInfo.requestedClosingDate;
        console.log(`🔄 [Ground Up Construction] Refreshing requestedClosingDate:`, date);
        // Handle different date formats safely
        let dateObj: Date;
        if (date instanceof Date) {
          dateObj = date;
        } else if (typeof date === 'string') {
          dateObj = new Date(date);
        } else if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else {
          console.warn('Invalid date format for requestedClosingDate:', date);
          dateObj = new Date();
        }
        setRequestedClosingDate(dateObj);
      }
      if (app.loanDetails?.loanAmount) {
        console.log(`🔄 [Ground Up Construction] Refreshing loanAmount:`, app.loanDetails.loanAmount);
        setLoanAmount(app.loanDetails.loanAmount.toString());
      }
      if (app.loanDetails?.transactionType) {
        console.log(`🔄 [Ground Up Construction] Refreshing transactionType:`, app.loanDetails.transactionType);
        setTransactionType(app.loanDetails.transactionType);
      }
      if (app.businessInfo?.companyName) {
        console.log(`🔄 [Ground Up Construction] Refreshing companyName:`, app.businessInfo.companyName);
        setCompanyName(app.businessInfo.companyName);
      }
      if (app.businessInfo?.companyEin) {
        console.log(`🔄 [Ground Up Construction] Refreshing companyEin:`, app.businessInfo.companyEin);
        setCompanyEin(app.businessInfo.companyEin);
      }
      
      console.log(`🔄 [Ground Up Construction] ===== STATE CHANGE DEBUG END =====`);
      
      // Debug: Check form field values after setting them
      setTimeout(() => {
        console.log(`🔍 [Ground Up Construction] Form field values after population:`);
        console.log(`  propertyAddress:`, propertyAddress);
        console.log(`  propertyApn:`, propertyApn);
        console.log(`  loanAmount:`, loanAmount);
        console.log(`  asIsValue:`, asIsValue);
        console.log(`  companyName:`, companyName);
      }, 100);
    }
  }, [isGroundUpConstruction, groundUpConstructionState.application?.updatedAt]); // Only trigger when state actually changes

  // Initialize Ground Up Construction state with existing application data
  useEffect(() => {
    if (isGroundUpConstruction && application && groundUpConstructionState.application) {
      console.log(`🏗️ [Ground Up Construction] Initializing state with existing application data...`);
      
      // Only initialize if the Ground Up Construction state is empty
      const currentState = groundUpConstructionState.application;
      if (!currentState.propertyInfo?.propertyAddress && application.propertyInfo?.propertyAddress) {
        groundUpConstructionState.updateField('propertyInfo.propertyAddress', application.propertyInfo.propertyAddress);
      }
      if (!currentState.propertyInfo?.propertyApn && application.propertyInfo?.propertyApn) {
        groundUpConstructionState.updateField('propertyInfo.propertyApn', application.propertyInfo.propertyApn);
      }
      if (!currentState.propertyInfo?.annualPropertyTaxes && application.propertyInfo?.annualPropertyTaxes) {
        groundUpConstructionState.updateField('propertyInfo.annualPropertyTaxes', application.propertyInfo.annualPropertyTaxes);
      }
      if (!currentState.loanDetails?.loanAmount && application.loanDetails?.loanAmount) {
        groundUpConstructionState.updateField('loanDetails.loanAmount', application.loanDetails.loanAmount);
      }
      if (!currentState.businessInfo?.companyName && application.businessInfo?.companyName) {
        groundUpConstructionState.updateField('businessInfo.companyName', application.businessInfo.companyName);
      }
      if (!currentState.businessInfo?.companyEin && application.businessInfo?.companyEin) {
        groundUpConstructionState.updateField('businessInfo.companyEin', application.businessInfo.companyEin);
      }
      
      console.log(`✅ [Ground Up Construction] State initialized with existing data!`);
    }
  }, [isGroundUpConstruction, application?.id]); // Only run when application ID changes

  // Function to manually refresh form fields from Ground Up Construction state
  const refreshFormFromTypedState = useCallback(() => {
    if (isGroundUpConstruction && groundUpConstructionState.application) {
      console.log(`🔄 [Ground Up Construction] ===== MANUAL REFRESH DEBUG START =====`);
      console.log(`🔄 [Ground Up Construction] Manually refreshing form fields...`);
      groundUpConstructionState.logCurrentState();
      
      const app = groundUpConstructionState.application;
      console.log(`🔄 [Ground Up Construction] Manual refresh - Full application state:`, app);
      console.log(`🔄 [Ground Up Construction] Manual refresh - Property Info:`, app.propertyInfo);
      console.log(`🔄 [Ground Up Construction] Manual refresh - Loan Details:`, app.loanDetails);
      console.log(`🔄 [Ground Up Construction] Manual refresh - Business Info:`, app.businessInfo);
      
      // Always populate form fields from saved state
      console.log(`🔄 [Ground Up Construction] --- MANUAL REFRESH FORM FIELDS ---`);
      if (app.propertyInfo?.propertyAddress) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting propertyAddress:`, app.propertyInfo.propertyAddress);
        setPropertyAddress(app.propertyInfo.propertyAddress);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No propertyAddress found`);
      }
      if (app.propertyInfo?.propertyApn) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting propertyApn:`, app.propertyInfo.propertyApn);
        setPropertyApn(app.propertyInfo.propertyApn);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No propertyApn found`);
      }
      if (app.propertyInfo?.annualPropertyTaxes) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting propertyTaxes:`, app.propertyInfo.annualPropertyTaxes);
        setPropertyTaxes(app.propertyInfo.annualPropertyTaxes.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No annualPropertyTaxes found`);
      }
      if (app.propertyInfo?.propertyType) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting propertyType:`, app.propertyInfo.propertyType);
        setPropertyType(app.propertyInfo.propertyType);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No propertyType found`);
      }
      if (app.propertyInfo?.asIsValue) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting asIsValue:`, app.propertyInfo.asIsValue);
        setAsIsValue(app.propertyInfo.asIsValue.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No asIsValue found`);
      }
      if (app.propertyInfo?.afterConstructedValue) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting afterConstructedValue:`, app.propertyInfo.afterConstructedValue);
        setAfterConstructedValue(app.propertyInfo.afterConstructedValue.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No afterConstructedValue found`);
      }
      if (app.propertyInfo?.stabilizedValue) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting stabilizedValue:`, app.propertyInfo.stabilizedValue);
        setStabilizedValue(app.propertyInfo.stabilizedValue.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No stabilizedValue found`);
      }
      if (app.propertyInfo?.propertySquareFootage) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting propertySqFt:`, app.propertyInfo.propertySquareFootage);
        setPropertySqFt(app.propertyInfo.propertySquareFootage.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No propertySquareFootage found`);
      }
      if (app.propertyInfo?.lotSize) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting lotSize:`, app.propertyInfo.lotSize);
        setLotSize(app.propertyInfo.lotSize);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No lotSize found`);
      }
      if (app.propertyInfo?.constructionTime) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting constructionTime:`, app.propertyInfo.constructionTime);
        setConstructionTime(app.propertyInfo.constructionTime.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No constructionTime found`);
      }
      if (app.propertyInfo?.requestedClosingDate) {
        const date = app.propertyInfo.requestedClosingDate;
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting requestedClosingDate:`, date);
        // Handle different date formats safely
        let dateObj: Date;
        if (date instanceof Date) {
          dateObj = date;
        } else if (typeof date === 'string') {
          dateObj = new Date(date);
        } else if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else {
          console.warn('Invalid date format for requestedClosingDate:', date);
          dateObj = new Date();
        }
        setRequestedClosingDate(dateObj);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No requestedClosingDate found`);
      }
      
      // Populate loan details
      console.log(`🔄 [Ground Up Construction] --- MANUAL REFRESH LOAN DETAILS ---`);
      if (app.loanDetails?.loanAmount) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting loanAmount:`, app.loanDetails.loanAmount);
        setLoanAmount(app.loanDetails.loanAmount.toString());
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No loanAmount found`);
      }
      if (app.loanDetails?.transactionType) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting transactionType:`, app.loanDetails.transactionType);
        setTransactionType(app.loanDetails.transactionType);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No transactionType found`);
      }
      
      // Populate business info
      console.log(`🔄 [Ground Up Construction] --- MANUAL REFRESH BUSINESS INFO ---`);
      if (app.businessInfo?.companyName) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting companyName:`, app.businessInfo.companyName);
        setCompanyName(app.businessInfo.companyName);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No companyName found`);
      }
      if (app.businessInfo?.companyEin) {
        console.log(`🔄 [Ground Up Construction] Manual refresh - Setting companyEin:`, app.businessInfo.companyEin);
        setCompanyEin(app.businessInfo.companyEin);
      } else {
        console.log(`🔄 [Ground Up Construction] Manual refresh - No companyEin found`);
      }
      
      console.log(`🔄 [Ground Up Construction] ===== MANUAL REFRESH DEBUG END =====`);
    }
  }, [isGroundUpConstruction, groundUpConstructionState]);
  // Property Information
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyApn, setPropertyApn] = useState('');
  const [propertyTaxes, setPropertyTaxes] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [rehabCost, setRehabCost] = useState('');
  const [asIsValue, setAsIsValue] = useState('');
  const [afterRepairValue, setAfterRepairValue] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [propertySqFt, setPropertySqFt] = useState('');
  const [constructionTime, setConstructionTime] = useState('');
  const [requestedClosingDate, setRequestedClosingDate] = useState<Date>();
  const [transactionType, setTransactionType] = useState('purchase');
  const [originalPurchasePrice, setOriginalPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [currentDebt, setCurrentDebt] = useState('');
  const [afterConstructedValue, setAfterConstructedValue] = useState('');
  const [stabilizedValue, setStabilizedValue] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [otherPropertyType, setOtherPropertyType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEin, setCompanyEin] = useState('');

  // Land Acquisition specific fields
  const [entitlementStatus, setEntitlementStatus] = useState('');
  const [developmentCosts, setDevelopmentCosts] = useState('');
  const [afterDevelopmentValue, setAfterDevelopmentValue] = useState('');

  // Mezzanine Loan specific fields
  const [seniorLoanAmount, setSeniorLoanAmount] = useState('');
  const [capitalStack, setCapitalStack] = useState('');
  
  // Mobilization Funding specific fields
  const [contractValue, setContractValue] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [clientName, setClientName] = useState('');

  // Equipment Financing specific fields
  const dealerId = useId();
  const quoteId = useId();
  const [dealers, setDealers] = useState<Dealer[]>([{ id: dealerId, name: '', phone: '', email: '', address: '' }]);
  const [quotes, setQuotes] = useState<Quote[]>([{ id: quoteId, description: '', cost: ''}]);


  const { documents, addDocument, restoreDocument, updateDocumentStatus } = useDocumentContext();
  const router = useRouter();
  
  // ============================================================================
  // LOCAL STORAGE FOR PAGE 1 DATA
  // ============================================================================
  
  const [page1LocalData, setPage1LocalData] = useState<LoanApplicationPage1Data | null>(null);
  
  // Save page 1 data to local storage
  const savePage1ToLocal = (data: LoanApplicationPage1Data) => {
    console.log('💾 Saving Page 1 data to local storage:', data);
    console.log('💾 Purchase price being saved:', data.purchasePrice);
    setPage1LocalData(data);
    // Also save to sessionStorage for persistence across page refreshes
    sessionStorage.setItem('loanApplicationPage1Data', JSON.stringify(data));
    console.log('✅ Page 1 data saved to both state and sessionStorage');
  };
  
  // Load page 1 data from local storage
  const loadPage1FromLocal = (): LoanApplicationPage1Data | null => {
    console.log('🔍 Checking for local Page 1 data...');
    console.log('🔍 Current page1LocalData state:', page1LocalData);
    
    // First try to get from state
    if (page1LocalData) {
      console.log('📥 Loading Page 1 data from state:', page1LocalData);
      console.log('📥 Purchase price from state:', page1LocalData.purchasePrice);
      return page1LocalData;
    }
    
    // Then try to get from sessionStorage
    try {
      const stored = sessionStorage.getItem('loanApplicationPage1Data');
      console.log('🔍 Raw sessionStorage data:', stored);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📥 Loading Page 1 data from sessionStorage:', data);
        console.log('📥 Purchase price from sessionStorage:', data.purchasePrice);
        setPage1LocalData(data);
        return data;
      }
    } catch (error) {
      console.error('❌ Error loading from sessionStorage:', error);
    }
    
    console.log('ℹ️ No Page 1 data found in local storage');
    return null;
  };
  
  // Clear page 1 data from local storage
  const clearPage1LocalData = () => {
    console.log('🗑️ Clearing Page 1 local data...');
    setPage1LocalData(null);
    sessionStorage.removeItem('loanApplicationPage1Data');
  };
  
  // Restore documents to document context
  const restoreDocumentsToContext = (documentsData: LoanApplicationPage1Data['documents']) => {
    console.log('🔄 Restoring documents to context:', documentsData);
    
    // Create a mapping of document names to their data
    const documentMapping: { [key: string]: any } = {
      'Executed Purchase Contract': documentsData.purchaseContract,
      'Evidence of Earnest Money Deposit': documentsData.earnestMoneyDeposit,
      'Feasibility Study': documentsData.feasibilityStudy,
      'Zoning and Entitlement Documents': documentsData.zoningDocuments,
      'Environmental Report': documentsData.environmentalReport,
      'Executed Contract for the project': documentsData.executedContract,
      'Detailed Use of Funds': documentsData.useOfFunds,
      'Equipment Quote or Invoice #1': documentsData.equipmentQuote,
      'Senior Debt Term Sheet': documentsData.seniorDebtTermSheet,
      'Capital Stack overview': documentsData.capitalStackOverview,
    };
    
    // Restore each document to the context
    Object.entries(documentMapping).forEach(([docName, docData]) => {
      if (docData) {
        console.log(`📄 Restoring document: ${docName}`, docData);
        // Restore the full document data to the context
        restoreDocument(docName, {
          name: docData.name,
          status: docData.status,
          storagePath: docData.storagePath,
          downloadURL: docData.downloadURL,
          fileName: docData.fileName,
          fileSize: docData.fileSize,
          mimeType: docData.mimeType,
        });
      }
    });
  };

  // Apply page 1 data to form fields
  const applyPage1DataToForm = (data: LoanApplicationPage1Data) => {
    console.log('🔄 Applying Page 1 data to form fields:', data);
    console.log('🔄 Setting purchase price to:', data.purchasePrice?.toString() || '');
    
    // Core Property Information
    setPropertyAddress(data.propertyAddress || '');
    setPropertyApn(data.propertyApn || '');
    setPropertyTaxes(data.propertyTaxes?.toString() || '');
    setPropertyType(data.propertyType || '');
    setOtherPropertyType(data.otherPropertyType || '');
    setPropertySqFt(data.propertySqFt?.toString() || '');
    setLotSize(data.lotSize || '');
    
    // Loan Details
    setLoanAmount(data.loanAmount?.toString() || '');
    setTransactionType(data.transactionType || 'purchase');
    
    // Transaction-specific data
    setPurchasePrice(data.purchasePrice?.toString() || '');
    setOriginalPurchasePrice(data.originalPurchasePrice?.toString() || '');
    setCurrentDebt(data.currentDebt?.toString() || '');
    setPurchaseDate(data.purchaseDate);
    
    // Property Values
    setAsIsValue(data.asIsValue?.toString() || '');
    setAfterRepairValue(data.afterRepairValue?.toString() || '');
    setAfterConstructedValue(data.afterConstructedValue?.toString() || '');
    setStabilizedValue(data.stabilizedValue?.toString() || '');
    
    // Construction Details
    setConstructionTime(data.constructionTime?.toString() || '');
    setRequestedClosingDate(data.requestedClosingDate);
    
    // Business Information
    setCompanyName(data.companyName || '');
    setCompanyEin(data.companyEin || '');
    
    // Land Acquisition specific
    setEntitlementStatus(data.entitlementStatus || '');
    setDevelopmentCosts(data.developmentCosts?.toString() || '');
    setAfterDevelopmentValue(data.afterDevelopmentValue?.toString() || '');
    
    // Mezzanine Loan specific
    setSeniorLoanAmount(data.seniorLoanAmount?.toString() || '');
    setCapitalStack(data.capitalStack || '');
    
    // Mobilization Funding specific
    setContractValue(data.contractValue?.toString() || '');
    setProjectDescription(data.projectDescription || '');
    setClientName(data.clientName || '');
    
    // Equipment Financing specific
    if (data.dealers && data.dealers.length > 0) {
      setDealers(data.dealers);
    }
    if (data.quotes && data.quotes.length > 0) {
      setQuotes(data.quotes);
    }
    
    // Restore documents to document context
    restoreDocumentsToContext(data.documents);
    
    console.log('✅ Page 1 data applied to form fields successfully');
  };
  
  // ============================================================================
  // HELPER FUNCTION TO COLLECT ALL PAGE 1 DATA
  // ============================================================================
  
  const collectPage1Data = (): LoanApplicationPage1Data => {
    const isIndustrial = loanProgram.toLowerCase().includes('industrial');
    const isLandAcquisition = loanProgram.toLowerCase().includes('land acquisition');
    const isMezzanine = loanProgram.toLowerCase().includes('mezzanine');
    const isMobilization = loanProgram.toLowerCase().includes('mobilization funding');
    const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');
    
    // Base data structure
    const page1Data: LoanApplicationPage1Data = {
      // Core Property Information
      propertyAddress,
      propertyApn,
      propertyTaxes: parseFloat(propertyTaxes) || 0,
      propertyType: propertyType || 'multi-family',
      otherPropertyType: propertyType === 'other' ? otherPropertyType : undefined,
      propertySqFt: parseFloat(propertySqFt) || 0,
      lotSize,
      
      // Loan Details
      loanAmount: parseFloat(loanAmount) || 0,
      transactionType: transactionType as 'purchase' | 'refinance',
      
      // Property Values
      asIsValue: parseFloat(asIsValue) || 0,
      afterRepairValue: parseFloat(afterRepairValue) || undefined,
      afterConstructedValue: parseFloat(afterConstructedValue) || undefined,
      stabilizedValue: parseFloat(stabilizedValue) || undefined,
      
      // Construction Details
      constructionTime: parseFloat(constructionTime) || undefined,
      requestedClosingDate,
      
      // Business Information
      companyName,
      companyEin,
      
      // Documents tracking - save actual document data
      documents: {
        purchaseContract: documents['Executed Purchase Contract'] ? {
          name: documents['Executed Purchase Contract'].name,
          status: documents['Executed Purchase Contract'].status,
          storagePath: documents['Executed Purchase Contract'].storagePath,
          downloadURL: documents['Executed Purchase Contract'].downloadURL,
          fileName: documents['Executed Purchase Contract'].file?.name,
          fileSize: documents['Executed Purchase Contract'].file?.size,
          mimeType: documents['Executed Purchase Contract'].file?.type,
        } : undefined,
        earnestMoneyDeposit: documents['Evidence of Earnest Money Deposit'] ? {
          name: documents['Evidence of Earnest Money Deposit'].name,
          status: documents['Evidence of Earnest Money Deposit'].status,
          storagePath: documents['Evidence of Earnest Money Deposit'].storagePath,
          downloadURL: documents['Evidence of Earnest Money Deposit'].downloadURL,
          fileName: documents['Evidence of Earnest Money Deposit'].file?.name,
          fileSize: documents['Evidence of Earnest Money Deposit'].file?.size,
          mimeType: documents['Evidence of Earnest Money Deposit'].file?.type,
        } : undefined,
        feasibilityStudy: documents['Feasibility Study'] ? {
          name: documents['Feasibility Study'].name,
          status: documents['Feasibility Study'].status,
          storagePath: documents['Feasibility Study'].storagePath,
          downloadURL: documents['Feasibility Study'].downloadURL,
          fileName: documents['Feasibility Study'].file?.name,
          fileSize: documents['Feasibility Study'].file?.size,
          mimeType: documents['Feasibility Study'].file?.type,
        } : undefined,
        zoningDocuments: documents['Zoning and Entitlement Documents'] ? {
          name: documents['Zoning and Entitlement Documents'].name,
          status: documents['Zoning and Entitlement Documents'].status,
          storagePath: documents['Zoning and Entitlement Documents'].storagePath,
          downloadURL: documents['Zoning and Entitlement Documents'].downloadURL,
          fileName: documents['Zoning and Entitlement Documents'].file?.name,
          fileSize: documents['Zoning and Entitlement Documents'].file?.size,
          mimeType: documents['Zoning and Entitlement Documents'].file?.type,
        } : undefined,
        environmentalReport: documents['Environmental Report'] ? {
          name: documents['Environmental Report'].name,
          status: documents['Environmental Report'].status,
          storagePath: documents['Environmental Report'].storagePath,
          downloadURL: documents['Environmental Report'].downloadURL,
          fileName: documents['Environmental Report'].file?.name,
          fileSize: documents['Environmental Report'].file?.size,
          mimeType: documents['Environmental Report'].file?.type,
        } : undefined,
        executedContract: documents['Executed Contract for the project'] ? {
          name: documents['Executed Contract for the project'].name,
          status: documents['Executed Contract for the project'].status,
          storagePath: documents['Executed Contract for the project'].storagePath,
          downloadURL: documents['Executed Contract for the project'].downloadURL,
          fileName: documents['Executed Contract for the project'].file?.name,
          fileSize: documents['Executed Contract for the project'].file?.size,
          mimeType: documents['Executed Contract for the project'].file?.type,
        } : undefined,
        useOfFunds: documents['Detailed Use of Funds'] ? {
          name: documents['Detailed Use of Funds'].name,
          status: documents['Detailed Use of Funds'].status,
          storagePath: documents['Detailed Use of Funds'].storagePath,
          downloadURL: documents['Detailed Use of Funds'].downloadURL,
          fileName: documents['Detailed Use of Funds'].file?.name,
          fileSize: documents['Detailed Use of Funds'].file?.size,
          mimeType: documents['Detailed Use of Funds'].file?.type,
        } : undefined,
        equipmentQuote: documents['Equipment Quote or Invoice #1'] ? {
          name: documents['Equipment Quote or Invoice #1'].name,
          status: documents['Equipment Quote or Invoice #1'].status,
          storagePath: documents['Equipment Quote or Invoice #1'].storagePath,
          downloadURL: documents['Equipment Quote or Invoice #1'].downloadURL,
          fileName: documents['Equipment Quote or Invoice #1'].file?.name,
          fileSize: documents['Equipment Quote or Invoice #1'].file?.size,
          mimeType: documents['Equipment Quote or Invoice #1'].file?.type,
        } : undefined,
        seniorDebtTermSheet: documents['Senior Debt Term Sheet'] ? {
          name: documents['Senior Debt Term Sheet'].name,
          status: documents['Senior Debt Term Sheet'].status,
          storagePath: documents['Senior Debt Term Sheet'].storagePath,
          downloadURL: documents['Senior Debt Term Sheet'].downloadURL,
          fileName: documents['Senior Debt Term Sheet'].file?.name,
          fileSize: documents['Senior Debt Term Sheet'].file?.size,
          mimeType: documents['Senior Debt Term Sheet'].file?.type,
        } : undefined,
        capitalStackOverview: documents['Capital Stack overview'] ? {
          name: documents['Capital Stack overview'].name,
          status: documents['Capital Stack overview'].status,
          storagePath: documents['Capital Stack overview'].storagePath,
          downloadURL: documents['Capital Stack overview'].downloadURL,
          fileName: documents['Capital Stack overview'].file?.name,
          fileSize: documents['Capital Stack overview'].file?.size,
          mimeType: documents['Capital Stack overview'].file?.type,
        } : undefined,
      }
    };
    
    // Transaction-specific data
    // Always save purchase price regardless of transaction type
    page1Data.purchasePrice = parseFloat(purchasePrice) || undefined;
    
    if (transactionType === 'purchase') {
      // Purchase-specific fields (purchasePrice already saved above)
    } else if (transactionType === 'refinance') {
      page1Data.originalPurchasePrice = parseFloat(originalPurchasePrice) || undefined;
      page1Data.purchaseDate = purchaseDate;
      page1Data.currentDebt = parseFloat(currentDebt) || undefined;
    }
    
    // Land Acquisition specific fields
    if (isLandAcquisition) {
      page1Data.entitlementStatus = entitlementStatus;
      page1Data.developmentCosts = parseFloat(developmentCosts) || undefined;
      page1Data.afterDevelopmentValue = parseFloat(afterDevelopmentValue) || undefined;
    }
    
    // Mezzanine Loan specific fields
    if (isMezzanine) {
      page1Data.seniorLoanAmount = parseFloat(seniorLoanAmount) || undefined;
      page1Data.capitalStack = capitalStack;
    }
    
    // Mobilization Funding specific fields
    if (isMobilization) {
      page1Data.contractValue = parseFloat(contractValue) || undefined;
      page1Data.projectDescription = projectDescription;
      page1Data.clientName = clientName;
    }
    
    // Equipment Financing specific fields
    if (isEquipmentFinancing) {
      page1Data.dealers = dealers.filter(dealer => 
        dealer.name || dealer.phone || dealer.email || dealer.address
      );
      page1Data.quotes = quotes.filter(quote => 
        quote.description || quote.cost
      );
    }
    
    return page1Data;
  };
  
  // ============================================================================
  // SAVE PAGE 1 DATA FUNCTION
  // ============================================================================
  
  const savePage1Data = async (page1Data: LoanApplicationPage1Data) => {
    try {
      console.log('💾 Saving Page 1 Data:', page1Data);
      
      if (applicationId) {
        // Update existing application
        const updates = {
          // Property Information
          'propertyInfo.propertyAddress': page1Data.propertyAddress,
          'propertyInfo.propertyApn': page1Data.propertyApn,
          'propertyInfo.annualPropertyTaxes': page1Data.propertyTaxes,
          'propertyInfo.propertyType': page1Data.propertyType,
          'propertyInfo.otherPropertyType': page1Data.otherPropertyType,
          'propertyInfo.propertySquareFootage': page1Data.propertySqFt,
          'propertyInfo.lotSize': page1Data.lotSize,
          'propertyInfo.asIsValue': page1Data.asIsValue,
          'propertyInfo.afterRepairValue': page1Data.afterRepairValue,
          'propertyInfo.afterConstructedValue': page1Data.afterConstructedValue,
          'propertyInfo.stabilizedValue': page1Data.stabilizedValue,
          'propertyInfo.constructionTime': page1Data.constructionTime,
          'propertyInfo.requestedClosingDate': page1Data.requestedClosingDate,
          
          // Loan Details
          'loanDetails.loanAmount': page1Data.loanAmount,
          'loanDetails.transactionType': page1Data.transactionType,
          'loanDetails.purchasePrice': page1Data.purchasePrice,
          'loanDetails.originalPurchasePrice': page1Data.originalPurchasePrice,
          'loanDetails.purchaseDate': page1Data.purchaseDate,
          'loanDetails.currentDebt': page1Data.currentDebt,
          
          // Business Information
          'businessInfo.companyName': page1Data.companyName,
          'businessInfo.companyEin': page1Data.companyEin,
          
          // Program-specific fields
          ...(page1Data.entitlementStatus && { 'landAcquisitionInfo.entitlementStatus': page1Data.entitlementStatus }),
          ...(page1Data.developmentCosts && { 'landAcquisitionInfo.developmentCosts': page1Data.developmentCosts }),
          ...(page1Data.afterDevelopmentValue && { 'landAcquisitionInfo.afterDevelopmentValue': page1Data.afterDevelopmentValue }),
          ...(page1Data.seniorLoanAmount && { 'mezzanineInfo.seniorLoanAmount': page1Data.seniorLoanAmount }),
          ...(page1Data.capitalStack && { 'mezzanineInfo.capitalStack': page1Data.capitalStack }),
          ...(page1Data.contractValue && { 'mobilizationInfo.contractValue': page1Data.contractValue }),
          ...(page1Data.projectDescription && { 'mobilizationInfo.projectDescription': page1Data.projectDescription }),
          ...(page1Data.clientName && { 'mobilizationInfo.clientName': page1Data.clientName }),
          ...(page1Data.dealers && { 'equipmentInfo.dealers': page1Data.dealers }),
          ...(page1Data.quotes && { 'equipmentInfo.quotes': page1Data.quotes }),
          
          // Progress tracking
          'progress.propertyInfoCompleted': true,
          'progress.loanDetailsCompleted': true,
          'progress.businessInfoCompleted': true,
          'updatedAt': new Date(),
        };
        
        await updateFields(updates);
        console.log('✅ Page 1 data saved successfully');
      } else {
        console.log('⚠️ No application ID - cannot save data');
      }
    } catch (error) {
      console.error('❌ Error saving Page 1 data:', error);
      throw error;
    }
  };
  
  const handleContinue = async () => {
    try {
      console.log('🚀 Starting Page 1 Continue Process...');
      
      // Collect all page 1 data
      const page1Data = collectPage1Data();
      console.log('📊 Collected Page 1 Data:', page1Data);
      
      // Validate the data
      const validation = validatePage1Data(page1Data);
      if (!validation.isValid) {
        console.error('❌ Validation failed:', validation.errors);
        // You might want to show a toast notification here
        // toast({
        //   variant: 'destructive',
        //   title: 'Validation Error',
        //   description: validation.errors.join(', '),
        // });
        return; // Don't proceed if validation fails
      }
      
      console.log('✅ Page 1 data validation passed');
      
      // Save to local storage instead of database
      savePage1ToLocal(page1Data);
      
      // Special handling for Ground Up Construction loans
      if (isGroundUpConstruction) {
        console.log(`🏗️ [Ground Up Construction] Updating typed state...`);
        const groundUpData = {
          'propertyInfo.propertyAddress': page1Data.propertyAddress,
          'propertyInfo.propertyApn': page1Data.propertyApn,
          'propertyInfo.annualPropertyTaxes': page1Data.propertyTaxes,
          'propertyInfo.propertyType': page1Data.propertyType,
          'propertyInfo.asIsValue': page1Data.asIsValue,
          'propertyInfo.afterConstructedValue': page1Data.afterConstructedValue,
          'propertyInfo.stabilizedValue': page1Data.stabilizedValue,
          'propertyInfo.propertySquareFootage': page1Data.propertySqFt,
          'propertyInfo.lotSize': page1Data.lotSize,
          'propertyInfo.constructionTime': page1Data.constructionTime,
          'propertyInfo.requestedClosingDate': page1Data.requestedClosingDate,
          'loanDetails.loanAmount': page1Data.loanAmount,
          'loanDetails.transactionType': page1Data.transactionType,
          'businessInfo.companyName': page1Data.companyName,
          'businessInfo.companyEin': page1Data.companyEin,
        };
        
        groundUpConstructionState.updateMultipleFields(groundUpData);
        console.log(`🏗️ [Ground Up Construction] Typed state updated`);
      }
      
      console.log('✅ Page 1 data saved to local storage successfully, navigating to page 2...');
      
      // Navigate to page 2
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    const urlParams = new URLSearchParams(window.location.search);
    const paramString = urlParams.toString();
    
    // Get the current office context from the URL
    const currentOfficeContext = getOfficeContextFromUrl();
    const basePath = getOfficeBasePath(currentOfficeContext);
    
    router.push(`${basePath}/${programSlug}/page-2${paramString ? `?${paramString}` : ''}`);
      
    } catch (error) {
      console.error('❌ Error in handleContinue:', error);
      // You might want to show a toast notification here
      // toast({
      //   variant: 'destructive',
      //   title: 'Error',
      //   description: 'Failed to save page 1 data. Please try again.',
      // });
    }
  };
  
  const handleFileChange = useCallback(async (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addDocument({
            name: itemName,
            file,
        });
    }
  }, [addDocument]);
  
  const handleAddDealer = () => {
    setDealers([...dealers, { id: `dealer-${Date.now()}`, name: '', phone: '', email: '', address: '' }]);
  };

  const handleRemoveDealer = (id: string) => {
      setDealers(dealers.filter(d => d.id !== id));
  };

  const handleDealerChange = (id: string, field: keyof Omit<Dealer, 'id'>, value: string) => {
      setDealers(dealers.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleAddQuote = () => {
      setQuotes([...quotes, { id: `quote-${Date.now()}`, description: '', cost: '' }]);
  };

  const handleRemoveQuote = (id: string) => {
      setQuotes(quotes.filter(q => q.id !== id));
  };

  const handleQuoteChange = (id: string, field: keyof Omit<Quote, 'id'>, value: string) => {
      setQuotes(quotes.map(q => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const DocumentUploadInput = ({ name }: { name: string }) => {
    const doc = documents[name];
    const fileInputId = `upload-${name.replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col gap-2 p-3 rounded-md border">
        <div className="flex items-center gap-3">
          {doc?.status === 'uploaded' && <FileUp className="h-5 w-5 text-blue-500" />}
          {!doc && <FileText className="h-5 w-5 text-muted-foreground" />}
          <Label htmlFor={fileInputId} className="font-medium">{name}</Label>
        </div>
        
        {doc?.status === 'uploaded' ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">✓ Uploaded</span>
            {doc.fileName && (
              <span className="text-sm text-muted-foreground">({doc.fileName})</span>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(doc.downloadURL, '_blank')}
              className="ml-auto"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Remove document from context
                updateDocumentStatus(name, 'missing');
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
        </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Input 
              id={fileInputId} 
              type="file" 
              className="w-full" 
              onChange={(e) => handleFileChange(name, e)} 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        )}
      </div>
    );
  };

  const isIndustrial = loanProgram.toLowerCase().includes('industrial');
  const isLandAcquisition = loanProgram.toLowerCase().includes('land acquisition');
  const isMezzanine = loanProgram.toLowerCase().includes('mezzanine');
  const isMobilization = loanProgram.toLowerCase().includes('mobilization funding');
  const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');


  // ============================================================================
  // VALIDATION FUNCTION
  // ============================================================================
  
  const validatePage1Data = (data: LoanApplicationPage1Data): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Core required fields
    if (!data.propertyAddress.trim()) errors.push('Property address is required');
    if (!data.loanAmount || data.loanAmount <= 0) errors.push('Loan amount is required and must be greater than 0');
    if (!data.propertyType) errors.push('Property type is required');
    if (!data.companyName.trim()) errors.push('Company name is required');
    if (!data.companyEin.trim()) errors.push('Company EIN is required');
    
    // Transaction-specific validation
    if (data.transactionType === 'purchase' && (!data.purchasePrice || data.purchasePrice <= 0)) {
      errors.push('Purchase price is required for purchase transactions');
    }
    
    if (data.transactionType === 'refinance') {
      if (!data.originalPurchasePrice || data.originalPurchasePrice <= 0) {
        errors.push('Original purchase price is required for refinance transactions');
      }
      if (!data.purchaseDate) {
        errors.push('Purchase date is required for refinance transactions');
      }
    }
    
    // Program-specific validation
    const isLandAcquisition = loanProgram.toLowerCase().includes('land acquisition');
    const isMezzanine = loanProgram.toLowerCase().includes('mezzanine');
    const isMobilization = loanProgram.toLowerCase().includes('mobilization funding');
    const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');
    
    if (isLandAcquisition) {
      if (!data.entitlementStatus?.trim()) errors.push('Entitlement status is required for land acquisition loans');
      if (!data.developmentCosts || data.developmentCosts <= 0) errors.push('Development costs are required for land acquisition loans');
    }
    
    if (isMezzanine) {
      if (!data.seniorLoanAmount || data.seniorLoanAmount <= 0) errors.push('Senior loan amount is required for mezzanine loans');
      if (!data.capitalStack?.trim()) errors.push('Capital stack description is required for mezzanine loans');
    }
    
    if (isMobilization) {
      if (!data.contractValue || data.contractValue <= 0) errors.push('Contract value is required for mobilization funding');
      if (!data.clientName?.trim()) errors.push('Client name is required for mobilization funding');
      if (!data.projectDescription?.trim()) errors.push('Project description is required for mobilization funding');
    }
    
    if (isEquipmentFinancing) {
      if (!data.dealers || data.dealers.length === 0) errors.push('At least one dealer is required for equipment financing');
      if (!data.quotes || data.quotes.length === 0) errors.push('At least one equipment quote is required for equipment financing');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // ============================================================================
  // LOAD EXISTING PAGE 1 DATA FUNCTION
  // ============================================================================
  
  const loadExistingPage1Data = (app: any) => {
    console.log('📥 Loading existing Page 1 data from application:', app.id);
      
      // Load property information
    if (app.propertyInfo) {
      setPropertyAddress(app.propertyInfo.propertyAddress || '');
      setPropertyApn(app.propertyInfo.propertyApn || '');
      setPropertyTaxes(app.propertyInfo.annualPropertyTaxes?.toString() || '');
      setPropertyType(app.propertyInfo.propertyType || '');
      setOtherPropertyType(app.propertyInfo.otherPropertyType || '');
      setPropertySqFt(app.propertyInfo.propertySquareFootage?.toString() || '');
      setLotSize(app.propertyInfo.lotSize || '');
      setAsIsValue(app.propertyInfo.asIsValue?.toString() || '');
      setAfterRepairValue(app.propertyInfo.afterRepairValue?.toString() || '');
      setAfterConstructedValue(app.propertyInfo.afterConstructedValue?.toString() || '');
      setStabilizedValue(app.propertyInfo.stabilizedValue?.toString() || '');
      setConstructionTime(app.propertyInfo.constructionTime?.toString() || '');
      
      if (app.propertyInfo.requestedClosingDate) {
        const date = app.propertyInfo.requestedClosingDate;
        // Handle different date formats safely
        let dateObj: Date;
        if (date instanceof Date) {
          dateObj = date;
        } else if (typeof date === 'string') {
          dateObj = new Date(date);
        } else if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else {
          console.warn('Invalid date format for requestedClosingDate:', date);
          dateObj = new Date();
        }
        setRequestedClosingDate(dateObj);
      }
      }

      // Load loan details
    if (app.loanDetails) {
      setLoanAmount(app.loanDetails.loanAmount?.toString() || '');
      setTransactionType(app.loanDetails.transactionType || 'purchase');
      setPurchasePrice(app.loanDetails.purchasePrice?.toString() || '');
      setOriginalPurchasePrice(app.loanDetails.originalPurchasePrice?.toString() || '');
      setCurrentDebt(app.loanDetails.currentDebt?.toString() || '');
      
      if (app.loanDetails.purchaseDate) {
        const date = app.loanDetails.purchaseDate;
        // Handle different date formats safely
        let dateObj: Date;
        if (date instanceof Date) {
          dateObj = date;
        } else if (typeof date === 'string') {
          dateObj = new Date(date);
        } else if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else {
          console.warn('Invalid date format for purchaseDate:', date);
          dateObj = new Date();
        }
        setPurchaseDate(dateObj);
      }
      }

      // Load business information
    if (app.businessInfo) {
      setCompanyName(app.businessInfo.companyName || '');
      setCompanyEin(app.businessInfo.companyEin || '');
    }
    
    // Load program-specific data
    if (app.landAcquisitionInfo) {
      setEntitlementStatus(app.landAcquisitionInfo.entitlementStatus || '');
      setDevelopmentCosts(app.landAcquisitionInfo.developmentCosts?.toString() || '');
      setAfterDevelopmentValue(app.landAcquisitionInfo.afterDevelopmentValue?.toString() || '');
    }
    
    if (app.mezzanineInfo) {
      setSeniorLoanAmount(app.mezzanineInfo.seniorLoanAmount?.toString() || '');
      setCapitalStack(app.mezzanineInfo.capitalStack || '');
    }
    
    if (app.mobilizationInfo) {
      setContractValue(app.mobilizationInfo.contractValue?.toString() || '');
      setProjectDescription(app.mobilizationInfo.projectDescription || '');
      setClientName(app.mobilizationInfo.clientName || '');
    }
    
    if (app.equipmentInfo) {
      if (app.equipmentInfo.dealers) {
        setDealers(app.equipmentInfo.dealers);
      }
      if (app.equipmentInfo.quotes) {
        setQuotes(app.equipmentInfo.quotes);
      }
    }
    
    console.log('✅ Page 1 data loaded successfully');
  };

  // Load local data when component mounts (runs once)
  useEffect(() => {
    console.log('🔄 Component mounted - checking for local data...');
    
    // Try to load from local storage (for navigation back to page 1)
    const localData = loadPage1FromLocal();
    if (localData) {
      console.log('📥 Found local Page 1 data, applying to form...');
      applyPage1DataToForm(localData);
    } else {
      console.log('ℹ️ No local data found');
    }
  }, []); // Empty dependency array - runs only on mount
  
  // Load existing application data when application state changes
  useEffect(() => {
    console.log('🔄 Application state changed - checking for database data...');
    
    // Only load from database if we don't have local data
    if (page1LocalData) {
      console.log('📥 Local data exists, skipping database load');
      return;
    }
    
    // If no local data, try to load from database (for editing existing applications)
    if (application && applicationId) {
      console.log('📥 Application loaded successfully from database:', application.id);
      loadExistingPage1Data(application);
    } else if (applicationId && !application) {
      console.log('⚠️ Application ID provided but no application loaded:', applicationId);
    } else if (!applicationId) {
      console.log('ℹ️ No application ID provided - this is a new application');
    }
  }, [application, applicationId, page1LocalData]);

  // Auto-create application with borrower information when officeContext is "borrower" and no applicationId
  // BUT ONLY if we don't have local data (to prevent creating new apps when navigating back)
  useEffect(() => {
    // Check if we have local data first
    const hasLocalData = page1LocalData || sessionStorage.getItem('loanApplicationPage1Data');
    
    console.log('🔍 Auto-create check:', {
      officeContext,
      hasUser: !!user,
      hasUserProfile: !!userProfile,
      hasApplicationId: !!applicationId,
      hasApplication: !!application,
      hasLocalData: !!hasLocalData,
      page1LocalData: !!page1LocalData,
      sessionStorageData: !!sessionStorage.getItem('loanApplicationPage1Data')
    });
    
    if (officeContext === 'borrower' && user && userProfile && !applicationId && !application && !hasLocalData) {
      console.log('Auto-creating application with borrower information from user profile:', {
        displayName: user.displayName,
        email: user.email,
        userProfile: userProfile
      });
      
      // Create borrower information from user profile
      const borrowerInfo = {
        fullName: user.displayName || userProfile.fullName || '',
        email: user.email || userProfile.email || '',
        phone: '', // Will be collected in the form
        dateOfBirth: '', // Will be collected in the form
        ssn: '', // Will be collected in the form
        maritalStatus: 'single' as const,
        dependents: 0,
        currentAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          yearsAtAddress: 0,
          rentOrOwn: 'rent' as const
        },
        previousAddresses: [],
        employmentStatus: 'employed' as const,
        annualIncome: 0,
        citizenship: 'us_citizen' as const
      };
      
      // Create application with borrower information pre-populated
      createApplication(
        user.uid, // userId
        user.uid, // brokerId (for now, same as user)
        loanProgram,
        {
          borrowerInfo: borrowerInfo
        }
      ).then((newApplicationId) => {
        console.log('Application created with borrower information:', newApplicationId);
        // The application will be loaded automatically by the hook
      }).catch((error) => {
        console.error('Failed to create application with borrower information:', error);
      });
    } else {
      console.log('🚫 Skipping auto-create application:', {
        reason: hasLocalData ? 'local data exists' : 
               applicationId ? 'application ID provided' :
               application ? 'application already exists' :
               officeContext !== 'borrower' ? 'not borrower context' :
               !user ? 'no user' : 'no user profile'
      });
    }
  }, [officeContext, user, userProfile, applicationId, application, createApplication, loanProgram, page1LocalData]);


  // Handle field updates (no auto-save, only save on navigation)
  const handleFieldUpdate = (field: string, value: any) => {
    // For Ground Up Construction loans, completely bypass the generic system
    if (isGroundUpConstruction) {
      console.log(`🏗️ [Ground Up Construction] Field update bypassed for generic system: ${field} = ${value}`);
      return; // Don't call the generic updateField at all
    }
    
    if (applicationId) {
      updateField(field, value);
    }
  };

  return (
    <div className="space-y-6">
        {/* Application Header */}
        <div className="space-y-4">
            <div>
                <h1 className="font-headline text-3xl font-bold">Loan Application - Page 1 of 12</h1>
                <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
            </div>
            
            {/* Loading State */}
            {applicationId && loading && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading your application...</span>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {/* Application Status and Progress */}
            {applicationId && application && !loading && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Application ID</h3>
                                <p className="text-lg font-mono">{application.id}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                                <Badge variant={application.status === 'approved' ? 'default' : 'secondary'}>
                                    {application.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Progress</h3>
                                <div className="flex items-center gap-2">
                                    <Progress value={application.progress?.overallProgress || 0} className="flex-1" />
                                    <span className="text-sm font-medium">{application.progress?.overallProgress || 0}%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {/* Save Status Indicator */}
            {applicationId && saving && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
                            <span className="text-blue-700 text-sm">Saving your progress...</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
        


        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Loan & {isMobilization ? 'Project' : isEquipmentFinancing ? 'Equipment' : 'Property'} Details</CardTitle>
                <CardDescription>Provide the key details about the loan you are requesting and the subject {isMobilization ? 'project' : isEquipmentFinancing ? 'equipment' : 'property'}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                
                {isMobilization ? (
                    <>
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><DollarSign className="h-5 w-5" /> Mobilization Funding Details</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fundingAmount">Funding Amount Requested</Label>
                                    <Input id="fundingAmount" type="number" placeholder="e.g., 50000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contractValue">Total Contract Value</Label>
                                    <Input id="contractValue" type="number" placeholder="e.g., 250000" value={contractValue} onChange={e => setContractValue(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="clientName">Client/Payor Name</Label>
                                    <Input id="clientName" placeholder="e.g., General Construction Co." value={clientName} onChange={e => setClientName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectDescription">Brief Project Description</Label>
                                    <Textarea id="projectDescription" placeholder="Briefly describe the project, its scope, and timeline..." value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
                                </div>
                                <DocumentUploadInput name="Executed Contract for the project" />
                                <DocumentUploadInput name="Detailed Use of Funds" />
                            </CardContent>
                        </Card>
                    </>
                ) : isEquipmentFinancing ? (
                     <Card className="bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary"><Truck className="h-5 w-5" /> Equipment Financing Details</CardTitle>
                        </CardHeader>
                            <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="loanAmount">Total Loan Amount Requested</Label>
                                <Input id="loanAmount" type="number" placeholder="e.g., 75000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                            </div>

                            {/* Dealers Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Dealer Information</h3>
                                {dealers.map((dealer, index) => (
                                    <div key={dealer.id} className="p-4 border rounded-md space-y-4 relative">
                                        <Label className="font-semibold">Dealer #{index + 1}</Label>
                                        {dealers.length > 1 && (
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveDealer(dealer.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor={`dealer-name-${dealer.id}`}>Dealer Name</Label>
                                            <Input id={`dealer-name-${dealer.id}`} value={dealer.name} onChange={e => handleDealerChange(dealer.id, 'name', e.target.value)} placeholder="e.g., Heavy Machinery Inc." />
                                        </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`dealer-phone-${dealer.id}`}>Phone Number</Label>
                                                <Input id={`dealer-phone-${dealer.id}`} type="tel" value={dealer.phone} onChange={e => handleDealerChange(dealer.id, 'phone', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`dealer-email-${dealer.id}`}>Email</Label>
                                                <Input id={`dealer-email-${dealer.id}`} type="email" value={dealer.email} onChange={e => handleDealerChange(dealer.id, 'email', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`dealer-address-${dealer.id}`}>Address</Label>
                                            <Input id={`dealer-address-${dealer.id}`} value={dealer.address} onChange={e => handleDealerChange(dealer.id, 'address', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                                 <Button type="button" variant="outline" onClick={handleAddDealer}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Another Dealer
                                </Button>
                            </div>

                            {/* Equipment Quotes Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Equipment Quotes</h3>
                                {quotes.map((quote, index) => (
                                     <div key={quote.id} className="p-4 border rounded-md space-y-4 relative">
                                        <Label className="font-semibold">Quote #{index + 1}</Label>
                                        {quotes.length > 1 && (
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveQuote(quote.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor={`quote-desc-${quote.id}`}>Equipment Description</Label>
                                            <Textarea id={`quote-desc-${quote.id}`} value={quote.description} onChange={e => handleQuoteChange(quote.id, 'description', e.target.value)} placeholder="Make, model, year, condition, etc." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`quote-cost-${quote.id}`}>Equipment Cost</Label>
                                            <Input id={`quote-cost-${quote.id}`} type="number" value={quote.cost} onChange={e => handleQuoteChange(quote.id, 'cost', e.target.value)} />
                                        </div>
                                        <DocumentUploadInput name={`Equipment Quote or Invoice #${index + 1}`} />
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={handleAddQuote}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Another Quote
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                <>
                <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Subject Property Address</Label>
                    <Input 
                        id="propertyAddress" 
                        placeholder="123 Main St, Anytown, USA" 
                        value={propertyAddress} 
                        onChange={e => {
                            setPropertyAddress(e.target.value);
                            handleFieldUpdate('propertyInfo.propertyAddress', e.target.value);
                        }} 
                    />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyApn">Property APN</Label>
                        <Input id="propertyApn" placeholder="e.g., 123-456-789" value={propertyApn} onChange={e => {
                            setPropertyApn(e.target.value);
                            handleFieldUpdate('propertyInfo.propertyApn', e.target.value);
                        }} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
                        <Input id="propertyTaxes" type="number" placeholder="e.g., 5000" value={propertyTaxes} onChange={e => {
                            setPropertyTaxes(e.target.value);
                            handleFieldUpdate('propertyInfo.annualPropertyTaxes', parseFloat(e.target.value) || 0);
                        }} />
                    </div>
                </div>

                {!isLandAcquisition && <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={(value) => {
                    setPropertyType(value);
                    handleFieldUpdate('propertyInfo.propertyType', value);
                  }} value={propertyType}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {isIndustrial ? (
                        <>
                          <SelectItem value="warehouses">Warehouses</SelectItem>
                          <SelectItem value="light-industrial">Light Industrial</SelectItem>
                          <SelectItem value="heavy-industrial">Heavy Industrial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="multi-family">Multi Family</SelectItem>
                          <SelectItem value="mixed-use">Mixed Use</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>}

                {propertyType === 'other' && !isLandAcquisition && (
                  <div className="space-y-2">
                    <Label htmlFor="otherPropertyType">Please specify property type</Label>
                    <Input id="otherPropertyType" value={otherPropertyType} onChange={e => setOtherPropertyType(e.target.value)} />
                  </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="loanAmount">{isMezzanine ? "Mezzanine Loan Amount Requested" : "Loan Amount Requested"}</Label>
                    <Input 
                        id="loanAmount" 
                        type="number" 
                        placeholder="e.g., 300000" 
                        value={loanAmount} 
                        onChange={e => {
                            setLoanAmount(e.target.value);
                            handleFieldUpdate('loanDetails.loanAmount', parseFloat(e.target.value) || 0);
                        }} 
                    />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                    <Label className="font-semibold">Transaction Type</Label>
                    <RadioGroup value={transactionType} onValueChange={setTransactionType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="purchase" id="purchase" />
                        <Label htmlFor="purchase">Purchase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="refinance" id="refinance" />
                        <Label htmlFor="refinance">Refinance</Label>
                    </div>
                    </RadioGroup>

                    {transactionType === 'purchase' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">Purchase Price</Label>
                                <Input id="purchasePrice" type="number" placeholder="e.g., 400000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
                            </div>
                            <DocumentUploadInput name="Executed Purchase Contract" />
                            <DocumentUploadInput name="Evidence of Earnest Money Deposit" />
                        </div>
                    )}

                    {transactionType === 'refinance' && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="originalPurchasePrice">Original Purchase Price</Label>
                                <Input id="originalPurchasePrice" type="number" placeholder="e.g., 350000" value={originalPurchasePrice} onChange={e => setOriginalPurchasePrice(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Date of Purchase</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !purchaseDate && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={purchaseDate}
                                        onSelect={setPurchaseDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentDebt">Current Debt on Property</Label>
                                <Input id="currentDebt" type="number" placeholder="e.g., 150000" value={currentDebt} onChange={e => setCurrentDebt(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="asIsValue">As Is Value</Label>
                        <Input id="asIsValue" type="number" placeholder="e.g., 350000" value={asIsValue} onChange={e => {
                            setAsIsValue(e.target.value);
                            handleFieldUpdate('propertyInfo.asIsValue', parseFloat(e.target.value) || 0);
                        }} />
                    </div>
                </div>

                {isLandAcquisition ? (
                    <>
                         <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="entitlementStatus">Entitlement Status</Label>
                                <Input id="entitlementStatus" placeholder="e.g., Fully Entitled, In Progress" value={entitlementStatus} onChange={e => setEntitlementStatus(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="developmentCosts">Total Development Costs</Label>
                                <Input id="developmentCosts" type="number" placeholder="e.g., 500000" value={developmentCosts} onChange={e => setDevelopmentCosts(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="afterDevelopmentValue">After Development Value</Label>
                            <Input id="afterDevelopmentValue" type="number" placeholder="e.g., 1500000" value={afterDevelopmentValue} onChange={e => setAfterDevelopmentValue(e.target.value)} />
                        </div>
                        <DocumentUploadInput name="Feasibility Study" />
                        <DocumentUploadInput name="Zoning and Entitlement Documents" />
                        <DocumentUploadInput name="Environmental Report" />
                    </>
                ) : isMezzanine ? (
                    <>
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><Layers className="h-5 w-5" /> Mezzanine Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seniorLoanAmount">Senior Loan Amount</Label>
                                    <Input id="seniorLoanAmount" type="number" placeholder="e.g., 2000000" value={seniorLoanAmount} onChange={e => setSeniorLoanAmount(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="capitalStack">Capital Stack (Describe sources and amounts)</Label>
                                    <Textarea id="capitalStack" placeholder="e.g., Senior Debt: $2M, Mezzanine: $500k, Equity: $500k" value={capitalStack} onChange={e => setCapitalStack(e.target.value)} />
                                </div>
                                <DocumentUploadInput name="Senior Debt Term Sheet" />
                                <DocumentUploadInput name="Capital Stack overview" />
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="afterConstructedValue">After Constructed Value</Label>
                                <Input id="afterConstructedValue" type="number" placeholder="e.g., 1000000" value={afterConstructedValue} onChange={e => {
                                    setAfterConstructedValue(e.target.value);
                                    handleFieldUpdate('propertyInfo.afterConstructedValue', parseFloat(e.target.value) || 0);
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stabilizedValue">Stabilized Value</Label>
                                <Input id="stabilizedValue" type="number" placeholder="e.g., 1200000" value={stabilizedValue} onChange={e => {
                                    setStabilizedValue(e.target.value);
                                    handleFieldUpdate('propertyInfo.stabilizedValue', parseFloat(e.target.value) || 0);
                                }} />
                            </div>
                        </div>
                    </>
                )}
                
                 <div className="grid md:grid-cols-2 gap-4">
                    {!isLandAcquisition && <div className="space-y-2">
                        <Label htmlFor="propertySqFt">Subject Property Square Footage</Label>
                        <Input id="propertySqFt" type="number" placeholder="e.g., 2000" value={propertySqFt} onChange={e => {
                            setPropertySqFt(e.target.value);
                            handleFieldUpdate('propertyInfo.propertySquareFootage', parseFloat(e.target.value) || 0);
                        }} />
                    </div>}
                    <div className="space-y-2">
                        <Label htmlFor="lotSize">Lot Size (in sq. ft. or acres)</Label>
                        <Input id="lotSize" placeholder="e.g., 10,000 sq. ft. or 0.23 acres" value={lotSize} onChange={e => {
                            setLotSize(e.target.value);
                            handleFieldUpdate('propertyInfo.lotSize', e.target.value);
                        }} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {!isLandAcquisition && <div className="space-y-2">
                        <Label htmlFor="constructionTime">Estimated Time to Construct (in months)</Label>
                        <Input id="constructionTime" type="number" placeholder="e.g., 6" value={constructionTime} onChange={e => {
                            setConstructionTime(e.target.value);
                            handleFieldUpdate('propertyInfo.constructionTime', parseFloat(e.target.value) || 0);
                        }} />
                    </div>}
                     <div className="space-y-2">
                        <Label htmlFor="closingDate">Requested Closing Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !requestedClosingDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {requestedClosingDate ? format(requestedClosingDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={requestedClosingDate}
                                onSelect={setRequestedClosingDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                </>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Borrowing Entity</CardTitle>
                <CardDescription>Provide details about the borrowing company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="e.g., Real Estate Holdings LLC" value={companyName} onChange={e => {
                            setCompanyName(e.target.value);
                            handleFieldUpdate('businessInfo.companyName', e.target.value);
                        }} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyEin">Company EIN</Label>
                        <Input id="companyEin" placeholder="e.g., 12-3456789" value={companyEin} onChange={e => {
                            setCompanyEin(e.target.value);
                            handleFieldUpdate('businessInfo.companyEin', e.target.value);
                        }} />
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                    <DocumentUploadInput name="EIN Certificate (Company)" />
                    <DocumentUploadInput name="Formation Documentation (Company)" />
                    <DocumentUploadInput name="Operating Agreement/Bylaws (Company)" />
                    <DocumentUploadInput name="Partnership/Officer List (Company)" />
                    <DocumentUploadInput name="Business License (Company)" />
                    <DocumentUploadInput name="Certificate of Good Standing (Company)" />
                </div>
            </CardContent>
        </Card>


        <div className="flex justify-between items-center">
            {isGroundUpConstruction && (
                <Button 
                    variant="outline" 
                    onClick={refreshFormFromTypedState}
                    className="text-xs"
                >
                    🔄 Refresh from Typed State
                </Button>
            )}
            <Button onClick={handleContinue}>
                Continue to Page 2 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
