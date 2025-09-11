import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase-client';

// Types for Firestore documents
export interface FirestoreUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  authProvider?: string;
  hasPassword?: boolean;
  updatedAt?: Timestamp;
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
  userId: string;
  program: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  // Application data
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    ssn: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
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
  };
  loanDetails?: {
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
  };
  financialInfo?: {
    annualIncome: number;
    monthlyDebt: number;
    creditScore: number;
    assets: number;
    liabilities: number;
  };
  documents?: string[]; // Array of document IDs
  notes?: string;
  assignedTo?: string; // Workforce member ID
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
  uploadedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
}

export interface Appointment {
  id?: string;
  userId: string;
  workforceMemberId: string;
  date: Timestamp;
  duration: number; // in minutes
  type: 'consultation' | 'document_review' | 'application_review' | 'closing';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  saleDate: Timestamp;
  daysOnMarket: number;
  pricePerSqFt: number;
  lotSize: number;
  yearBuilt: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  features: string[];
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
}

export interface MarketAnalysis {
  id?: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  analysisDate: Timestamp;
  marketTrend: 'rising' | 'stable' | 'declining';
  averageDaysOnMarket: number;
  pricePerSqFt: {
    current: number;
    sixMonthsAgo: number;
    oneYearAgo: number;
  };
  comparableProperties: string[]; // Array of comparable property IDs
  recommendations: string[];
  createdBy: string;
  createdAt: Timestamp;
}

// Extended user profile interface for borrowers
export interface BorrowerProfile extends FirestoreUser {
  // Personal Information
  personalInfo?: {
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    profilePhotoUrl?: string;
  };
  
  // Contact Information
  contactInfo?: {
    phone: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Company Information
  companies?: CompanyProfile[];
  
  // Financial Information
  financialInfo?: {
    creditScores?: {
      equifax: number;
      experian: number;
      transunion: number;
      lastUpdated: any;
    };
    personalAssets?: {
      balance: number;
      lastStatementDate: any;
      lastStatementUrl?: string;
    };
    companyAssets?: {
      [companyId: string]: {
        balance: number;
        lastStatementDate: any;
        lastStatementUrl?: string;
      };
    };
    personalFinancialStatement?: {
      completed: boolean;
      lastUpdated: any;
      data?: any; // Structured financial data
    };
    businessDebtSchedule?: {
      [companyId: string]: {
        completed: boolean;
        lastUpdated: any;
        data?: any; // Structured debt data
      };
    };
  };
  
  // Document Tracking
  requiredDocuments?: {
    personal: {
      idDriversLicense: boolean;
      creditReport: boolean;
      personalAssetStatement: boolean;
      personalFinancialStatement: boolean;
    };
    business: {
      [companyId: string]: {
        einCertificate: boolean;
        formationDocumentation: boolean;
        operatingAgreement: boolean;
        partnershipOfficerList: boolean;
        businessLicense: boolean;
        certificateOfGoodStanding: boolean;
        companyAssetStatement: boolean;
        businessDebtSchedule: boolean;
      };
    };
  };
  
  // Financial Statement (direct access)
  financialStatement?: PersonalFinancialStatement;
  
  // Uploaded Documents
  documents?: {
    [documentName: string]: {
      documentId: string;
      fileName: string;
      downloadURL: string;
      uploadedAt: string;
      status: string;
    };
  };
  
  // Deal History
  dealHistory?: DealHistory[];
  
  // Profile Completion
  profileCompletion?: {
    personalInfo: number; // Percentage complete
    contactInfo: number;
    companies: number;
    documents: number;
    financialInfo: number;
    dealHistory: number;
    overall: number;
  };
}

// Company profile interface
export interface CompanyProfile {
  id: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEin: string;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  documents?: string[]; // Array of document IDs
}

// Enhanced document interface for borrower documents
export interface BorrowerDocument extends Document {
  // Additional fields specific to borrower documents
  documentType: 'personal' | 'business' | 'financial' | 'identification' | 'legal';
  category: 'required' | 'optional' | 'supporting';
  companyId?: string; // For business-related documents
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: any;
  expiresAt?: any;
  isRequired: boolean;
}

// Personal Financial Statement interface
export interface PersonalFinancialStatement {
  id?: string;
  userId: string;
  completed?: boolean;
  lastUpdated?: string;
  
  // Assets
  cashInBank?: number;
  savingsAccounts?: number;
  ira?: number;
  accountsReceivable?: number;
  lifeInsurance?: number;
  stocksBonds?: number;
  realEstateDescription?: string;
  realEstateValue?: number;
  automobiles?: string;
  automobilesValue?: number;
  otherPersonalProperty?: number;
  otherAssets?: number;
  totalAssets?: number;
  
  // Liabilities
  accountsPayable?: number;
  notesPayable?: number;
  autoLoan?: number;
  otherLoans?: number;
  loanOnLifeInsurance?: number;
  mortgageOnRealEstate?: number;
  unpaidTaxes?: number;
  otherLiabilities?: number;
  totalLiabilities?: number;
  netWorth?: number;
  
  // Income
  salary?: number;
  netInvestmentIncome?: number;
  realEstateIncome?: number;
  otherIncome?: number;
  totalAnnualIncome?: number;
  
  // Additional Information
  contingentLiabilities?: string;
  taxesPayable?: string;
  stocksForeignAccounts?: string;
}

// Deal History interface
export interface DealHistory {
  id: string;
  address: string;
  purchasePrice: number;
  rehabAmount: number;
  salePrice: number;
  daysOnMarket: number;
  purchaseHud1DocumentId?: string;
  dispositionHud1DocumentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Business Debt Schedule interface
export interface BusinessDebtSchedule {
  id?: string;
  userId: string;
  companyId: string;
  completed: boolean;
  lastUpdated: any;
  
  debts: Array<{
    id: string;
    creditorName: string;
    accountNumber: string;
    originalBalance: number;
    currentBalance: number;
    monthlyPayment: number;
    interestRate: number;
    maturityDate: string;
    collateral: string;
    isPersonallyGuaranteed: boolean;
    status: 'current' | 'pastDue' | 'defaulted' | 'paidOff';
  }>;
  
  totalDebt: number;
  totalMonthlyPayments: number;
  averageInterestRate: number;
}

// Generic CRUD operations
export class FirestoreService<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(data: Omit<T, 'id'>, customId?: string): Promise<string> {
    try {
      if (customId) {
        await setDoc(doc(db, this.collectionName, customId), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return customId;
      } else {
        const docRef = await addDoc(collection(db, this.collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
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
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
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
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName} document:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
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
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<T[]> {
    try {
      let q: any = collection(db, this.collectionName);
      
      // Apply filters
      if (filters) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Apply pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} documents:`, error);
      throw error;
    }
  }

  // Get documents by a specific field value
  async getByField(field: string, value: any): Promise<T[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where(field, '==', value)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} documents by field:`, error);
      throw error;
    }
  }
}

// User Service
export class UserService extends FirestoreService<FirestoreUser> {
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

// Loan Application Service
export class LoanApplicationService extends FirestoreService<LoanApplication> {
  constructor() {
    super('loanApplications');
  }

  async getApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    return this.getByField('userId', userId);
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
      submittedAt: serverTimestamp() as any,
    });
  }

  async assignToWorkforce(applicationId: string, workforceMemberId: string): Promise<void> {
    await this.update(applicationId, { assignedTo: workforceMemberId });
  }
}

// Document Service
export class DocumentService extends FirestoreService<Document> {
  constructor() {
    super('documents');
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return this.getByField('userId', userId);
  }

  async getDocumentsByApplication(applicationId: string): Promise<Document[]> {
    return this.getByField('applicationId', applicationId);
  }

  async getDocumentsByType(type: Document['type']): Promise<Document[]> {
    return this.getByField('type', type);
  }

  async updateDocumentStatus(documentId: string, status: Document['status'], reviewedBy?: string): Promise<void> {
    const updateData: Partial<Document> = { status };
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = serverTimestamp() as any;
    }
    await this.update(documentId, updateData);
  }
}

// Appointment Service
export class AppointmentService extends FirestoreService<Appointment> {
  constructor() {
    super('appointments');
  }

  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    return this.getByField('userId', userId);
  }

  async getAppointmentsByWorkforceMember(workforceMemberId: string): Promise<Appointment[]> {
    return this.getByField('workforceMemberId', workforceMemberId);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);
    
    const q = query(
      collection(db, this.collectionName),
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
  }

  async getAvailableSlots(workforceMemberId: string, date: Date): Promise<Date[]> {
    // This is a simplified version - you might want to implement more sophisticated logic
    const appointments = await this.getAppointmentsByWorkforceMember(workforceMemberId);
    const dateAppointments = appointments.filter(apt => {
      const aptDate = apt.date.toDate();
      return aptDate.toDateString() === date.toDateString();
    });
    
    // Generate available time slots (simplified)
    const availableSlots: Date[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      
      const isBooked = dateAppointments.some(apt => {
        const aptDate = apt.date.toDate();
        return aptDate.getHours() === hour;
      });
      
      if (!isBooked) {
        availableSlots.push(slot);
      }
    }
    
    return availableSlots;
  }
}

// Workforce Member Service
export class WorkforceMemberService extends FirestoreService<WorkforceMember> {
  constructor() {
    super('workforceMembers');
  }

  async getActiveMembers(): Promise<WorkforceMember[]> {
    return this.getByField('isActive', true);
  }

  async getMembersBySpecialty(specialty: string): Promise<WorkforceMember[]> {
    const members = await this.getAll();
    return members.filter(member => member.specialties.includes(specialty));
  }
}

// Comparable Property Service
export class ComparablePropertyService extends FirestoreService<ComparableProperty> {
  constructor() {
    super('comparableProperties');
  }

  async getComparablesByLocation(city: string, state: string, zipCode?: string): Promise<ComparableProperty[]> {
    let filters = [
      { field: 'city', operator: '==', value: city },
      { field: 'state', operator: '==', value: state }
    ];
    
    if (zipCode) {
      filters.push({ field: 'zipCode', operator: '==', value: zipCode });
    }
    
    return this.getAll(filters, 'saleDate', 'desc');
  }

  async getComparablesByPropertyType(propertyType: string): Promise<ComparableProperty[]> {
    return this.getByField('propertyType', propertyType);
  }

  async getRecentSales(days: number = 90): Promise<ComparableProperty[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);
    
    const q = query(
      collection(db, this.collectionName),
      where('saleDate', '>=', cutoffTimestamp),
      orderBy('saleDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ComparableProperty[];
  }
}

// Market Analysis Service
export class MarketAnalysisService extends FirestoreService<MarketAnalysis> {
  constructor() {
    super('marketAnalyses');
  }

  async getAnalysisByLocation(city: string, state: string): Promise<MarketAnalysis[]> {
    const filters = [
      { field: 'city', operator: '==', value: city },
      { field: 'state', operator: '==', value: state }
    ];
    
    return this.getAll(filters, 'analysisDate', 'desc');
  }

  async getRecentAnalyses(days: number = 30): Promise<MarketAnalysis[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);
    
    const q = query(
      collection(db, this.collectionName),
      where('analysisDate', '>=', cutoffTimestamp),
      orderBy('analysisDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MarketAnalysis[];
  }
}

// Export service instances
export const userService = new UserService();
export const loanApplicationService = new LoanApplicationService();
export const documentService = new DocumentService();
export const appointmentService = new AppointmentService();
export const workforceMemberService = new WorkforceMemberService();
export const comparablePropertyService = new ComparablePropertyService();
export const marketAnalysisService = new MarketAnalysisService();

// Enhanced User Service for borrower profiles
export class BorrowerProfileService extends FirestoreService<BorrowerProfile> {
  constructor() {
    super('users');
  }

  // Get borrower profile by user ID
  async getBorrowerProfile(uid: string): Promise<BorrowerProfile | null> {
    return this.getById(uid);
  }

  // Update borrower profile
  async updateBorrowerProfile(uid: string, updates: Partial<BorrowerProfile>): Promise<void> {
    await this.update(uid, updates);
  }

  // Update personal information
  async updatePersonalInfo(uid: string, personalInfo: BorrowerProfile['personalInfo']): Promise<void> {
    await this.update(uid, { personalInfo });
  }

  // Update contact information
  async updateContactInfo(uid: string, contactInfo: BorrowerProfile['contactInfo']): Promise<void> {
    await this.update(uid, { contactInfo });
  }

  // Add or update company information
  async updateCompanyInfo(uid: string, company: CompanyProfile): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const companies = profile.companies || [];
    const existingIndex = companies.findIndex(c => c.id === company.id);
    
    if (existingIndex >= 0) {
      companies[existingIndex] = { ...company, updatedAt: serverTimestamp() };
    } else {
      companies.push({ ...company, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }

    await this.update(uid, { companies });
  }

  // Remove company
  async removeCompany(uid: string, companyId: string): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const companies = profile.companies?.filter(c => c.id !== companyId) || [];
    await this.update(uid, { companies });
  }

  // Update credit scores
  async updateCreditScores(uid: string, creditScores: NonNullable<BorrowerProfile['financialInfo']>['creditScores']): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const financialInfo = profile.financialInfo || {};
    (financialInfo as any).creditScores = {
      ...creditScores,
      lastUpdated: serverTimestamp()
    };

    await this.update(uid, { financialInfo });
  }

  // Update asset information
  async updateAssetInfo(uid: string, assetType: 'personal' | 'company', assetData: any, companyId?: string): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const financialInfo = profile.financialInfo || {};
    
    if (assetType === 'personal') {
      (financialInfo as any).personalAssets = {
        ...assetData,
        lastUpdated: serverTimestamp()
      };
    } else if (assetType === 'company' && companyId) {
      (financialInfo as any).companyAssets = (financialInfo as any).companyAssets || {};
      (financialInfo as any).companyAssets[companyId] = {
        ...assetData,
        lastUpdated: serverTimestamp()
      };
    }

    await this.update(uid, { financialInfo });
  }

  // Update document status
  async updateDocumentStatus(uid: string, documentType: string, status: boolean, companyId?: string): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const requiredDocuments = profile.requiredDocuments || {
      personal: {
        idDriversLicense: false,
        creditReport: false,
        personalAssetStatement: false,
        personalFinancialStatement: false
      },
      business: {}
    };
    
    if (companyId) {
      (requiredDocuments as any).business = (requiredDocuments as any).business || {};
      (requiredDocuments as any).business[companyId] = (requiredDocuments as any).business[companyId] || {};
      (requiredDocuments as any).business[companyId][documentType] = status;
    } else {
      (requiredDocuments as any).personal = (requiredDocuments as any).personal || {};
      (requiredDocuments as any).personal[documentType] = status;
    }

    await this.update(uid, { requiredDocuments });
  }

  // Calculate profile completion percentage
  async calculateProfileCompletion(uid: string): Promise<BorrowerProfile['profileCompletion']> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const completion = {
      personalInfo: 0,
      contactInfo: 0,
      companies: 0,
      documents: 0,
      financialInfo: 0,
      overall: 0
    };

    // Calculate personal info completion
    if (profile.personalInfo) {
      const personalFields = ['firstName', 'lastName', 'ssn', 'dateOfBirth'];
      const completedFields = personalFields.filter(field => 
        profile.personalInfo && profile.personalInfo[field as keyof typeof profile.personalInfo]
      );
      completion.personalInfo = (completedFields.length / personalFields.length) * 100;
    }

    // Calculate contact info completion
    if (profile.contactInfo) {
      const contactFields = ['phone'];
      const completedFields = contactFields.filter(field => 
        profile.contactInfo && profile.contactInfo[field as keyof typeof profile.contactInfo]
      );
      completion.contactInfo = (completedFields.length / contactFields.length) * 100;
    }

    // Calculate companies completion
    if (profile.companies && profile.companies.length > 0) {
      const companyFields = ['companyName', 'companyAddress', 'companyPhone', 'companyEin'];
      let totalCompanyCompletion = 0;
      
      profile.companies.forEach(company => {
        const completedFields = companyFields.filter(field => company[field as keyof CompanyProfile]);
        totalCompanyCompletion += (completedFields.length / companyFields.length) * 100;
      });
      
      completion.companies = totalCompanyCompletion / profile.companies.length;
    }

    // Calculate documents completion
    if (profile.requiredDocuments) {
      let totalDocumentCompletion = 0;
      let totalDocuments = 0;

      // Personal documents
      if (profile.requiredDocuments.personal) {
        const personalDocs = Object.values(profile.requiredDocuments.personal);
        totalDocuments += personalDocs.length;
        totalDocumentCompletion += personalDocs.filter(Boolean).length;
      }

      // Business documents
      if (profile.requiredDocuments.business) {
        Object.values(profile.requiredDocuments.business).forEach(companyDocs => {
          const companyDocValues = Object.values(companyDocs);
          totalDocuments += companyDocValues.length;
          totalDocumentCompletion += companyDocValues.filter(Boolean).length;
        });
      }

      completion.documents = totalDocuments > 0 ? (totalDocumentCompletion / totalDocuments) * 100 : 0;
    }

    // Calculate financial info completion
    if (profile.financialInfo) {
      const financialFields = ['creditScores', 'personalAssets'];
      const completedFields = financialFields.filter(field => 
        profile.financialInfo && profile.financialInfo[field as keyof typeof profile.financialInfo]
      );
      completion.financialInfo = (completedFields.length / financialFields.length) * 100;
    }

    // Calculate deal history completion
    if (profile.dealHistory && profile.dealHistory.length > 0) {
      const dealFields = ['address', 'purchasePrice', 'salePrice'];
      let totalDealCompletion = 0;
      
      profile.dealHistory.forEach(deal => {
        const completedFields = dealFields.filter(field => 
          deal[field as keyof DealHistory] && deal[field as keyof DealHistory] !== ''
        );
        totalDealCompletion += (completedFields.length / dealFields.length) * 100;
      });
      
      completion.dealHistory = totalDealCompletion / profile.dealHistory.length;
    }

    // Calculate overall completion
    completion.overall = (
      completion.personalInfo + 
      completion.contactInfo + 
      completion.companies + 
      completion.documents + 
      completion.financialInfo +
      completion.dealHistory
    ) / 6;

    // Update the profile with completion data
    await this.update(uid, { profileCompletion: completion });

    return completion;
  }

  // Deal History methods
  async updateDealHistory(uid: string, dealHistory: DealHistory[]): Promise<void> {
    await this.update(uid, { dealHistory });
  }

  async addDeal(uid: string, deal: Omit<DealHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const newDeal: DealHistory = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const dealHistory = profile.dealHistory || [];
    dealHistory.push(newDeal);

    await this.update(uid, { dealHistory });
  }

  async updateDeal(uid: string, dealId: string, updates: Partial<Omit<DealHistory, 'id' | 'createdAt'>>): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const dealHistory = profile.dealHistory || [];
    const dealIndex = dealHistory.findIndex(deal => deal.id === dealId);
    
    if (dealIndex === -1) throw new Error('Deal not found');

    dealHistory[dealIndex] = {
      ...dealHistory[dealIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.update(uid, { dealHistory });
  }

  async removeDeal(uid: string, dealId: string): Promise<void> {
    const profile = await this.getById(uid);
    if (!profile) throw new Error('User profile not found');

    const dealHistory = profile.dealHistory || [];
    const updatedDealHistory = dealHistory.filter(deal => deal.id !== dealId);

    await this.update(uid, { dealHistory: updatedDealHistory });
  }
}

// Personal Financial Statement Service
export class PersonalFinancialStatementService extends FirestoreService<PersonalFinancialStatement> {
  constructor() {
    super('personalFinancialStatements');
  }

  // Get financial statement by user ID
  async getByUserId(userId: string): Promise<PersonalFinancialStatement | null> {
    const statements = await this.getByField('userId', userId);
    return statements.length > 0 ? statements[0] : null;
  }

  // Create or update financial statement
  async upsertFinancialStatement(userId: string, data: Partial<PersonalFinancialStatement>): Promise<string> {
    const existing = await this.getByUserId(userId);
    
    if (existing) {
      await this.update(existing.id!, data);
      return existing.id!;
    } else {
      return await this.create({
        userId,
        completed: false,
        lastUpdated: serverTimestamp() as any,
        assets: {
          cashAndEquivalents: 0,
          accountsReceivable: 0,
          inventory: 0,
          realEstate: 0,
          vehicles: 0,
          investments: 0,
          otherAssets: 0,
          totalAssets: 0
        },
        liabilities: {
          accountsPayable: 0,
          creditCards: 0,
          autoLoans: 0,
          mortgages: 0,
          studentLoans: 0,
          otherLiabilities: 0,
          totalLiabilities: 0
        },
        income: {
          salary: 0,
          businessIncome: 0,
          investmentIncome: 0,
          rentalIncome: 0,
          otherIncome: 0,
          totalIncome: 0
        },
        expenses: {
          housing: 0,
          utilities: 0,
          food: 0,
          transportation: 0,
          insurance: 0,
          healthcare: 0,
          entertainment: 0,
          otherExpenses: 0,
          totalExpenses: 0
        },
        netWorth: 0,
        monthlyCashFlow: 0,
        ...data
      });
    }
  }
}



// Business Debt Schedule Service
export class BusinessDebtScheduleService extends FirestoreService<BusinessDebtSchedule> {
  constructor() {
    super('businessDebtSchedules');
  }

  // Get debt schedule by user ID and company ID
  async getByUserAndCompany(userId: string, companyId: string): Promise<BusinessDebtSchedule | null> {
    const schedules = await this.getByField('userId', userId);
    return schedules.find(s => s.companyId === companyId) || null;
  }

  // Get all debt schedules for a user
  async getByUserId(userId: string): Promise<BusinessDebtSchedule[]> {
    return this.getByField('userId', userId);
  }

  // Create or update debt schedule
  async upsertDebtSchedule(userId: string, companyId: string, data: Partial<BusinessDebtSchedule>): Promise<string> {
    const existing = await this.getByUserAndCompany(userId, companyId);
    
    if (existing) {
      await this.update(existing.id!, data);
      return existing.id!;
    } else {
      return await this.create({
        userId,
        companyId,
        completed: false,
        lastUpdated: serverTimestamp() as any,
        debts: [],
        totalDebt: 0,
        totalMonthlyPayments: 0,
        averageInterestRate: 0,
        ...data
      });
    }
  }
}

// Batch operations for complex transactions
export class BatchService {
  static async batchUpdate(updates: Array<{ collection: string; id: string; data: any }>): Promise<void> {
    const batch = writeBatch(db);
    
    updates.forEach(update => {
      const docRef = doc(db, update.collection, update.id);
      batch.update(docRef, update.data);
    });
    
    await batch.commit();
  }

  static async batchCreate(creates: Array<{ collection: string; data: any }>): Promise<string[]> {
    const batch = writeBatch(db);
    const docRefs: any[] = [];
    
    creates.forEach(create => {
      const docRef = doc(collection(db, create.collection));
      batch.set(docRef, create.data);
      docRefs.push(docRef);
    });
    
    await batch.commit();
    return docRefs.map(ref => ref.id);
  }

  static async batchDelete(deletes: Array<{ collection: string; id: string }>): Promise<void> {
    const batch = writeBatch(db);
    
    deletes.forEach(del => {
      const docRef = doc(db, del.collection, del.id);
      batch.delete(docRef);
    });
    
    await batch.commit();
  }
}

// Export enhanced services
export const borrowerProfileService = new BorrowerProfileService();
export const personalFinancialStatementService = new PersonalFinancialStatementService();
export const businessDebtScheduleService = new BusinessDebtScheduleService();
