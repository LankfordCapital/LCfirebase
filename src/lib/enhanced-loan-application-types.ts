// Comprehensive Loan Application Database Types
// This file defines the complete data structure for all loan application types

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// CORE LOAN TYPES AND PROGRAMS
// ============================================================================

export type LoanCategory = 
  | 'residential_noo' 
  | 'commercial' 
  | 'industrial' 
  | 'land_acquisition' 
  | 'mezzanine' 
  | 'mobilization' 
  | 'equipment' 
  | 'sba';

export type LoanProgram = 
  // Residential NOO Programs
  | 'residential_noo_ground_up_construction'
  | 'residential_noo_fix_and_flip'
  | 'residential_noo_dscr'
  | 'residential_noo_bridge'
  
  // Commercial Programs
  | 'commercial_ground_up_construction'
  | 'commercial_rehab_loans'
  | 'commercial_acquisition_bridge'
  | 'commercial_conventional_long_term'
  
  // Industrial Programs
  | 'industrial_ground_up_construction'
  | 'industrial_rehab_expansion'
  | 'industrial_acquisition_bridge'
  | 'industrial_long_term_debt'
  
  // Other Programs
  | 'land_acquisition'
  | 'mezzanine_loans'
  | 'mobilization_funding'
  | 'equipment_financing'
  | 'sba_loans';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'funded' 
  | 'closed';

// ============================================================================
// BORROWER INFORMATION
// ============================================================================

export interface BorrowerPersonalInfo {
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  dependents: number;
  
  // Address Information
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    yearsAtAddress: number;
    rentOrOwn: 'rent' | 'own';
    monthlyPayment?: number;
  };
  
  // Previous Addresses (Last 2 years)
  previousAddresses: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    yearsLived: number;
    fromDate: string;
    toDate: string;
  }>;
  
  // Employment Information
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'military';
  annualIncome: number;
  creditScore?: number;
  
  // Additional Personal Details
  citizenship: 'us_citizen' | 'permanent_resident' | 'non_resident_alien';
  veteranStatus?: boolean;
  bankruptcyHistory?: {
    hasFiled: boolean;
    filingDate?: string;
    dischargeDate?: string;
    chapter?: '7' | '11' | '13';
  };
  foreclosureHistory?: {
    hasForeclosure: boolean;
    foreclosureDate?: string;
    propertyAddress?: string;
  };
}

export interface BorrowerBusinessInfo {
  // Company Information
  businessName: string;
  businessType: string;
  ein: string;
  businessStructure: 'llc' | 'corporation' | 'partnership' | 'sole_proprietorship' | 'trust';
  industry: string;
  yearsInBusiness: number;
  numberOfEmployees: number;
  ownershipPercentage: number;
  
  // Business Address
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Business Financials
  annualRevenue: number;
  annualProfit: number;
  businessPlan?: string; // URL to uploaded business plan
  
  // Business Licenses and Certifications
  businessLicense: string;
  certificateOfGoodStanding?: string;
  industrySpecificLicenses?: string[];
  
  // Business Experience
  businessExperience: {
    totalYearsInIndustry: number;
    previousBusinesses?: Array<{
      name: string;
      type: string;
      yearsOwned: number;
      reasonForSale?: string;
    }>;
  };
}

// ============================================================================
// FINANCIAL INFORMATION
// ============================================================================

export interface FinancialAssets {
  // Cash and Bank Accounts
  checkingAccounts: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    accountType: 'checking' | 'savings' | 'money_market';
  }>;
  
  savingsAccounts: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    interestRate?: number;
  }>;
  
  // Investment Accounts
  investments: Array<{
    type: 'stocks' | 'bonds' | 'mutual_funds' | 'etfs' | 'retirement' | 'other';
    institution: string;
    accountNumber: string;
    value: number;
    description?: string;
  }>;
  
  // Real Estate Holdings
  realEstate: Array<{
    address: string;
    type: 'primary_residence' | 'secondary_home' | 'investment' | 'commercial';
    value: number;
    mortgageBalance?: number;
    monthlyRent?: number;
    monthlyExpenses?: number;
    equity: number;
  }>;
  
  // Vehicles
  vehicles: Array<{
    year: string;
    make: string;
    model: string;
    value: number;
    loanBalance?: number;
    monthlyPayment?: number;
  }>;
  
  // Other Assets
  otherAssets: Array<{
    description: string;
    value: number;
    type: 'business_equipment' | 'jewelry' | 'art' | 'collectibles' | 'other';
  }>;
  
  // Total Assets
  totalAssets: number;
}

export interface FinancialLiabilities {
  // Credit Cards
  creditCards: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    creditLimit: number;
  }>;
  
  // Personal Loans
  personalLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    purpose: string;
  }>;
  
  // Student Loans
  studentLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    loanType: 'federal' | 'private';
  }>;
  
  // Auto Loans
  autoLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    vehicle: string;
  }>;
  
  // Mortgages
  mortgages: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    propertyAddress: string;
    interestRate: number;
    loanType: 'conventional' | 'fha' | 'va' | 'usda' | 'jumbo';
  }>;
  
  // Business Loans
  businessLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    businessName: string;
    purpose: string;
  }>;
  
  // Other Liabilities
  otherLiabilities: Array<{
    description: string;
    balance: number;
    monthlyPayment: number;
    type: 'medical' | 'tax' | 'legal' | 'other';
  }>;
  
  // Total Liabilities
  totalLiabilities: number;
}

export interface IncomeInformation {
  // Employment Income
  employmentIncome: {
    salary: number;
    hourly: number;
    commission: number;
    bonus: number;
    overtime: number;
    total: number;
  };
  
  // Business Income
  businessIncome: {
    netBusinessIncome: number;
    distributions: number;
    total: number;
  };
  
  // Investment Income
  investmentIncome: {
    dividends: number;
    interest: number;
    capitalGains: number;
    rentalIncome: number;
    total: number;
  };
  
  // Other Income
  otherIncome: {
    socialSecurity: number;
    disability: number;
    alimony: number;
    childSupport: number;
    military: number;
    other: number;
    total: number;
  };
  
  // Total Monthly Income
  totalMonthlyIncome: number;
  totalAnnualIncome: number;
}

// ============================================================================
// LOAN SPECIFIC INFORMATION
// ============================================================================

export interface LoanDetails {
  // Basic Loan Information
  loanAmount: number;
  loanPurpose: string;
  term: number; // in months
  propertyType: string;
  
  // Property Information
  propertyAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Financial Terms
  downPayment: number;
  downPaymentPercentage: number;
  interestRate?: number;
  monthlyPayment?: number;
  
  // Ratios
  loanToValueRatio?: number;
  debtToIncomeRatio?: number;
  debtServiceCoverageRatio?: number; // For DSCR loans
  
  // Property Value
  propertyValue?: number;
  purchasePrice?: number;
  afterRepairValue?: number; // For fix and flip
  
  // Closing Information
  closingCosts?: number;
  escrowRequired?: boolean;
  prepaymentPenalty?: boolean;
  balloonPayment?: boolean;
  
  // Loan Type Specific Fields
  constructionBudget?: number; // For construction loans
  rehabBudget?: number; // For rehab loans
  drawSchedule?: Array<{
    phase: string;
    amount: number;
    percentage: number;
    conditions: string[];
  }>;
}

// ============================================================================
// PROPERTY INFORMATION
// ============================================================================

export interface PropertyInformation {
  // Basic Property Details
  propertyType: 'single_family' | 'multi_family' | 'condo' | 'townhouse' | 'commercial' | 'industrial' | 'land' | 'mixed_use';
  propertyUse: 'primary_residence' | 'secondary_home' | 'investment' | 'business' | 'construction';
  propertyCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
  
  // Physical Characteristics
  yearBuilt?: number;
  squareFootage?: number;
  lotSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  garageSpaces?: number;
  
  // Financial Information
  propertyTaxes?: number;
  insuranceCost?: number;
  hoaFees?: number;
  monthlyRent?: number;
  
  // HOA Information
  hoaContact?: {
    name: string;
    phone: string;
    email: string;
  };
  
  // Zoning and Permits
  zoning?: string;
  permittedUses?: string[];
  buildingPermits?: Array<{
    permitNumber: string;
    type: string;
    issueDate: string;
    status: 'pending' | 'approved' | 'completed';
  }>;
  
  // Environmental Information
  environmentalIssues?: {
    hasIssues: boolean;
    issues?: string[];
    reports?: string[]; // File URLs
  };
  
  // Property Photos and Documents
  propertyPhotos?: string[]; // Array of file URLs
  propertyDocuments?: string[]; // Array of file URLs
}

// ============================================================================
// CONSTRUCTION INFORMATION (For Construction Loans)
// ============================================================================

export interface ConstructionInformation {
  // General Contractor Information
  generalContractor: {
    name: string;
    license: string;
    insurance: {
      generalLiability: string;
      workersComp: string;
      buildersRisk: string;
    };
    bond?: string;
    experience: number; // years
    references: Array<{
      name: string;
      phone: string;
      project: string;
      year: string;
    }>;
  };
  
  // Construction Plans
  constructionPlans: {
    architecturalPlans?: string; // File URL
    structuralPlans?: string; // File URL
    mechanicalPlans?: string; // File URL
    electricalPlans?: string; // File URL
    sitePlans?: string; // File URL
  };
  
  // Construction Budget
  constructionBudget: {
    totalBudget: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    contingency: number;
    softCosts: number;
    hardCosts: number;
  };
  
  // Draw Schedule
  drawSchedule: Array<{
    phase: string;
    percentage: number;
    amount: number;
    conditions: string[];
    timeline: string;
  }>;
  
  // Timeline
  constructionTimeline: {
    startDate: string;
    completionDate: string;
    duration: number; // in months
    milestones: Array<{
      milestone: string;
      date: string;
      percentage: number;
    }>;
  };
  
  // Insurance
  insurance: {
    buildersRisk: {
      carrier: string;
      policyNumber: string;
      coverage: number;
      premium: number;
    };
    generalLiability: {
      carrier: string;
      policyNumber: string;
      coverage: number;
      premium: number;
    };
  };
}

// ============================================================================
// DOCUMENT TRACKING
// ============================================================================

export interface DocumentTracking {
  // Borrower Documents
  borrowerDocuments: {
    governmentId?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    socialSecurityCard?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    personalFinancialStatement?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    creditReport?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    personalAssetStatements?: Array<{
      month: number;
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    }>;
    proofOfFunds?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
  };
  
  // Company Documents
  companyDocuments: {
    einCertificate?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    formationDocumentation?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    operatingAgreement?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    partnershipOfficerList?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    businessLicense?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    certificateOfGoodStanding?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
  };
  
  // Property Documents
  propertyDocuments: {
    purchaseAgreement?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    earnestMoneyDeposit?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    titleCommitment?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    appraisal?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    propertyTaxCertificate?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    insuranceQuote?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
    environmentalReport?: {
      fileUrl: string;
      uploadedAt: Timestamp;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    };
  };
  
  // Additional Documents
  additionalDocuments: Array<{
    name: string;
    category: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Timestamp;
    uploadedBy: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    reviewedBy?: string;
    reviewedAt?: Timestamp;
  }>;
}

// ============================================================================
// APPLICATION PROGRESS AND STATUS
// ============================================================================

export interface ApplicationProgress {
  // Section Completion
  borrowerInfoCompleted: boolean;
  businessInfoCompleted: boolean;
  loanDetailsCompleted: boolean;
  financialInfoCompleted: boolean;
  propertyInfoCompleted: boolean;
  employmentInfoCompleted: boolean;
  constructionInfoCompleted?: boolean; // For construction loans
  documentsUploaded: boolean;
  
  // Progress Calculation
  overallProgress: number; // 0-100
  sectionsCompleted: number;
  totalSections: number;
  
  // Document Progress
  documentsRequired: number;
  documentsApproved: number;
  documentsRejected: number;
  
  // Timeline
  applicationStarted: Timestamp;
  lastUpdated: Timestamp;
  estimatedCompletion?: Timestamp;
}

// ============================================================================
// APPLICATION HISTORY AND NOTES
// ============================================================================

export interface ApplicationHistory {
  action: string;
  description: string;
  performedBy: string;
  timestamp: Timestamp;
  details?: any;
  status?: ApplicationStatus;
}

export interface ApplicationNotes {
  generalNotes?: string;
  brokerNotes?: string;
  underwriterNotes?: string;
  borrowerNotes?: string;
  processorNotes?: string;
  closingNotes?: string;
  
  // Note History
  noteHistory: Array<{
    note: string;
    author: string;
    timestamp: Timestamp;
    type: 'general' | 'broker' | 'underwriter' | 'borrower' | 'processor' | 'closing';
  }>;
}

// ============================================================================
// MAIN LOAN APPLICATION INTERFACE
// ============================================================================

export interface EnhancedLoanApplication {
  id?: string;
  
  // Core Application Information
  userId: string; // Borrower's user ID
  brokerId: string; // Broker who created/manages this application
  loanCategory: LoanCategory;
  loanProgram: LoanProgram;
  status: ApplicationStatus;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;
  fundedAt?: Timestamp;
  closedAt?: Timestamp;
  
  // Assignment
  assignedTo?: string; // Workforce member assigned for underwriting
  processor?: string; // Loan processor assigned
  
  // Borrower Information
  borrowerInfo: BorrowerPersonalInfo;
  businessInfo?: BorrowerBusinessInfo;
  
  // Financial Information
  financialAssets: FinancialAssets;
  financialLiabilities: FinancialLiabilities;
  incomeInformation: IncomeInformation;
  
  // Loan Details
  loanDetails: LoanDetails;
  
  // Property Information
  propertyInfo: PropertyInformation;
  
  // Construction Information (for construction loans)
  constructionInfo?: ConstructionInformation;
  
  // Document Tracking
  documents: DocumentTracking;
  
  // Progress and Status
  progress: ApplicationProgress;
  
  // History and Notes
  history: ApplicationHistory[];
  notes: ApplicationNotes;
  
  // Loan Type Specific Fields
  dscrInfo?: {
    propertyCashFlow: number;
    debtServiceCoverageRatio: number;
    rentalHistory?: Array<{
      month: string;
      rent: number;
      expenses: number;
      netCashFlow: number;
    }>;
  };
  
  fixAndFlipInfo?: {
    purchasePrice: number;
    rehabBudget: number;
    afterRepairValue: number;
    holdingPeriod: number; // months
    exitStrategy: 'sell' | 'refinance' | 'rent';
    contractorInfo?: {
      name: string;
      license: string;
      experience: number;
    };
  };
  
  bridgeInfo?: {
    bridgeAmount: number;
    bridgeTerm: number;
    exitStrategy: 'refinance' | 'sale' | 'construction';
    permanentLender?: string;
    permanentLoanAmount?: number;
  };
  
  equipmentInfo?: {
    equipmentType: string;
    equipmentValue: number;
    manufacturer: string;
    model: string;
    year: string;
    serialNumber?: string;
    vendor: string;
    warranty?: string;
  };
  
  sbaInfo?: {
    sbaProgram: '7a' | '504' | 'microloan';
    sbaGuarantee: number;
    useOfProceeds: string[];
    businessPlan?: string;
    personalFinancialStatement?: string;
  };
}

// ============================================================================
// HELPER TYPES AND UTILITIES
// ============================================================================

export interface LoanProgramRequirements {
  program: LoanProgram;
  category: LoanCategory;
  name: string;
  description: string;
  typicalTerms: string;
  requirements: {
    borrower: string[];
    company: string[];
    subjectProperty: string[];
  };
  features: string[];
  estimatedProcessing: string;
}

export interface ApplicationSummary {
  id: string;
  borrowerName: string;
  loanProgram: LoanProgram;
  loanAmount: number;
  status: ApplicationStatus;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  progress: number;
  assignedTo?: string;
}

export interface DocumentStatus {
  documentName: string;
  required: boolean;
  uploaded: boolean;
  approved: boolean;
  rejected: boolean;
  fileUrl?: string;
  uploadedAt?: Timestamp;
  notes?: string;
}
