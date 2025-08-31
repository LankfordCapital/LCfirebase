import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';

// Types for Firestore documents (same as client-side)
export interface FirestoreUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  authProvider?: string;
  hasPassword?: boolean;
  updatedAt?: any;
  generatedPassword?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface LoanApplication {
  id?: string;
  // Core application info
  userId: string; // This is the borrower's user ID
  brokerId: string; // The broker who created/manages this application
  loanType: 'residential' | 'commercial' | 'construction' | 'refinance' | 'home_equity' | 'land' | 'investment' | 'multi_family' | 'mixed_use' | 'other';
  program: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  
  // Timestamps
  createdAt: any;
  updatedAt: any;
  submittedAt?: any;
  assignedTo?: string; // Workforce member assigned for underwriting
  
  // Borrower Information (collected at start)
  borrowerInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
    annualIncome: number;
    creditScore?: number;
    // Additional borrower details
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    dependents?: number;
    yearsAtCurrentAddress?: number;
    previousAddresses?: Array<{
      street: string;
      city: string;
      state: string;
      zipCode: string;
      yearsLived: number;
    }>;
  };
  
  // Business Information (if applicable)
  businessInfo?: {
    businessName: string;
    businessType: string;
    ein: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    yearsInBusiness: number;
    annualRevenue: number;
    ownershipPercentage: number;
    // Additional business details
    businessStructure?: 'llc' | 'corporation' | 'partnership' | 'sole_proprietorship';
    industry?: string;
    numberOfEmployees?: number;
    businessPlan?: string; // URL to uploaded business plan
  };
  
  // Loan Details
  loanDetails: {
    loanAmount: number;
    loanPurpose: string;
    term: number;
    propertyType: string;
    propertyAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    downPayment: number;
    downPaymentPercentage: number;
    interestRate?: number;
    monthlyPayment?: number;
    // Additional loan details
    loanToValueRatio?: number;
    debtToIncomeRatio?: number;
    propertyValue?: number;
    purchasePrice?: number;
    closingCosts?: number;
    escrowRequired?: boolean;
    prepaymentPenalty?: boolean;
    balloonPayment?: boolean;
  };
  
  // Financial Information
  financialInfo?: {
    monthlyDebt: number;
    assets: number;
    liabilities: number;
    debtToIncomeRatio?: number;
    loanToValueRatio?: number;
    // Additional financial details
    checkingAccounts?: Array<{
      institution: string;
      accountNumber: string;
      balance: number;
    }>;
    savingsAccounts?: Array<{
      institution: string;
      accountNumber: string;
      balance: number;
    }>;
    investments?: Array<{
      type: string;
      institution: string;
      value: number;
    }>;
    realEstate?: Array<{
      address: string;
      type: string;
      value: number;
      mortgageBalance?: number;
      monthlyRent?: number;
    }>;
    vehicles?: Array<{
      year: string;
      make: string;
      model: string;
      value: number;
      loanBalance?: number;
    }>;
    otherAssets?: Array<{
      description: string;
      value: number;
    }>;
    creditCards?: Array<{
      institution: string;
      accountNumber: string;
      balance: number;
      monthlyPayment: number;
    }>;
    personalLoans?: Array<{
      institution: string;
      accountNumber: string;
      balance: number;
      monthlyPayment: number;
    }>;
    studentLoans?: Array<{
      institution: string;
      accountNumber: string;
      balance: number;
      monthlyPayment: number;
    }>;
    otherLiabilities?: Array<{
      description: string;
      balance: number;
      monthlyPayment: number;
    }>;
  };
  
  // Property Information (for real estate loans)
  propertyInfo?: {
    propertyType: 'single_family' | 'multi_family' | 'condo' | 'townhouse' | 'commercial' | 'land' | 'mixed_use';
    propertyUse: 'primary_residence' | 'secondary_home' | 'investment' | 'business';
    propertyCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
    yearBuilt?: number;
    squareFootage?: number;
    lotSize?: number;
    bedrooms?: number;
    bathrooms?: number;
    garageSpaces?: number;
    propertyTaxes?: number;
    insuranceCost?: number;
    hoaFees?: number;
    hoaContact?: {
      name: string;
      phone: string;
      email: string;
    };
    // Property photos and documents
    propertyPhotos?: string[]; // Array of file URLs
    propertyDocuments?: string[]; // Array of file URLs
  };
  
  // Employment Information
  employmentInfo?: {
    currentEmployer: {
      name: string;
      address: string;
      phone: string;
      position: string;
      startDate: string;
      monthlyIncome: number;
      incomeType: 'salary' | 'hourly' | 'commission' | 'bonus' | 'overtime';
    };
    previousEmployers?: Array<{
      name: string;
      address: string;
      phone: string;
      position: string;
      startDate: string;
      endDate: string;
      monthlyIncome: number;
      reasonForLeaving?: string;
    }>;
    selfEmployment?: {
      businessName: string;
      businessType: string;
      yearsInBusiness: number;
      averageMonthlyIncome: number;
      taxReturns?: string[]; // Array of file URLs
      profitLossStatements?: string[]; // Array of file URLs
    };
  };
  
  // Documents and Files
  documents: {
    // Required documents
    governmentId?: string; // File URL
    socialSecurityCard?: string; // File URL
    w2Forms?: string[]; // Array of file URLs
    taxReturns?: string[]; // Array of file URLs
    payStubs?: string[]; // Array of file URLs
    bankStatements?: string[]; // Array of file URLs
    
    // Property documents
    purchaseAgreement?: string; // File URL
    propertyAppraisal?: string; // File URL
    titleReport?: string; // File URL
    homeownersInsurance?: string; // File URL
    
    // Additional documents
    additionalDocuments?: Array<{
      name: string;
      category: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      uploadedAt: any;
      uploadedBy: string;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
      reviewedBy?: string;
      reviewedAt?: any;
    }>;
  };
  
  // Notes and Communication
  notes?: string;
  brokerNotes?: string; // Notes from the broker
  underwriterNotes?: string; // Notes from the underwriter
  borrowerNotes?: string; // Notes from the borrower
  
  // Application Progress
  progress: {
    borrowerInfoCompleted: boolean;
    businessInfoCompleted: boolean;
    loanDetailsCompleted: boolean;
    financialInfoCompleted: boolean;
    propertyInfoCompleted: boolean;
    employmentInfoCompleted: boolean;
    documentsUploaded: boolean;
    overallProgress: number; // 0-100
  };
  
  // Application History
  history?: Array<{
    action: string;
    description: string;
    performedBy: string;
    timestamp: any;
    details?: any;
  }>;
}

export interface Document {
  id?: string;
  userId: string;
  applicationId?: string;
  type: 'personal' | 'business' | 'financial' | 'property' | 'other';
  category: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: any;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: any;
}

export interface Appointment {
  id?: string;
  userId: string;
  workforceMemberId: string;
  date: any;
  duration: number;
  type: 'consultation' | 'document_review' | 'application_review' | 'closing';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface WorkforceMember {
  id?: string;
  userId: string;
  specialties: string[];
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  maxAppointmentsPerDay: number;
  isActive: boolean;
  createdAt: any;
  updatedAt?: any;
}

export interface ComparableProperty {
  id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  salePrice: number;
  saleDate: any;
  daysOnMarket: number;
  pricePerSqFt: number;
  lotSize: number;
  yearBuilt: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  features: string[];
  notes?: string;
  createdAt: any;
  createdBy: string;
}

export interface MarketAnalysis {
  id?: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  analysisDate: any;
  marketTrend: 'rising' | 'stable' | 'declining';
  averageDaysOnMarket: number;
  pricePerSqFt: {
    current: number;
    sixMonthsAgo: number;
    oneYearAgo: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  comparableProperties: string[];
  recommendations: string[];
  createdBy: string;
  createdAt: any;
}

// Generic CRUD operations for server-side use
export class FirestoreAdminService<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(data: Omit<T, 'id'>, customId?: string): Promise<string> {
    try {
      if (customId) {
        await adminDb.collection(this.collectionName).doc(customId).set({
          ...data,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        return customId;
      } else {
        const docRef = await adminDb.collection(this.collectionName).add({
          ...data,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        return docRef.id;
      }
    } catch (error) {
      console.error(`Error creating ${this.collectionName} document:`, error);
      throw error;
    }
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = adminDb.collection(this.collectionName).doc(id);
      const docSnap = await docRef.get();
      
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} document:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = adminDb.collection(this.collectionName).doc(id);
      await docRef.update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName} document:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = adminDb.collection(this.collectionName).doc(id);
      await docRef.delete();
    } catch (error) {
      console.error(`Error deleting ${this.collectionName} document:`, error);
      throw error;
    }
  }

  // Get all documents with optional filtering and pagination
  async getAll(
    filters?: Array<{ field: string; operator: any; value: any }>,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number,
    startAfterDoc?: any
  ): Promise<T[]> {
    try {
      let q: any = adminDb.collection(this.collectionName);
      
      // Apply filters
      if (filters) {
        filters.forEach(filter => {
          q = q.where(filter.field, filter.operator, filter.value);
        });
      }
      
      // Apply ordering
      if (orderByField) {
        q = q.orderBy(orderByField, orderDirection);
      }
      
      // Apply pagination
      if (startAfterDoc) {
        q = q.startAfter(startAfterDoc);
      }
      
      if (limitCount) {
        q = q.limit(limitCount);
      }
      
      const querySnapshot = await q.get();
      return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} documents:`, error);
      throw error;
    }
  }

  // Get documents by a specific field value
  async getByField(field: string, value: any): Promise<T[]> {
    try {
      const q = adminDb.collection(this.collectionName).where(field, '==', value);
      const querySnapshot = await q.get();
      return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} documents by field:`, error);
      throw error;
    }
  }
}

// Server-side service instances
export class UserAdminService extends FirestoreAdminService<FirestoreUser> {
  constructor() {
    super('users');
  }

  async getUserByEmail(email: string): Promise<FirestoreUser | null> {
    const users = await this.getByField('email', email);
    return users.length > 0 ? users[0] : null;
  }

  async getUsersByRole(role: FirestoreUser['role']): Promise<FirestoreUser[]> {
    return this.getByField('role', role);
  }

  async getUsersByStatus(status: FirestoreUser['status']): Promise<FirestoreUser[]> {
    return this.getByField('status', status);
  }

  async updateUserStatus(uid: string, status: FirestoreUser['status']): Promise<void> {
    await this.update(uid, { status });
  }

  async updateUserRole(uid: string, role: FirestoreUser['role']): Promise<void> {
    await this.update(uid, { role });
  }
}

export class LoanApplicationAdminService extends FirestoreAdminService<LoanApplication> {
  constructor() {
    super('loanApplications');
  }

  async getApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    return this.getByField('userId', userId);
  }

  async getApplicationsByBroker(brokerId: string): Promise<LoanApplication[]> {
    return this.getByField('brokerId', brokerId);
  }

  async getApplicationsByLoanType(loanType: LoanApplication['loanType']): Promise<LoanApplication[]> {
    return this.getByField('loanType', loanType);
  }

  async getApplicationsByStatus(status: LoanApplication['status']): Promise<LoanApplication[]> {
    return this.getByField('status', status);
  }

  async getApplicationsByProgram(program: string): Promise<LoanApplication[]> {
    return this.getByField('program', program);
  }

  async submitApplication(applicationId: string): Promise<void> {
    await this.update(applicationId, {
      status: 'submitted',
      submittedAt: FieldValue.serverTimestamp(),
    });
  }

  async assignToWorkforce(applicationId: string, workforceMemberId: string): Promise<void> {
    await this.update(applicationId, { assignedTo: workforceMemberId });
  }

  // Calculate application progress with enhanced sections
  async calculateProgress(applicationId: string): Promise<number> {
    const application = await this.getById(applicationId);
    if (!application) return 0;

    let completedSteps = 0;
    const totalSteps = 7; // Updated to include new sections

    if (application.borrowerInfo) completedSteps++;
    if (application.businessInfo) completedSteps++;
    if (application.loanDetails) completedSteps++;
    if (application.financialInfo) completedSteps++;
    if (application.propertyInfo) completedSteps++;
    if (application.employmentInfo) completedSteps++;
    if (application.documents && this.hasRequiredDocuments(application.documents)) completedSteps++;

    const progress = Math.round((completedSteps / totalSteps) * 100);
    
    // Update the progress in the database
    const progressUpdate = {
      progress: {
        overallProgress: progress,
        borrowerInfoCompleted: !!application.borrowerInfo,
        businessInfoCompleted: !!application.businessInfo,
        loanDetailsCompleted: !!application.loanDetails,
        financialInfoCompleted: !!application.financialInfo,
        propertyInfoCompleted: !!application.propertyInfo,
        employmentInfoCompleted: !!application.employmentInfo,
        documentsUploaded: this.hasRequiredDocuments(application.documents)
      }
    };
    
    await this.update(applicationId, progressUpdate);

    return progress;
  }

  // Check if required documents are uploaded
  private hasRequiredDocuments(documents: LoanApplication['documents']): boolean {
    if (!documents) return false;
    
    // Check for basic required documents
    const hasBasicDocs = !!(documents.governmentId && documents.socialSecurityCard);
    const hasFinancialDocs = !!(documents.w2Forms && documents.w2Forms.length > 0 && 
                            documents.taxReturns && documents.taxReturns.length > 0);
    
    return hasBasicDocs && hasFinancialDocs;
  }

  // Create initial application with borrower info and loan type
  async createInitialApplication(
    brokerId: string,
    loanType: LoanApplication['loanType'],
    borrowerInfo: LoanApplication['borrowerInfo'],
    program: string
  ): Promise<string> {
    const applicationData = {
      brokerId,
      loanType,
      userId: '', // Will be set when borrower account is created
      program,
      status: 'draft' as const,
      borrowerInfo,
      loanDetails: {
        loanAmount: 0,
        loanPurpose: '',
        term: 0,
        propertyType: '',
        downPayment: 0,
        downPaymentPercentage: 0
      },
      documents: {
        // Initialize empty document structure
        additionalDocuments: []
      },
      progress: {
        borrowerInfoCompleted: true,
        businessInfoCompleted: false,
        loanDetailsCompleted: false,
        financialInfoCompleted: false,
        propertyInfoCompleted: false,
        employmentInfoCompleted: false,
        documentsUploaded: false,
        overallProgress: 14 // 1 out of 7 sections = ~14%
      }
    };

    return await this.create(applicationData as unknown as Omit<LoanApplication, 'id'>);
  }

  // Link application to borrower when account is created
  async linkToBorrower(applicationId: string, borrowerUserId: string): Promise<void> {
    await this.update(applicationId, { userId: borrowerUserId });
  }

  // Add application history entry
  async addHistoryEntry(
    applicationId: string, 
    action: string, 
    description: string, 
    performedBy: string, 
    details?: any
  ): Promise<void> {
    const historyEntry = {
      action,
      description,
      performedBy,
      timestamp: FieldValue.serverTimestamp(),
      details
    };

    await this.update(applicationId, {
      history: FieldValue.arrayUnion(historyEntry)
    } as any);
  }

  // Update specific section of the application
  async updateSection(
    applicationId: string, 
    section: keyof Pick<LoanApplication, 'businessInfo' | 'loanDetails' | 'financialInfo' | 'propertyInfo' | 'employmentInfo'>,
    data: any
  ): Promise<void> {
    await this.update(applicationId, { [section]: data });
    
    // Recalculate progress after section update
    await this.calculateProgress(applicationId);
    
    // Add history entry
    await this.addHistoryEntry(
      applicationId,
      'section_updated',
      `${section} section updated`,
      'system',
      { section, updatedFields: Object.keys(data) }
    );
  }

  // Upload document to application
  async uploadDocument(
    applicationId: string,
    documentType: keyof LoanApplication['documents'],
    documentData: {
      name: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      uploadedBy: string;
      category?: string;
    }
  ): Promise<void> {
    const document = {
      ...documentData,
      uploadedAt: FieldValue.serverTimestamp(),
      status: 'pending' as const
    };

    if (documentType === 'additionalDocuments') {
      // Add to additional documents array
      await this.update(applicationId, {
        [`documents.${documentType}`]: FieldValue.arrayUnion(document)
      });
    } else {
      // Update specific document field
      await this.update(applicationId, {
        [`documents.${documentType}`]: document
      });
    }

    // Recalculate progress
    await this.calculateProgress(applicationId);
    
    // Add history entry
    await this.addHistoryEntry(
      applicationId,
      'document_uploaded',
      `Document uploaded: ${document.name}`,
      document.uploadedBy,
      { documentType, documentName: document.name }
    );
  }
}

// Export service instances for server-side use
export const userAdminService = new UserAdminService();
export const loanApplicationAdminService = new LoanApplicationAdminService();
