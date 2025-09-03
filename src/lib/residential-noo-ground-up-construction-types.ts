// ============================================================================
// RESIDENTIAL NOO GROUND UP CONSTRUCTION LOAN APPLICATION TYPES
// ============================================================================
// This file defines the complete data structure for saving all user-entered information
// including form fields, documents, and application metadata

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export interface ApplicationDocument {
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
  status: 'pending' | 'uploaded' | 'verified' | 'missing' | 'rejected';
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: Timestamp;
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

export interface ApplicationProgress {
  // Page Completion Status
  page1Completed: boolean;          // Loan & Property Details
  page2Completed: boolean;          // Company P&L Statement
  page3Completed: boolean;          // Borrower Information
  page4Completed: boolean;          // Financial Assets & Liabilities
  page5Completed: boolean;          // Income Information
  page6Completed: boolean;          // Employment & Business
  page7Completed: boolean;          // Property Details
  page8Completed: boolean;          // Construction Plans
  page9Completed: boolean;          // Contractor Information
  page10Completed: boolean;         // Budget & Timeline
  page11Completed: boolean;         // Insurance & Permits
  page12Completed: boolean;         // Review & Submit
  
  // Overall Progress
  overallProgress: number;          // 0-100
  sectionsCompleted: number;        // 0-12
  totalSections: number;            // 12
  
  // Document Progress
  documentsRequired: number;
  documentsUploaded: number;
  documentsVerified: number;
  documentsMissing: number;
  
  // Timeline
  applicationStarted: Timestamp;
  lastUpdated: Timestamp;
  estimatedCompletion?: Timestamp;
}

// ============================================================================
// APPLICATION HISTORY
// ============================================================================

export interface ApplicationHistoryEntry {
  action: string;                   // "application_created", "page_completed", "document_uploaded"
  description: string;              // "Page 1 completed", "Purchase contract uploaded"
  performedBy: string;              // User ID
  timestamp: Timestamp;             // When action occurred
  details?: any;                    // Additional context
  status?: string;                  // Application status at time of action
}

// ============================================================================
// NOTES & COMMENTS
// ============================================================================

export interface ApplicationNotes {
  brokerNotes?: string;             // Broker's internal notes
  borrowerNotes?: string;           // Borrower's notes
  underwriterNotes?: string;        // Underwriter's notes
  processorNotes?: string;          // Processor's notes
  noteHistory: Array<{
    note: string;
    author: string;                 // User ID
    timestamp: Timestamp;
    type: 'broker' | 'borrower' | 'underwriter' | 'processor';
  }>;
}

// ============================================================================
// PAGE 1: LOAN & PROPERTY DETAILS
// ============================================================================

export interface PropertyInformation {
  // Basic Property Information
  propertyAddress: string;           // "123 Main St, Anytown, USA"
  propertyApn: string;              // "123-456-789"
  annualPropertyTaxes: number;      // 5000
  propertyType: 'multi-family' | 'mixed-use' | 'retail' | 'restaurant' | 'hospitality' | 'office' | 'medical' | 'other';
  otherPropertyType?: string;       // If "other" is selected
  
  // Property Values
  asIsValue: number;                // 350000
  afterConstructedValue: number;    // 1000000
  stabilizedValue: number;          // 1200000
  
  // Physical Characteristics
  propertySquareFootage: number;    // 2000
  lotSize: string;                  // "10,000 sq. ft." or "0.23 acres"
  constructionTime: number;         // 6 (months)
  
  // Dates
  requestedClosingDate: Timestamp;  // Timestamp object
}

export interface LoanDetails {
  // Loan Information
  loanAmount: number;               // 300000
  transactionType: 'purchase' | 'refinance';
  
  // Purchase Details (if transactionType === 'purchase')
  purchasePrice?: number;           // 400000
  
  // Refinance Details (if transactionType === 'refinance')
  originalPurchasePrice?: number;   // 350000
  purchaseDate?: Timestamp;         // Timestamp object
  currentDebt?: number;             // 150000
}

export interface BusinessInformation {
  // Company Information
  companyName: string;              // "Real Estate Holdings LLC"
  companyEin: string;               // "12-3456789"
}

// ============================================================================
// PAGE 2: COMPANY PROFIT & LOSS STATEMENT
// ============================================================================

export interface FinancialInformation {
  // Revenue & COGS
  revenue: number;                  // 50000
  cogs: number;                     // 15000
  grossProfit: number;              // Calculated: 35000
  
  // Operating Expenses
  salaries: number;                 // 8000
  rent: number;                     // 2000
  utilities: number;                // 500
  marketing: number;                // 1000
  repairs: number;                  // 1500
  otherExpenses: number;            // 500
  
  // Calculated Fields
  totalOperatingExpenses: number;   // Calculated: 13500
  netOperatingIncome: number;       // Calculated: 21500
}

// ============================================================================
// PAGE 3: BORROWER INFORMATION
// ============================================================================

export interface BorrowerInformation {
  // Personal Information
  fullName: string;                 // "John Construction Investor"
  email: string;                    // "john@construction.com"
  phone: string;                    // "555-123-4567"
  dateOfBirth: Timestamp;           // Timestamp object
  ssn: string;                      // "123-45-6789"
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  dependents: number;               // 2
  
  // Address Information
  currentAddress: {
    street: string;                  // "123 Main Street"
    city: string;                    // "Austin"
    state: string;                   // "TX"
    zipCode: string;                 // "78701"
    yearsAtAddress: number;          // 5
    rentOrOwn: 'rent' | 'own';
    monthlyPayment?: number;         // 2500
  };
  
  // Employment Information
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'military';
  annualIncome: number;             // 120000
  creditScore?: number;             // 750
  citizenship: 'us_citizen' | 'permanent_resident' | 'non_resident_alien';
}

// ============================================================================
// PAGE 4: FINANCIAL ASSETS & LIABILITIES
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
  
  // Real Estate
  realEstate: Array<{
    address: string;
    propertyType: string;
    currentValue: number;
    equity: number;
    monthlyRent?: number;
  }>;
  
  // Vehicles
  vehicles: Array<{
    make: string;
    model: string;
    year: number;
    currentValue: number;
    lienAmount?: number;
  }>;
  
  // Other Assets
  otherAssets: Array<{
    description: string;
    value: number;
    type: string;
  }>;
  
  // Total
  totalAssets: number;              // Calculated total
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
    interestRate: number;
  }>;
  
  // Student Loans
  studentLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    interestRate: number;
  }>;
  
  // Auto Loans
  autoLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    interestRate: number;
  }>;
  
  // Mortgages
  mortgages: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    interestRate: number;
    propertyAddress: string;
  }>;
  
  // Business Loans
  businessLoans: Array<{
    institution: string;
    accountNumber: string;
    balance: number;
    monthlyPayment: number;
    interestRate: number;
    businessName: string;
  }>;
  
  // Other Liabilities
  otherLiabilities: Array<{
    description: string;
    balance: number;
    monthlyPayment: number;
    type: string;
  }>;
  
  // Total
  totalLiabilities: number;         // Calculated total
}

// ============================================================================
// PAGE 5: INCOME INFORMATION
// ============================================================================

export interface IncomeInformation {
  // Employment Income
  employmentIncome: {
    salary: number;                  // 80000
    hourly: number;                  // 0
    commission: number;              // 20000
    bonus: number;                   // 15000
    overtime: number;                // 5000
    total: number;                   // Calculated: 120000
  };
  
  // Business Income
  businessIncome: {
    netBusinessIncome: number;       // 50000
    distributions: number;           // 10000
    total: number;                   // Calculated: 60000
  };
  
  // Investment Income
  investmentIncome: {
    dividends: number;               // 5000
    interest: number;                // 3000
    capitalGains: number;            // 10000
    rentalIncome: number;            // 24000
    total: number;                   // Calculated: 42000
  };
  
  // Other Income
  otherIncome: {
    socialSecurity: number;          // 0
    disability: number;              // 0
    alimony: number;                 // 0
    childSupport: number;            // 0
    military: number;                // 0
    other: number;                   // 5000
    total: number;                   // Calculated: 5000
  };
  
  // Totals
  totalMonthlyIncome: number;       // Calculated monthly total
  totalAnnualIncome: number;        // Calculated annual total
}

// ============================================================================
// PAGE 6: EMPLOYMENT & BUSINESS
// ============================================================================

export interface EmploymentInformation {
  // Current Employment
  currentEmployer: {
    companyName: string;
    position: string;
    startDate: Timestamp;
    annualSalary: number;
    supervisorName: string;
    supervisorPhone: string;
    companyAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Previous Employment (Last 2 years)
  previousEmployment: Array<{
    companyName: string;
    position: string;
    startDate: Timestamp;
    endDate: Timestamp;
    annualSalary: number;
    reasonForLeaving: string;
  }>;
}

export interface BusinessInformationExtended {
  // Company Details
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
  businessPlan?: string;             // URL to uploaded business plan
  
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
// PAGE 7: PROPERTY DETAILS
// ============================================================================

export interface PropertyDetailsExtended {
  // Zoning and Permits
  zoning: string;
  permittedUses: string[];
  buildingPermits: Array<{
    permitNumber: string;
    type: string;
    issueDate: Timestamp;
    status: 'pending' | 'approved' | 'completed';
  }>;
  
  // Environmental Information
  environmentalIssues: {
    hasIssues: boolean;
    issues?: string[];
    reports?: string[];              // Array of file URLs
  };
  
  // Property Photos and Documents
  propertyPhotos: string[];          // Array of file URLs
  propertyDocuments: string[];       // Array of file URLs
  
  // HOA Information
  hoaContact?: {
    name: string;
    phone: string;
    email: string;
  };
  hoaFees?: number;
}

// ============================================================================
// PAGE 8: CONSTRUCTION PLANS
// ============================================================================

export interface ConstructionPlans {
  // Plan Documents
  architecturalPlans?: string;       // File URL
  structuralPlans?: string;          // File URL
  mechanicalPlans?: string;          // File URL
  electricalPlans?: string;          // File URL
  sitePlans?: string;                // File URL
  
  // Plan Details
  planRevision: string;              // "Rev A", "Rev B", etc.
  planDate: Timestamp;               // When plans were created
  architectName: string;
  architectLicense: string;
  engineerName: string;
  engineerLicense: string;
  
  // Plan Status
  plansApproved: boolean;
  approvalDate?: Timestamp;
  approvalAuthority: string;
  approvalNumber: string;
}

// ============================================================================
// PAGE 9: CONTRACTOR INFORMATION
// ============================================================================

export interface ContractorInformation {
  // General Contractor
  generalContractor: {
    name: string;                     // "ABC Construction & Development LLC"
    license: string;                  // "TECB123456"
    insurance: {
      generalLiability: string;       // "GL789012"
      workersComp: string;            // "WC345678"
      buildersRisk: string;           // "BR901234"
    };
    bond?: string;                    // Bond number if applicable
    experience: number;               // Years of experience
    references: Array<{
      name: string;                   // "Sarah Johnson"
      phone: string;                  // "555-111-2222"
      project: string;                // "Modern Home Build - Cedar Park"
      year: string;                   // "2023"
    }>;
  };
  
  // Subcontractors
  subcontractors: Array<{
    name: string;
    trade: string;                    // "Electrical", "Plumbing", "HVAC"
    license: string;
    insurance: string;
    experience: number;
    references: Array<{
      name: string;
      phone: string;
      project: string;
      year: string;
    }>;
  }>;
}

// ============================================================================
// PAGE 10: BUDGET & TIMELINE
// ============================================================================

export interface ConstructionBudget {
  // Budget Breakdown
  totalBudget: number;               // 400000
  breakdown: Array<{
    category: string;                 // "Foundation & Site Work"
    amount: number;                   // 45000
    percentage: number;               // 11
    description?: string;
  }>;
  
  // Budget Categories
  contingency: number;                // 40000
  softCosts: number;                  // 35000
  hardCosts: number;                  // 365000
  
  // Funding Sources
  fundingSources: Array<{
    source: string;                   // "Construction Loan", "Equity", "Other"
    amount: number;
    percentage: number;
    description?: string;
  }>;
}

export interface ConstructionTimeline {
  // Timeline Overview
  startDate: Timestamp;               // "2024-03-01"
  completionDate: Timestamp;          // "2024-12-01"
  duration: number;                   // 9 (months)
  
  // Milestones
  milestones: Array<{
    milestone: string;                // "Foundation Complete"
    date: Timestamp;                  // "2024-04-01"
    percentage: number;               // 15
    description?: string;
  }>;
  
  // Critical Path
  criticalPath: Array<{
    activity: string;
    duration: number;                 // Days
    dependencies: string[];           // Activities this depends on
    slack: number;                    // Days of flexibility
  }>;
}

// ============================================================================
// PAGE 11: INSURANCE & PERMITS
// ============================================================================

export interface InsuranceInformation {
  // Builders Risk Insurance
  buildersRisk: {
    carrier: string;                  // "Construction Insurance Co"
    policyNumber: string;             // "BR123456"
    coverage: number;                 // 500000
    premium: number;                  // 5000
    effectiveDate: Timestamp;
    expirationDate: Timestamp;
    deductible: number;
  };
  
  // General Liability Insurance
  generalLiability: {
    carrier: string;                  // "Construction Insurance Co"
    policyNumber: string;             // "GL789012"
    coverage: number;                 // 1000000
    premium: number;                  // 3000
    effectiveDate: Timestamp;
    expirationDate: Timestamp;
    deductible: number;
  };
  
  // Workers Compensation
  workersComp: {
    carrier: string;
    policyNumber: string;
    coverage: number;
    premium: number;
    effectiveDate: Timestamp;
    expirationDate: Timestamp;
  };
  
  // Additional Insurance
  additionalInsurance: Array<{
    type: string;                     // "Umbrella", "Equipment", "Professional"
    carrier: string;
    policyNumber: string;
    coverage: number;
    premium: number;
  }>;
}

export interface PermitInformation {
  // Building Permits
  buildingPermits: Array<{
    permitNumber: string;
    type: string;                     // "Building", "Electrical", "Plumbing"
    issueDate: Timestamp;
    status: 'pending' | 'approved' | 'completed';
    fee: number;
    description: string;
  }>;
  
  // Other Permits
  otherPermits: Array<{
    permitNumber: string;
    type: string;                     // "Environmental", "Zoning", "Utility"
    issueDate: Timestamp;
    status: 'pending' | 'approved' | 'completed';
    fee: number;
    description: string;
  }>;
  
  // Permit Status
  allPermitsApproved: boolean;
  permitIssues?: string[];
  resolutionDate?: Timestamp;
}

// ============================================================================
// PAGE 12: REVIEW & SUBMIT
// ============================================================================

export interface ApplicationReview {
  // Review Checklist
  reviewChecklist: {
    allPagesCompleted: boolean;
    allDocumentsUploaded: boolean;
    allRequiredFieldsFilled: boolean;
    financialsVerified: boolean;
    plansApproved: boolean;
    permitsObtained: boolean;
    insuranceInPlace: boolean;
    contractorVetted: boolean;
  };
  
  // Final Review
  finalReview: {
    reviewedBy: string;               // User ID of reviewer
    reviewDate: Timestamp;
    reviewNotes: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  };
  
  // Submission
  submission: {
    submittedBy: string;              // User ID of submitter
    submittedAt: Timestamp;
    submissionMethod: 'online' | 'email' | 'in_person';
    confirmationNumber: string;
  };
}

// ============================================================================
// MAIN APPLICATION INTERFACE
// ============================================================================

export interface ResidentialNOOGroundUpConstructionApplication {
  // ============================================================================
  // BASIC APPLICATION METADATA
  // ============================================================================
  id?: string;
  userId: string;                     // Borrower's user ID
  brokerId: string;                   // Broker's user ID
  loanType: 'residential_noo_ground_up_construction';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'closed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // ============================================================================
  // APPLICATION CONTENT BY PAGE
  // ============================================================================
  
  // Page 1: Loan & Property Details
  propertyInfo: PropertyInformation;
  loanDetails: LoanDetails;
  businessInfo: BusinessInformation;
  
  // Page 2: Company P&L Statement
  financialInfo: FinancialInformation;
  
  // Page 3: Borrower Information
  borrowerInfo: BorrowerInformation;
  
  // Page 4: Financial Assets & Liabilities
  financialAssets: FinancialAssets;
  financialLiabilities: FinancialLiabilities;
  
  // Page 5: Income Information
  incomeInfo: IncomeInformation;
  
  // Page 6: Employment & Business
  employmentInfo: EmploymentInformation;
  businessInfoExtended: BusinessInformationExtended;
  
  // Page 7: Property Details
  propertyDetails: PropertyDetailsExtended;
  
  // Page 8: Construction Plans
  constructionPlans: ConstructionPlans;
  
  // Page 9: Contractor Information
  contractorInfo: ContractorInformation;
  
  // Page 10: Budget & Timeline
  constructionBudget: ConstructionBudget;
  constructionTimeline: ConstructionTimeline;
  
  // Page 11: Insurance & Permits
  insuranceInfo: InsuranceInformation;
  permitInfo: PermitInformation;
  
  // Page 12: Review & Submit
  applicationReview: ApplicationReview;
  
  // ============================================================================
  // DOCUMENTS & UPLOADS
  // ============================================================================
  documents: {
    // Purchase Documents (if applicable)
    executedPurchaseContract?: ApplicationDocument;
    earnestMoneyEvidence?: ApplicationDocument;
    
    // Company Documents
    einCertificate: ApplicationDocument;
    formationDocumentation: ApplicationDocument;
    operatingAgreementBylaws: ApplicationDocument;
    partnershipOfficerList: ApplicationDocument;
    businessLicense: ApplicationDocument;
    certificateOfGoodStanding: ApplicationDocument;
    
    // Construction Documents
    architecturalPlans?: ApplicationDocument;
    structuralPlans?: ApplicationDocument;
    mechanicalPlans?: ApplicationDocument;
    electricalPlans?: ApplicationDocument;
    sitePlans?: ApplicationDocument;
    
    // Insurance Documents
    buildersRiskPolicy?: ApplicationDocument;
    generalLiabilityPolicy?: ApplicationDocument;
    workersCompPolicy?: ApplicationDocument;
    
    // Permit Documents
    buildingPermits: ApplicationDocument[];
    otherPermits: ApplicationDocument[];
    
    // Additional Documents
    additionalDocuments: ApplicationDocument[];
  };
  
  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================
  progress: ApplicationProgress;
  
  // ============================================================================
  // APPLICATION HISTORY
  // ============================================================================
  history: ApplicationHistoryEntry[];
  
  // ============================================================================
  // NOTES & COMMENTS
  // ============================================================================
  notes: ApplicationNotes;
  
  // ============================================================================
  // CALCULATED FIELDS
  // ============================================================================
  calculatedFields: {
    // Financial Ratios
    debtToIncomeRatio: number;       // Calculated from income and liabilities
    loanToValueRatio: number;        // Calculated from loan amount and property value
    debtServiceCoverageRatio: number; // Calculated from income and debt payments
    
    // Construction Metrics
    constructionCostPerSqFt: number; // Calculated from budget and square footage
    timelineEfficiency: number;      // Calculated from timeline and milestones
    
    // Risk Metrics
    riskScore: number;               // Calculated risk assessment
    riskFactors: string[];           // Array of identified risk factors
  };
}
