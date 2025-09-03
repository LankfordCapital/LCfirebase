// Comprehensive Loan Program Configuration
// This file defines all loan programs, their requirements, and specific data fields

import { LoanProgram, LoanCategory, LoanProgramRequirements } from './enhanced-loan-application-types';

// ============================================================================
// LOAN PROGRAM CONFIGURATION
// ============================================================================

export const LOAN_PROGRAMS: Record<LoanProgram, LoanProgramRequirements> = {
  // ============================================================================
  // RESIDENTIAL NOO PROGRAMS
  // ============================================================================
  
  'residential_noo_ground_up_construction': {
    program: 'residential_noo_ground_up_construction',
    category: 'residential_noo',
    name: 'Residential NOO - Ground Up Construction',
    description: 'New construction financing for residential investment properties (1-4 units)',
    typicalTerms: '12-24 months',
    estimatedProcessing: '7-14 days',
    features: [
      'New construction financing',
      'Investment properties only',
      'Flexible draw schedules',
      'Competitive rates',
      'Quick approval process',
      'Nationwide availability'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License (Borrower)",
        "Personal Financial Statement",
        "Credit Report (Borrower)",
        "Personal Asset Statement (Month 1)",
        "Personal Asset Statement (Month 2)",
        "Personal Asset Statement (Month 3)",
        "Proof of Funds for down payment and reserves"
      ],
      company: [
        "EIN Certificate (Company)",
        "Formation Documentation (Company)",
        "Operating Agreement/Bylaws (Company)",
        "Partnership/Officer List (Company)",
        "Business License (Company)",
        "Certificate of Good Standing (Company)"
      ],
      subjectProperty: [
        "Executed Purchase Contract",
        "Evidence of Earnest Money Deposit",
        "Property HUD-1/Settlement Statement (if already purchased)",
        "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
        "Marked Up Title Commitment",
        "Escrow Instructions",
        "Closing Protection Letter",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis",
        "General Contractor License",
        "General Contractor Insurance",
        "General Contractor Bond",
        "General Contractor's Contract to Build",
        "Construction Budget",
        "Projected Draw Schedule",
        "Approved or Pre-approved Plans",
        "Approved Permits",
        "Builder's Risk Insurance Quote",
        "Commercial Liability Insurance Quote"
      ]
    }
  },

  'residential_noo_fix_and_flip': {
    program: 'residential_noo_fix_and_flip',
    category: 'residential_noo',
    name: 'Residential NOO - Fix and Flip',
    description: 'Short-term financing for purchasing, renovating, and selling residential properties',
    typicalTerms: '6-18 months',
    estimatedProcessing: '5-10 days',
    features: [
      'Purchase + renovation financing',
      'Quick funding',
      'Flexible terms',
      'No income verification',
      'Up to 90% of purchase price',
      'Interest-only payments'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Proof of Funds for down payment and reserves"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Executed Purchase Contract",
        "Evidence of Earnest Money Deposit",
        "Marked Up Title Commitment",
        "Rehab Budget",
        "Property HUD-1/Settlement Statement (if already purchased)",
        "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'residential_noo_dscr': {
    program: 'residential_noo_dscr',
    category: 'residential_noo',
    name: 'Residential NOO - DSCR',
    description: 'Long-term financing based on property cash flow rather than personal income',
    typicalTerms: '30 years',
    estimatedProcessing: '14-21 days',
    features: [
      'Long-term financing',
      'Cash flow based qualification',
      'No personal income verification',
      'Investment focus',
      'Competitive rates',
      'Amortization up to 30 years'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Purchase and Sale Agreement (or HUD-1 if refinance)",
        "Evidence of Earnest Money Deposit",
        "Lease Agreements for subject property (if applicable)",
        "Projected Lease Comparables (if vacant)",
        "Commercial Liability Insurance Quote",
        "Marked Up Title Commitment",
        "30-Day Payoff Statement with Per Diem (if a refinance)",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'residential_noo_bridge': {
    program: 'residential_noo_bridge',
    category: 'residential_noo',
    name: 'Residential NOO - Bridge',
    description: 'Short-term financing to bridge the gap between property purchase and long-term financing',
    typicalTerms: '6-24 months',
    estimatedProcessing: '7-14 days',
    features: [
      'Quick funding',
      'Flexible terms',
      'Bridge to permanent financing',
      'No prepayment penalty',
      'Fast closing',
      'Secure opportunities quickly'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Proof of Funds for down payment and reserves"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Executed Purchase Contract",
        "Evidence of Earnest Money Deposit",
        "Marked Up Title Commitment",
        "Property HUD-1/Settlement Statement (if already purchased)",
        "30-Day Payoff Statement with Per diem (if property has a mortgage)",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  // ============================================================================
  // COMMERCIAL PROGRAMS
  // ============================================================================

  'commercial_ground_up_construction': {
    program: 'commercial_ground_up_construction',
    category: 'commercial',
    name: 'Commercial - Ground Up Construction',
    description: 'Construction financing for commercial properties including retail, office, and mixed-use',
    typicalTerms: '18-36 months',
    estimatedProcessing: '14-21 days',
    features: [
      'New construction financing',
      'Commercial properties',
      'Flexible terms',
      'Project management support',
      'Structured financing',
      'Expert project analysis'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Executive Summary",
        "Pro-forma Projections (5 years, month-by-month)",
        "Sources and Uses Statement",
        "Environmental Report",
        "Purchase and Sale Agreement (or HUD-1 if refinance)",
        "Evidence of Earnest Money Deposit",
        "30-Day Payoff Statement with Per Diem (if refinance)",
        "Marked Up Title Commitment",
        "Builder's Risk Insurance Quote",
        "Commercial Liability Insurance Quote",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis",
        "Approved or Pre-approved Plans",
        "Approved Permits",
        "Construction Plans",
        "Construction Budget",
        "General Contractor's Contract to Build",
        "General Contractor License",
        "General Contractor Insurance",
        "General Contractor Bond",
        "Projected Draw Schedule"
      ]
    }
  },

  'commercial_rehab_loans': {
    program: 'commercial_rehab_loans',
    category: 'commercial',
    name: 'Commercial - Rehab Loans',
    description: 'Financing for renovating and improving existing commercial properties',
    typicalTerms: '12-24 months',
    estimatedProcessing: '10-14 days',
    features: [
      'Renovation financing',
      'Existing properties',
      'Value-add strategy',
      'Quick funding',
      'Cover hard and soft costs',
      'Quick closing'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Current Rent Roll",
        "Rehab Budget and Plans",
        "Purchase Agreement (if applicable)",
        "Evidence of Earnest Money Deposit",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'commercial_acquisition_bridge': {
    program: 'commercial_acquisition_bridge',
    category: 'commercial',
    name: 'Commercial - Acquisition & Bridge',
    description: 'Short-term financing to acquire property or bridge funding gaps',
    typicalTerms: '6-24 months',
    estimatedProcessing: '7-14 days',
    features: [
      'Fast access to capital',
      'Flexible terms',
      'Solutions for complex deals',
      'Quick closing',
      'Bridge to permanent financing'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Trailing 12-month Operating Statement",
        "Purchase Agreement",
        "Evidence of Earnest Money Deposit",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'commercial_conventional_long_term': {
    program: 'commercial_conventional_long_term',
    category: 'commercial',
    name: 'Commercial - Conventional Long Term Debt',
    description: 'Stable, long-term financing solutions for stabilized commercial properties',
    typicalTerms: '5-30 years',
    estimatedProcessing: '21-30 days',
    features: [
      'Competitive fixed rates',
      'Amortization up to 30 years',
      'Refinancing options',
      'Stable long-term financing',
      'Lower rates for stabilized properties'
    ],
    requirements: {
      borrower: [
        "Personal Tax Returns (Last 2 Years)"
      ],
      company: [
        "Business Entity Tax Returns (Last 2 Years)"
      ],
      subjectProperty: [
        "Trailing 12-Month Profit & Loss Statement",
        "Previous Year 1 Profit & Loss Statement",
        "Previous Year 2 Profit & Loss Statement"
      ]
    }
  },

  // ============================================================================
  // INDUSTRIAL PROGRAMS
  // ============================================================================

  'industrial_ground_up_construction': {
    program: 'industrial_ground_up_construction',
    category: 'industrial',
    name: 'Industrial - Ground Up Construction',
    description: 'Financing for the construction of new warehouses, distribution centers, and manufacturing facilities',
    typicalTerms: '18-36 months',
    estimatedProcessing: '14-21 days',
    features: [
      'New industrial construction',
      'Warehouses and distribution centers',
      'Manufacturing facilities',
      'Flexible terms',
      'Project management support'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "General Contractor License",
        "General Contractor Insurance",
        "General Contractor Bond",
        "Purchase and Sale Agreement",
        "Evidence of Earnest Money Deposit",
        "Environmental Reports",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis",
        "Approved or Pre-approved Plans",
        "Approved Permits",
        "Construction Plans, Budget, and Timeline",
        "Construction Budget",
        "Projected Draw Schedule"
      ]
    }
  },

  'industrial_rehab_expansion': {
    program: 'industrial_rehab_expansion',
    category: 'industrial',
    name: 'Industrial - Rehab & Expansion',
    description: 'Funding to renovate, expand, or modernize your existing industrial properties',
    typicalTerms: '12-24 months',
    estimatedProcessing: '10-14 days',
    features: [
      'Renovation and expansion financing',
      'Existing industrial properties',
      'Modernization funding',
      'Quick funding',
      'Value-add opportunities'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "General Contractor License",
        "General Contractor Insurance",
        "General Contractor Bond",
        "Current Property Operating Statements",
        "Rehab/Expansion Plans and Budget",
        "Purchase Agreement (if applicable)",
        "Evidence of Earnest Money Deposit",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'industrial_acquisition_bridge': {
    program: 'industrial_acquisition_bridge',
    category: 'industrial',
    name: 'Industrial - Acquisition & Bridge',
    description: 'Secure capital quickly to acquire new industrial assets or bridge financing periods',
    typicalTerms: '6-24 months',
    estimatedProcessing: '7-14 days',
    features: [
      'Quick industrial acquisition',
      'Bridge financing',
      'Fast capital access',
      'Flexible terms',
      'Complex deal solutions'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Trailing 12-month Operating Statement for property",
        "Purchase Agreement",
        "Evidence of Earnest Money Deposit",
        "Marked Up Title Commitment",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'industrial_long_term_debt': {
    program: 'industrial_long_term_debt',
    category: 'industrial',
    name: 'Industrial - Long Term Debt',
    description: 'Stable, long-term financing for your income-producing industrial portfolio',
    typicalTerms: '5-30 years',
    estimatedProcessing: '21-30 days',
    features: [
      'Long-term industrial financing',
      'Income-producing properties',
      'Stable rates',
      'Amortization up to 30 years',
      'Portfolio financing'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned",
        "Personal Tax Returns (Last 2 Years)"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing",
        "Business Entity Tax Returns (Last 2 Years)"
      ],
      subjectProperty: [
        "Trailing 12-Month Profit & Loss Statement",
        "Previous Year 1 Profit & Loss Statement",
        "Previous Year 2 Profit & Loss Statement"
      ]
    }
  },

  // ============================================================================
  // OTHER PROGRAMS
  // ============================================================================

  'land_acquisition': {
    program: 'land_acquisition',
    category: 'land_acquisition',
    name: 'Land Acquisition',
    description: 'Funding for the purchase and development of land',
    typicalTerms: '12-36 months',
    estimatedProcessing: '10-14 days',
    features: [
      'Land purchase financing',
      'Development funding',
      'Flexible terms',
      'Zoning and entitlement support',
      'Environmental considerations'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing"
      ],
      subjectProperty: [
        "Executed Purchase Contract",
        "Evidence of Earnest Money Deposit",
        "Feasibility Study",
        "Zoning and Entitlement Documents",
        "Environmental Report",
        "Property Tax Certificate",
        "Appraisal",
        "Collateral Desktop Analysis"
      ]
    }
  },

  'mezzanine_loans': {
    program: 'mezzanine_loans',
    category: 'mezzanine',
    name: 'Mezzanine Loans',
    description: 'Hybrid debt and equity financing to bridge funding gaps',
    typicalTerms: '3-7 years',
    estimatedProcessing: '14-21 days',
    features: [
      'Hybrid debt and equity',
      'Bridge funding gaps',
      'Flexible structure',
      'Higher leverage',
      'Complex deal solutions'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report",
        "Sponsor Financials",
        "Experience",
        "Real Estate Owned"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing",
        "Capital Stack overview"
      ],
      subjectProperty: [
        "Senior Debt Term Sheet",
        "Full Project Pro-forma"
      ]
    }
  },

  'mobilization_funding': {
    program: 'mobilization_funding',
    category: 'mobilization',
    name: 'Mobilization Funding',
    description: 'Funding for project mobilization and startup costs',
    typicalTerms: '6-18 months',
    estimatedProcessing: '7-14 days',
    features: [
      'Project mobilization',
      'Startup costs',
      'Quick funding',
      'Flexible use of funds',
      'Project-based financing'
    ],
    requirements: {
      borrower: [
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing",
        "Company Financials"
      ],
      subjectProperty: [
        "Executed Contract for the project",
        "Detailed Use of Funds"
      ]
    }
  },

  'equipment_financing': {
    program: 'equipment_financing',
    category: 'equipment',
    name: 'Equipment Financing',
    description: 'Secure funding for essential business equipment',
    typicalTerms: '12-84 months',
    estimatedProcessing: '5-10 days',
    features: [
      'Equipment financing',
      'Quick approval',
      'Flexible terms',
      'Competitive rates',
      'Equipment as collateral'
    ],
    requirements: {
      borrower: [
        "Application Form",
        "ID/Driver's License",
        "Personal Financial Statement",
        "Credit Report"
      ],
      company: [
        "EIN Certificate",
        "Formation Documentation",
        "Operating Agreement/Bylaws",
        "Partnership/Officer List",
        "Business License",
        "Certificate of Good Standing",
        "Business Financials (if over $100k)"
      ],
      subjectProperty: [
        "Equipment Quote or Invoice"
      ]
    }
  },

  'sba_loans': {
    program: 'sba_loans',
    category: 'sba',
    name: 'SBA Loans',
    description: 'Small Business Administration guaranteed loans',
    typicalTerms: '7-25 years',
    estimatedProcessing: '21-45 days',
    features: [
      'SBA guarantee',
      'Lower down payments',
      'Longer terms',
      'Competitive rates',
      'Government backing'
    ],
    requirements: {
      borrower: [
        "SBA Application Form",
        "Personal Financial Statement",
        "Personal Tax Returns (3 years)",
        "Credit Report",
        "Resume"
      ],
      company: [
        "Business Plan",
        "Business Tax Returns (3 years)",
        "Business Financial Statements",
        "Business License",
        "Articles of Incorporation"
      ],
      subjectProperty: [
        "Use of Proceeds Statement",
        "Collateral Documentation",
        "Business Plan",
        "Financial Projections"
      ]
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLoanProgram(program: LoanProgram): LoanProgramRequirements {
  return LOAN_PROGRAMS[program];
}

export function getLoanProgramsByCategory(category: LoanCategory): LoanProgramRequirements[] {
  return Object.values(LOAN_PROGRAMS).filter(program => program.category === category);
}

export function getAllLoanPrograms(): LoanProgramRequirements[] {
  return Object.values(LOAN_PROGRAMS);
}

export function getLoanProgramByName(name: string): LoanProgramRequirements | undefined {
  return Object.values(LOAN_PROGRAMS).find(program => program.name === name);
}

export function getRequiredDocuments(program: LoanProgram): {
  borrower: string[];
  company: string[];
  subjectProperty: string[];
} {
  const loanProgram = LOAN_PROGRAMS[program];
  return loanProgram.requirements;
}

export function getTotalRequiredDocuments(program: LoanProgram): number {
  const requirements = getRequiredDocuments(program);
  return requirements.borrower.length + requirements.company.length + requirements.subjectProperty.length;
}

// ============================================================================
// LOAN PROGRAM FEATURES AND BENEFITS
// ============================================================================

export const LOAN_PROGRAM_FEATURES = {
  residential_noo: {
    maxLoanAmount: 5000000,
    maxLTC: 85,
    maxARV: 70,
    minCreditScore: 650,
    states: 'Nationwide, except ND/SD/VT',
    processingTime: '5-21 days',
    drawSchedule: 'Available for construction loans',
    prepaymentPenalty: 'None'
  },
  commercial: {
    maxLoanAmount: 25000000,
    maxLTC: 80,
    maxARV: 75,
    minCreditScore: 680,
    states: 'Nationwide',
    processingTime: '7-30 days',
    drawSchedule: 'Available for construction loans',
    prepaymentPenalty: 'Varies by program'
  },
  industrial: {
    maxLoanAmount: 50000000,
    maxLTC: 85,
    maxARV: 75,
    minCreditScore: 680,
    states: 'Nationwide',
    processingTime: '7-30 days',
    drawSchedule: 'Available for construction loans',
    prepaymentPenalty: 'Varies by program'
  },
  land_acquisition: {
    maxLoanAmount: 10000000,
    maxLTC: 70,
    maxARV: 65,
    minCreditScore: 680,
    states: 'Nationwide',
    processingTime: '10-14 days',
    drawSchedule: 'Not applicable',
    prepaymentPenalty: 'Varies by program'
  },
  mezzanine: {
    maxLoanAmount: 50000000,
    maxLTC: 95,
    maxARV: 85,
    minCreditScore: 700,
    states: 'Nationwide',
    processingTime: '14-21 days',
    drawSchedule: 'Not applicable',
    prepaymentPenalty: 'Varies by structure'
  },
  mobilization: {
    maxLoanAmount: 5000000,
    maxLTC: 90,
    maxARV: 80,
    minCreditScore: 650,
    states: 'Nationwide',
    processingTime: '7-14 days',
    drawSchedule: 'Available',
    prepaymentPenalty: 'None'
  },
  equipment: {
    maxLoanAmount: 2000000,
    maxLTC: 100,
    maxARV: 100,
    minCreditScore: 650,
    states: 'Nationwide',
    processingTime: '5-10 days',
    drawSchedule: 'Not applicable',
    prepaymentPenalty: 'None'
  },
  sba: {
    maxLoanAmount: 5000000,
    maxLTC: 90,
    maxARV: 85,
    minCreditScore: 680,
    states: 'Nationwide',
    processingTime: '21-45 days',
    drawSchedule: 'Available for construction',
    prepaymentPenalty: 'Varies by SBA program'
  }
};
