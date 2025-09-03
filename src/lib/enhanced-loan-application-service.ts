// Enhanced Loan Application Service
// This service handles all loan application operations with comprehensive data capture

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase-client';

// Proper loan application structure
interface LoanApplication {
  id?: string;
  userId: string;
  brokerId: string;
  loanCategory: string;
  loanProgram: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  
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
  
  // Additional fields for flexibility
  [key: string]: any;
}

export class EnhancedLoanApplicationService {
  private collectionName = 'enhancedLoanApplications';

  // ============================================================================
  // CREATE NEW LOAN APPLICATION
  // ============================================================================

  async createLoanApplication(
    userId: string,
    brokerId: string,
    loanProgram: string,
    initialData: any = {}
  ): Promise<string> {
    try {
      console.log('Creating loan application with data:', { userId, brokerId, loanProgram, initialData });
      
      const now = Timestamp.now();
      
      // Create initial application structure with proper defaults
      const application: LoanApplication = {
        // Core Information
        userId,
        brokerId,
        loanCategory: initialData.loanCategory || 'residential_noo',
        loanProgram,
        status: 'draft',
        
        // Timestamps
        createdAt: now,
        updatedAt: now,
        
        // Initialize all sections with empty data
        borrowerInfo: {},
        businessInfo: {},
        loanDetails: {},
        financialInfo: {},
        propertyInfo: {},
        
        // Progress and Status
        progress: {
          borrowerInfoCompleted: false,
          businessInfoCompleted: false,
          loanDetailsCompleted: false,
          financialInfoCompleted: false,
          propertyInfoCompleted: false,
          employmentInfoCompleted: false,
          documentsUploaded: false,
          overallProgress: 0
        },
        
        // History and Notes
        history: [{
          action: 'created',
          description: 'Loan application created',
          performedBy: brokerId,
          timestamp: now
        }],
        notes: '',
        
        // Merge with any initial data provided
        ...initialData
      };
      
      console.log('Application structure created:', application);
      
      // Create the document
      const docRef = doc(collection(db, this.collectionName));
      console.log('Document reference created:', docRef.id);
      
      await setDoc(docRef, application);
      console.log('Document saved successfully');
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw new Error(`Failed to create loan application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // GET LOAN APPLICATION
  // ============================================================================

  async getLoanApplication(applicationId: string): Promise<LoanApplication | null> {
    try {
      console.log('Getting loan application:', applicationId);
      
      const docRef = doc(db, this.collectionName, applicationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Application data retrieved:', data);
        return { id: docSnap.id, ...data } as LoanApplication;
      }
      
      console.log('Application not found');
      return null;
    } catch (error) {
      console.error('Error getting loan application:', error);
      throw new Error(`Failed to get loan application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // GET LOAN APPLICATIONS BY USER
  // ============================================================================

  async getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    try {
      console.log('Getting loan applications for user:', userId);
      
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const applications: LoanApplication[] = [];
      
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as LoanApplication);
      });
      
      console.log(`Found ${applications.length} applications for user ${userId}`);
      return applications;
    } catch (error) {
      console.error('Error getting loan applications by user:', error);
      throw new Error(`Failed to get loan applications by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // GET LOAN APPLICATIONS BY BROKER
  // ============================================================================

  async getLoanApplicationsByBroker(brokerId: string): Promise<LoanApplication[]> {
    try {
      console.log('Getting loan applications for broker:', brokerId);
      
      const q = query(
        collection(db, this.collectionName),
        where('brokerId', '==', brokerId)
      );
      
      const querySnapshot = await getDocs(q);
      const applications: LoanApplication[] = [];
      
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as LoanApplication);
      });
      
      // Sort by updatedAt if available, otherwise by creation date
      applications.sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt;
        const bDate = b.updatedAt || b.createdAt;
        
        if (!aDate || !bDate) return 0;
        
        // Convert Firestore Timestamps to numbers for comparison
        const aTime = aDate instanceof Date ? aDate.getTime() : aDate.toMillis();
        const bTime = bDate instanceof Date ? bDate.getTime() : bDate.toMillis();
        
        return bTime - aTime; // Descending order
      });
      
      console.log(`Found ${applications.length} applications for broker ${brokerId}`);
      return applications;
    } catch (error) {
      console.error('Error getting loan applications by broker:', error);
      throw new Error(`Failed to get loan applications by broker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // UPDATE MULTIPLE FIELDS
  // ============================================================================

  async updateApplicationFields(
    applicationId: string,
    updates: Record<string, any>
  ): Promise<void> {
    try {
      console.log('Updating application fields:', { applicationId, updates });
      
      const docRef = doc(db, this.collectionName, applicationId);
      
      // Update multiple fields
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Application fields updated successfully');
    } catch (error) {
      console.error('Error updating application fields:', error);
      throw new Error(`Failed to update application fields: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // UPDATE SPECIFIC FIELD
  // ============================================================================

  async updateApplicationField(
    applicationId: string,
    fieldPath: string,
    value: any
  ): Promise<void> {
    try {
      console.log('Updating application field:', { applicationId, fieldPath, value });
      
      const docRef = doc(db, this.collectionName, applicationId);
      
      // Handle nested field updates
      const fieldParts = fieldPath.split('.');
      const updateData: any = {};
      let current = updateData;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current[fieldParts[i]] = {};
        current = current[fieldParts[i]];
      }
      
      current[fieldParts[fieldParts.length - 1]] = value;
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(docRef, updateData);
      
      console.log('Application field updated successfully');
    } catch (error) {
      console.error('Error updating application field:', error);
      throw new Error(`Failed to update application field: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // UPDATE APPLICATION SECTION
  // ============================================================================

  async updateApplicationSection(
    applicationId: string,
    section: string,
    data: any
  ): Promise<void> {
    try {
      console.log('Updating application section:', { applicationId, section, data });
      
      const docRef = doc(db, this.collectionName, applicationId);
      
      await updateDoc(docRef, {
        [section]: data,
        updatedAt: serverTimestamp()
      });
      
      console.log('Application section updated successfully');
    } catch (error) {
      console.error('Error updating application section:', error);
      throw new Error(`Failed to update application section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // SUBMIT APPLICATION
  // ============================================================================

  async submitApplication(applicationId: string): Promise<void> {
    try {
      console.log('Submitting application:', applicationId);
      
      const docRef = doc(db, this.collectionName, applicationId);
      
      await updateDoc(docRef, {
        status: 'submitted',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // ASSIGN APPLICATION
  // ============================================================================

  async assignApplication(applicationId: string, workforceMemberId: string): Promise<void> {
    try {
      console.log('Assigning application:', { applicationId, workforceMemberId });
      
      const docRef = doc(db, this.collectionName, applicationId);
      
      await updateDoc(docRef, {
        assignedTo: workforceMemberId,
        updatedAt: serverTimestamp()
      });
      
      console.log('Application assigned successfully');
    } catch (error) {
      console.error('Error assigning application:', error);
      throw new Error(`Failed to assign application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // CALCULATE PROGRESS
  // ============================================================================

  async calculateProgress(applicationId: string): Promise<any> {
    try {
      console.log('Calculating progress for application:', applicationId);
      
      const application = await this.getLoanApplication(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Calculate progress based on completed sections
      const progress = {
        borrowerInfoCompleted: !!(application.borrowerInfo?.fullName && application.borrowerInfo?.email),
        businessInfoCompleted: !!(application.businessInfo?.businessName),
        loanDetailsCompleted: !!(application.loanDetails?.loanAmount),
        financialInfoCompleted: !!(application.financialInfo?.monthlyDebt !== undefined),
        propertyInfoCompleted: !!(application.propertyInfo?.propertyAddress?.street),
        employmentInfoCompleted: !!(application.borrowerInfo?.employmentStatus),
        documentsUploaded: false, // Will be implemented later
        overallProgress: 0
      };
      
      // Calculate overall progress
      const completedSections = Object.values(progress).filter(Boolean).length - 1; // -1 for overallProgress
      progress.overallProgress = Math.round((completedSections / 7) * 100);
      
      // Update the progress in the database
      const docRef = doc(db, this.collectionName, applicationId);
      await updateDoc(docRef, {
        progress,
        updatedAt: serverTimestamp()
      });
      
      console.log('Progress calculated and updated successfully');
      return progress;
    } catch (error) {
      console.error('Error calculating progress:', error);
      throw new Error(`Failed to calculate progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // ADD HISTORY ENTRY
  // ============================================================================

  async addHistoryEntry(
    applicationId: string,
    action: string,
    description: string,
    performedBy: string,
    details?: any
  ): Promise<void> {
    try {
      console.log('Adding history entry:', { applicationId, action, description, performedBy, details });
      
      const docRef = doc(db, this.collectionName, applicationId);
      const historyEntry = {
        action,
        description,
        performedBy,
        timestamp: serverTimestamp(),
        details
      };
      
      // Get current history and add new entry
      const currentDoc = await getDoc(docRef);
      const currentHistory = currentDoc.data()?.history || [];
      
      await updateDoc(docRef, {
        history: [...currentHistory, historyEntry],
        updatedAt: serverTimestamp()
      });
      
      console.log('History entry added successfully');
    } catch (error) {
      console.error('Error adding history entry:', error);
      throw new Error(`Failed to add history entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // DELETE APPLICATION
  // ============================================================================

  async deleteApplication(applicationId: string): Promise<void> {
    try {
      console.log('Deleting application:', applicationId);
      
      const docRef = doc(db, this.collectionName, applicationId);
      await setDoc(docRef, { deleted: true, deletedAt: serverTimestamp() }, { merge: true });
      
      console.log('Application deleted successfully');
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error(`Failed to delete application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // RESTORE APPLICATION
  // ============================================================================

  async restoreApplication(applicationId: string): Promise<void> {
    try {
      console.log('Restoring application:', applicationId);
      
      const docRef = doc(db, this.collectionName, applicationId);
      await updateDoc(docRef, {
        deleted: false,
        deletedAt: null,
        updatedAt: serverTimestamp()
      });
      
      console.log('Application restored successfully');
    } catch (error) {
      console.error('Error restoring application:', error);
      throw new Error(`Failed to restore application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export service instance
export const enhancedLoanApplicationService = new EnhancedLoanApplicationService();
