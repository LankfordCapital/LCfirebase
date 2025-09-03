// Residential NOO Loan Application Service
// This service handles all Residential NOO loan application operations with type-safe data handling

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
import { 
  ResidentialNOOLoanApplication, 
  ResidentialNOOProgram,
  ApplicationStatus,
  BorrowerPersonalInfo,
  BorrowerBusinessInfo,
  FinancialAssets,
  FinancialLiabilities,
  IncomeInformation,
  LoanDetails,
  PropertyInformation,
  DocumentTracking,
  ApplicationProgress,
  ApplicationHistory,
  ApplicationNotes,
  GroundUpConstructionInfo,
  FixAndFlipInfo,
  DSCRInfo,
  BridgeInfo
} from './residential-noo-loan-application-types';

// ============================================================================
// SERVICE CLASS FOR RESIDENTIAL NOO LOAN APPLICATIONS
// ============================================================================

export class ResidentialNOOLoanApplicationService {
  private readonly collectionName = 'residential-noo-applications';

  // ============================================================================
  // CREATE OPERATIONS
  // ============================================================================

  /**
   * Create a new Residential NOO loan application
   */
  async createApplication(
    userId: string,
    brokerId: string,
    program: ResidentialNOOProgram
  ): Promise<string> {
    const applicationId = `${userId}_${Date.now()}`;
    
    const newApplication: ResidentialNOOLoanApplication = {
      id: applicationId,
      userId,
      brokerId,
      loanType: 'residential_noo',
      program,
      status: 'draft',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      
      // Initialize borrower info
      borrowerInfo: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        ssn: '',
        maritalStatus: 'single',
        dependents: 0,
        currentAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          yearsAtAddress: 0,
          rentOrOwn: 'rent'
        },
        previousAddresses: [],
        employmentStatus: 'employed',
        annualIncome: 0,
        citizenship: 'us_citizen'
      },
      
      // Initialize business info (optional)
      businessInfo: undefined,
      
      // Initialize financial info
      financialAssets: {
        checkingAccounts: [],
        savingsAccounts: [],
        investments: [],
        realEstate: [],
        vehicles: [],
        otherAssets: [],
        totalAssets: 0
      },
      
      financialLiabilities: {
        creditCards: [],
        personalLoans: [],
        studentLoans: [],
        autoLoans: [],
        mortgages: [],
        businessLoans: [],
        otherLiabilities: [],
        totalLiabilities: 0
      },
      
      incomeInformation: {
        employmentIncome: {
          salary: 0,
          hourly: 0,
          commission: 0,
          bonus: 0,
          overtime: 0,
          total: 0
        },
        businessIncome: {
          netBusinessIncome: 0,
          distributions: 0,
          total: 0
        },
        investmentIncome: {
          dividends: 0,
          interest: 0,
          capitalGains: 0,
          rentalIncome: 0,
          total: 0
        },
        otherIncome: {
          socialSecurity: 0,
          disability: 0,
          alimony: 0,
          childSupport: 0,
          military: 0,
          other: 0,
          total: 0
        },
        totalMonthlyIncome: 0,
        totalAnnualIncome: 0
      },
      
      // Initialize loan details
      loanDetails: {
        loanAmount: 0,
        loanPurpose: '',
        term: 0,
        propertyType: '',
        downPayment: 0,
        downPaymentPercentage: 0
      },
      
      // Initialize property info
      propertyInfo: {
        propertyType: 'single_family',
        propertyUse: 'investment',
        propertyCondition: 'good'
      },
      
      // Initialize documents
      documents: {
        borrowerDocuments: {},
        companyDocuments: {},
        propertyDocuments: {},
        additionalDocuments: []
      },
      
      // Initialize progress
      progress: {
        borrowerInfoCompleted: false,
        businessInfoCompleted: false,
        loanDetailsCompleted: false,
        financialInfoCompleted: false,
        propertyInfoCompleted: false,
        employmentInfoCompleted: false,
        documentsUploaded: false,
        overallProgress: 0,
        sectionsCompleted: 0,
        totalSections: 7,
        documentsRequired: 0,
        documentsApproved: 0,
        documentsRejected: 0,
        applicationStarted: serverTimestamp() as Timestamp,
        lastUpdated: serverTimestamp() as Timestamp
      },
      
      // Initialize history and notes
      history: [{
        action: 'application_created',
        description: `Residential NOO ${program} application created`,
        performedBy: brokerId,
        timestamp: serverTimestamp() as Timestamp,
        status: 'draft'
      }],
      
      notes: {
        noteHistory: []
      }
    };

    // Add program-specific info based on the selected program
    switch (program) {
      case 'residential_noo_ground_up_construction':
        newApplication.groundUpConstructionInfo = {
          constructionInfo: {
            generalContractor: {
              name: '',
              license: '',
              insurance: {
                generalLiability: '',
                workersComp: '',
                buildersRisk: ''
              },
              experience: 0,
              references: []
            },
            constructionPlans: {},
            constructionBudget: {
              totalBudget: 0,
              breakdown: [],
              contingency: 0,
              softCosts: 0,
              hardCosts: 0
            },
            drawSchedule: [],
            constructionTimeline: {
              startDate: '',
              completionDate: '',
              duration: 0,
              milestones: []
            },
            insurance: {
              buildersRisk: {
                carrier: '',
                policyNumber: '',
                coverage: 0,
                premium: 0
              },
              generalLiability: {
                carrier: '',
                policyNumber: '',
                coverage: 0,
                premium: 0
              }
            }
          },
          landAcquisitionCost: 0,
          developmentCosts: 0,
          afterConstructionValue: 0,
          constructionLoanAmount: 0
        };
        break;
        
      case 'residential_noo_fix_and_flip':
        newApplication.fixAndFlipInfo = {
          purchasePrice: 0,
          rehabBudget: 0,
          afterRepairValue: 0,
          holdingPeriod: 0,
          exitStrategy: 'sell',
          rehabTimeline: {
            startDate: '',
            completionDate: '',
            duration: 0
          },
          rehabCostBreakdown: []
        };
        break;
        
      case 'residential_noo_dscr':
        newApplication.dscrInfo = {
          propertyCashFlow: 0,
          debtServiceCoverageRatio: 0,
          projectedRent: 0,
          operatingExpenses: {
            propertyTaxes: 0,
            insurance: 0,
            maintenance: 0,
            propertyManagement: 0,
            utilities: 0,
            hoaFees: 0,
            other: 0,
            total: 0
          }
        };
        break;
        
      case 'residential_noo_bridge':
        newApplication.bridgeInfo = {
          bridgeAmount: 0,
          bridgeTerm: 0,
          exitStrategy: 'refinance',
          bridgeRate: 0,
          bridgeFees: 0,
          prepaymentPenalty: false,
          balloonPayment: false
        };
        break;
    }

    await setDoc(doc(db, this.collectionName, applicationId), newApplication);
    return applicationId;
  }

  // ============================================================================
  // READ OPERATIONS
  // ============================================================================

  /**
   * Get a Residential NOO loan application by ID
   */
  async getApplication(applicationId: string): Promise<ResidentialNOOLoanApplication | null> {
    try {
      const docRef = doc(db, this.collectionName, applicationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ResidentialNOOLoanApplication;
      }
      return null;
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  }

  /**
   * Get all applications for a specific user
   */
  async getUserApplications(userId: string): Promise<ResidentialNOOLoanApplication[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ResidentialNOOLoanApplication);
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw error;
    }
  }

  /**
   * Get all applications for a specific broker
   */
  async getBrokerApplications(brokerId: string): Promise<ResidentialNOOLoanApplication[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('brokerId', '==', brokerId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ResidentialNOOLoanApplication);
    } catch (error) {
      console.error('Error getting broker applications:', error);
      throw error;
    }
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(status: ApplicationStatus): Promise<ResidentialNOOLoanApplication[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ResidentialNOOLoanApplication);
    } catch (error) {
      console.error('Error getting applications by status:', error);
      throw error;
    }
  }

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================

  /**
   * Update a specific field in the application
   */
  async updateField(
    applicationId: string, 
    fieldPath: string, 
    value: any
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, applicationId);
      const updateData: any = {};
      
      // Handle nested field updates
      const fieldParts = fieldPath.split('.');
      let current = updateData;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current[fieldParts[i]] = {};
        current = current[fieldParts[i]];
      }
      
      current[fieldParts[fieldParts.length - 1]] = value;
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating field:', error);
      throw error;
    }
  }

  /**
   * Update multiple fields at once
   */
  async updateFields(
    applicationId: string, 
    updates: Record<string, any>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, applicationId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating fields:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  async updateStatus(
    applicationId: string, 
    status: ApplicationStatus,
    performedBy: string,
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, applicationId);
      
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      // Add to history
      const historyEntry: ApplicationHistory = {
        action: 'status_updated',
        description: `Application status changed to ${status}`,
        performedBy,
        timestamp: serverTimestamp() as Timestamp,
        status
      };
      
      if (notes) {
        historyEntry.description += `: ${notes}`;
      }
      
      updateData.history = [historyEntry];
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  // ============================================================================
  // PROGRAM-SPECIFIC UPDATE METHODS
  // ============================================================================

  /**
   * Update Ground Up Construction specific information
   */
  async updateGroundUpConstructionInfo(
    applicationId: string,
    info: Partial<GroundUpConstructionInfo>
  ): Promise<void> {
    await this.updateFields(applicationId, {
      groundUpConstructionInfo: info
    });
  }

  /**
   * Update Fix and Flip specific information
   */
  async updateFixAndFlipInfo(
    applicationId: string,
    info: Partial<FixAndFlipInfo>
  ): Promise<void> {
    await this.updateFields(applicationId, {
      fixAndFlipInfo: info
    });
  }

  /**
   * Update DSCR specific information
   */
  async updateDSCRInfo(
    applicationId: string,
    info: Partial<DSCRInfo>
  ): Promise<void> {
    await this.updateFields(applicationId, {
      dscrInfo: info
    });
  }

  /**
   * Update Bridge loan specific information
   */
  async updateBridgeInfo(
    applicationId: string,
    info: Partial<BridgeInfo>
  ): Promise<void> {
    await this.updateFields(applicationId, {
      bridgeInfo: info
    });
  }

  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================

  /**
   * Update application progress
   */
  async updateProgress(
    applicationId: string,
    progress: Partial<ApplicationProgress>
  ): Promise<void> {
    await this.updateFields(applicationId, {
      progress: progress
    });
  }

  /**
   * Mark a section as completed
   */
  async markSectionCompleted(
    applicationId: string,
    sectionName: keyof Pick<ApplicationProgress, 'borrowerInfoCompleted' | 'businessInfoCompleted' | 'loanDetailsCompleted' | 'financialInfoCompleted' | 'propertyInfoCompleted' | 'employmentInfoCompleted' | 'constructionInfoCompleted' | 'documentsUploaded'>
  ): Promise<void> {
    const docRef = doc(db, this.collectionName, applicationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const application = docSnap.data() as ResidentialNOOLoanApplication;
      const progress = application.progress;
      
      // Mark section as completed
      progress[sectionName] = true;
      
      // Recalculate overall progress
      const sections = [
        'borrowerInfoCompleted',
        'businessInfoCompleted',
        'loanDetailsCompleted',
        'financialInfoCompleted',
        'propertyInfoCompleted',
        'employmentInfoCompleted',
        'constructionInfoCompleted',
        'documentsUploaded'
      ];
      
      const completedSections = sections.filter(section => 
        progress[section as keyof ApplicationProgress]
      ).length;
      
      progress.sectionsCompleted = completedSections;
      progress.overallProgress = Math.round((completedSections / progress.totalSections) * 100);
      
      await this.updateProgress(applicationId, progress);
    }
  }

  // ============================================================================
  // DOCUMENT MANAGEMENT
  // ============================================================================

  /**
   * Add a document to the application
   */
  async addDocument(
    applicationId: string,
    documentName: string,
    fileUrl: string,
    category: 'borrower' | 'company' | 'property' | 'additional',
    uploadedBy: string,
    fileSize: number,
    mimeType: string
  ): Promise<void> {
    const docRef = doc(db, this.collectionName, applicationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const application = docSnap.data() as ResidentialNOOLoanApplication;
      const documents = application.documents;
      
      const newDocument = {
        name: documentName,
        category,
        fileUrl,
        fileSize,
        mimeType,
        uploadedAt: serverTimestamp() as Timestamp,
        uploadedBy,
        status: 'pending' as const
      };
      
      if (category === 'additional') {
        documents.additionalDocuments.push(newDocument);
      } else {
        // For specific categories, update the appropriate section
        const categoryKey = `${category}Documents` as keyof typeof documents;
        const categoryDocs = documents[categoryKey] as any;
        
        if (categoryDocs && typeof categoryDocs === 'object') {
          categoryDocs[documentName] = {
            fileUrl,
            uploadedAt: serverTimestamp() as Timestamp,
            status: 'pending' as const
          };
        }
      }
      
      // Update document counts
      const progress = application.progress;
      progress.documentsApproved = progress.documentsApproved + 1;
      
      await this.updateFields(applicationId, {
        documents,
        progress
      });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Calculate debt-to-income ratio
   */
  calculateDTI(application: ResidentialNOOLoanApplication): number {
    const monthlyIncome = application.incomeInformation.totalMonthlyIncome;
    const monthlyDebt = application.financialLiabilities.totalLiabilities / 12; // Convert annual to monthly
    
    if (monthlyIncome === 0) return 0;
    return (monthlyDebt / monthlyIncome) * 100;
  }

  /**
   * Calculate loan-to-value ratio
   */
  calculateLTV(application: ResidentialNOOLoanApplication): number {
    const loanAmount = application.loanDetails.loanAmount;
    const propertyValue = application.loanDetails.propertyValue || 0;
    
    if (propertyValue === 0) return 0;
    return (loanAmount / propertyValue) * 100;
  }

  /**
   * Validate application completeness
   */
  validateApplication(application: ResidentialNOOLoanApplication): {
    isValid: boolean;
    missingFields: string[];
    errors: string[];
  } {
    const missingFields: string[] = [];
    const errors: string[] = [];
    
    // Check required borrower info
    if (!application.borrowerInfo.fullName) missingFields.push('borrowerInfo.fullName');
    if (!application.borrowerInfo.email) missingFields.push('borrowerInfo.email');
    if (!application.borrowerInfo.phone) missingFields.push('borrowerInfo.phone');
    
    // Check required loan details
    if (!application.loanDetails.loanAmount) missingFields.push('loanDetails.loanAmount');
    if (!application.loanDetails.loanPurpose) missingFields.push('loanDetails.loanPurpose');
    
    // Check required property info
    if (!application.propertyInfo.propertyType) missingFields.push('propertyInfo.propertyType');
    
    // Program-specific validation
    switch (application.program) {
      case 'residential_noo_ground_up_construction':
        if (!application.groundUpConstructionInfo?.constructionInfo?.generalContractor?.name) {
          missingFields.push('groundUpConstructionInfo.constructionInfo.generalContractor.name');
        }
        break;
        
      case 'residential_noo_fix_and_flip':
        if (!application.fixAndFlipInfo?.purchasePrice) {
          missingFields.push('fixAndFlipInfo.purchasePrice');
        }
        break;
        
      case 'residential_noo_dscr':
        if (!application.dscrInfo?.propertyCashFlow) {
          missingFields.push('dscrInfo.propertyCashFlow');
        }
        break;
        
      case 'residential_noo_bridge':
        if (!application.bridgeInfo?.bridgeAmount) {
          missingFields.push('bridgeInfo.bridgeAmount');
        }
        break;
    }
    
    const isValid = missingFields.length === 0 && errors.length === 0;
    
    return {
      isValid,
      missingFields,
      errors
    };
  }
}

// Export a singleton instance
export const residentialNOOService = new ResidentialNOOLoanApplicationService();
