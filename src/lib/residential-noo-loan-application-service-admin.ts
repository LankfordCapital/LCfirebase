// Residential NOO Loan Application Service (Server-Side)
// This service handles all Residential NOO loan application operations with type-safe data handling
// Uses Firebase Admin for server-side operations

import { FieldValue, Timestamp, FieldValue as AdminFieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';
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
// SERVICE CLASS FOR RESIDENTIAL NOO LOAN APPLICATIONS (SERVER-SIDE)
// ============================================================================

export class ResidentialNOOLoanApplicationServiceAdmin {
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
      createdAt: AdminFieldValue.serverTimestamp() as any,
      updatedAt: AdminFieldValue.serverTimestamp() as any,
      
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
        applicationStarted: AdminFieldValue.serverTimestamp() as any,
        lastUpdated: AdminFieldValue.serverTimestamp() as any
      },
      
      // Initialize history and notes
      history: [{
        action: 'application_created',
        description: `Residential NOO ${program} application created`,
        performedBy: brokerId,
        timestamp: AdminFieldValue.serverTimestamp() as any,
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

    await adminDb.collection(this.collectionName).doc(applicationId).set(newApplication);
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
      const docRef = adminDb.collection(this.collectionName).doc(applicationId);
      const docSnap = await docRef.get();
      
      if (docSnap.exists) {
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
      const q = adminDb.collection(this.collectionName).where('userId', '==', userId);
      
      const querySnapshot = await q.get();
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
      const q = adminDb.collection(this.collectionName).where('brokerId', '==', brokerId);
      
      const querySnapshot = await q.get();
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
      const q = adminDb.collection(this.collectionName).where('status', '==', status);
      
      const querySnapshot = await q.get();
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
      const docRef = adminDb.collection(this.collectionName).doc(applicationId);
      const updateData: any = {};
      
      // Handle nested field updates
      const fieldParts = fieldPath.split('.');
      let current = updateData;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current[fieldParts[i]] = {};
        current = current[fieldParts[i]];
      }
      
      current[fieldParts[fieldParts.length - 1]] = value;
      updateData.updatedAt = AdminFieldValue.serverTimestamp();
      
      await docRef.update(updateData);
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
      const docRef = adminDb.collection(this.collectionName).doc(applicationId);
      const updateData: any = {};
      
      // Handle nested field updates with dot notation
      for (const [key, value] of Object.entries(updates)) {
        if (key.includes('.')) {
          // Handle dot notation for nested fields
          const fieldParts = key.split('.');
          let current = updateData;
          
          for (let i = 0; i < fieldParts.length - 1; i++) {
            if (!current[fieldParts[i]]) {
              current[fieldParts[i]] = {};
            }
            current = current[fieldParts[i]];
          }
          
          current[fieldParts[fieldParts.length - 1]] = value;
        } else {
          // Handle regular fields
          updateData[key] = value;
        }
      }
      
      updateData.updatedAt = AdminFieldValue.serverTimestamp();
      
      await docRef.update(updateData);
    } catch (error) {
      console.error('Error updating fields:', error);
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
   * Mark a section as completed
   */
  async markSectionCompleted(
    applicationId: string,
    sectionName: keyof ApplicationProgress
  ): Promise<void> {
    const docRef = adminDb.collection(this.collectionName).doc(applicationId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const application = docSnap.data() as ResidentialNOOLoanApplication;
      const progress = application.progress;
      
      // Mark section as completed
      (progress as any)[sectionName] = true;
      
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
      
      await this.updateFields(applicationId, { progress });
    }
  }
}
