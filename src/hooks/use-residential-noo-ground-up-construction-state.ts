import { useState, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { 
  ResidentialNOOGroundUpConstructionApplication,
  ApplicationDocument
} from '@/lib/residential-noo-ground-up-construction-types';

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================

const createInitialApplication = (userId: string, brokerId: string): ResidentialNOOGroundUpConstructionApplication => {
  const now = Timestamp.now();
  
  return {
    userId,
    brokerId,
    loanType: 'residential_noo_ground_up_construction',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    
    // Page 1: Loan & Property Details
    propertyInfo: {
      propertyAddress: '',
      propertyApn: '',
      annualPropertyTaxes: 0,
      propertyType: 'multi-family',
      asIsValue: 0,
      afterConstructedValue: 0,
      stabilizedValue: 0,
      propertySquareFootage: 0,
      lotSize: '',
      constructionTime: 0,
      requestedClosingDate: now,
    },
    loanDetails: {
      loanAmount: 0,
      transactionType: 'purchase',
    },
    businessInfo: {
      companyName: '',
      companyEin: '',
    },
    
    // Page 2: Company P&L Statement
    financialInfo: {
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      salaries: 0,
      rent: 0,
      utilities: 0,
      marketing: 0,
      repairs: 0,
      otherExpenses: 0,
      totalOperatingExpenses: 0,
      netOperatingIncome: 0,
    },
    
    // Page 3: Borrower Information
    borrowerInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: now,
      ssn: '',
      maritalStatus: 'single',
      dependents: 0,
      currentAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        yearsAtAddress: 0,
        rentOrOwn: 'rent',
      },
      employmentStatus: 'employed',
      annualIncome: 0,
      citizenship: 'us_citizen',
    },
    
    // Page 4: Financial Assets & Liabilities
    financialAssets: {
      checkingAccounts: [],
      savingsAccounts: [],
      investments: [],
      realEstate: [],
      vehicles: [],
      otherAssets: [],
      totalAssets: 0,
    },
    financialLiabilities: {
      creditCards: [],
      personalLoans: [],
      studentLoans: [],
      autoLoans: [],
      mortgages: [],
      businessLoans: [],
      otherLiabilities: [],
      totalLiabilities: 0,
    },
    
    // Page 5: Income Information
    incomeInfo: {
      employmentIncome: {
        salary: 0,
        hourly: 0,
        commission: 0,
        bonus: 0,
        overtime: 0,
        total: 0,
      },
      businessIncome: {
        netBusinessIncome: 0,
        distributions: 0,
        total: 0,
      },
      investmentIncome: {
        dividends: 0,
        interest: 0,
        capitalGains: 0,
        rentalIncome: 0,
        total: 0,
      },
      otherIncome: {
        socialSecurity: 0,
        disability: 0,
        alimony: 0,
        childSupport: 0,
        military: 0,
        other: 0,
        total: 0,
      },
      totalMonthlyIncome: 0,
      totalAnnualIncome: 0,
    },
    
    // Page 6: Employment & Business
    employmentInfo: {
      currentEmployer: {
        companyName: '',
        position: '',
        startDate: now,
        annualSalary: 0,
        supervisorName: '',
        supervisorPhone: '',
        companyAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
      },
      previousEmployment: [],
    },
    businessInfoExtended: {
      businessName: '',
      businessType: '',
      ein: '',
      businessStructure: 'llc',
      industry: '',
      yearsInBusiness: 0,
      numberOfEmployees: 0,
      ownershipPercentage: 0,
      businessAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      annualRevenue: 0,
      annualProfit: 0,
      businessLicense: '',
      businessExperience: {
        totalYearsInIndustry: 0,
      },
    },
    
    // Page 7: Property Details
    propertyDetails: {
      zoning: '',
      permittedUses: [],
      buildingPermits: [],
      environmentalIssues: {
        hasIssues: false,
      },
      propertyPhotos: [],
      propertyDocuments: [],
    },
    
    // Page 8: Construction Plans
    constructionPlans: {
      planRevision: '',
      planDate: now,
      architectName: '',
      architectLicense: '',
      engineerName: '',
      engineerLicense: '',
      plansApproved: false,
      approvalAuthority: '',
      approvalNumber: '',
    },
    
    // Page 9: Contractor Information
    contractorInfo: {
      generalContractor: {
        name: '',
        license: '',
        insurance: {
          generalLiability: '',
          workersComp: '',
          buildersRisk: '',
        },
        experience: 0,
        references: [],
      },
      subcontractors: [],
    },
    
    // Page 10: Budget & Timeline
    constructionBudget: {
      totalBudget: 0,
      breakdown: [],
      contingency: 0,
      softCosts: 0,
      hardCosts: 0,
      fundingSources: [],
    },
    constructionTimeline: {
      startDate: now,
      completionDate: now,
      duration: 0,
      milestones: [],
      criticalPath: [],
    },
    
    // Page 11: Insurance & Permits
    insuranceInfo: {
      buildersRisk: {
        carrier: '',
        policyNumber: '',
        coverage: 0,
        premium: 0,
        effectiveDate: now,
        expirationDate: now,
        deductible: 0,
      },
      generalLiability: {
        carrier: '',
        policyNumber: '',
        coverage: 0,
        premium: 0,
        effectiveDate: now,
        expirationDate: now,
        deductible: 0,
      },
      workersComp: {
        carrier: '',
        policyNumber: '',
        coverage: 0,
        premium: 0,
        effectiveDate: now,
        expirationDate: now,
      },
      additionalInsurance: [],
    },
    permitInfo: {
      buildingPermits: [],
      otherPermits: [],
      allPermitsApproved: false,
    },
    
    // Page 12: Review & Submit
    applicationReview: {
      reviewChecklist: {
        allPagesCompleted: false,
        allDocumentsUploaded: false,
        allRequiredFieldsFilled: false,
        financialsVerified: false,
        plansApproved: false,
        permitsObtained: false,
        insuranceInPlace: false,
        contractorVetted: false,
      },
      finalReview: {
        reviewedBy: '',
        reviewDate: now,
        reviewNotes: '',
        approvalStatus: 'pending',
      },
      submission: {
        submittedBy: '',
        submittedAt: now,
        submissionMethod: 'online',
        confirmationNumber: '',
      },
    },
    
    // Documents
    documents: {
      einCertificate: {} as ApplicationDocument,
      formationDocumentation: {} as ApplicationDocument,
      operatingAgreementBylaws: {} as ApplicationDocument,
      partnershipOfficerList: {} as ApplicationDocument,
      businessLicense: {} as ApplicationDocument,
      certificateOfGoodStanding: {} as ApplicationDocument,
      buildingPermits: [],
      otherPermits: [],
      additionalDocuments: [],
    },
    
    // Progress Tracking
    progress: {
      page1Completed: false,
      page2Completed: false,
      page3Completed: false,
      page4Completed: false,
      page5Completed: false,
      page6Completed: false,
      page7Completed: false,
      page8Completed: false,
      page9Completed: false,
      page10Completed: false,
      page11Completed: false,
      page12Completed: false,
      overallProgress: 0,
      sectionsCompleted: 0,
      totalSections: 12,
      documentsRequired: 0,
      documentsUploaded: 0,
      documentsVerified: 0,
      documentsMissing: 0,
      applicationStarted: now,
      lastUpdated: now,
    },
    
    // History
    history: [],
    
    // Notes
    notes: {
      noteHistory: [],
    },
    
    // Calculated Fields
    calculatedFields: {
      debtToIncomeRatio: 0,
      loanToValueRatio: 0,
      debtServiceCoverageRatio: 0,
      constructionCostPerSqFt: 0,
      timelineEfficiency: 0,
      riskScore: 0,
      riskFactors: [],
    },
  };
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useResidentialNOOGroundUpConstructionState = (
  userId: string,
  brokerId: string,
  initialData?: Partial<ResidentialNOOGroundUpConstructionApplication>
) => {
  // Create a unique key for this user's Ground Up Construction application
  const storageKey = `ground-up-construction-${userId}-${brokerId}`;
  
  const [application, setApplication] = useState<ResidentialNOOGroundUpConstructionApplication>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log(`🏗️ [Ground Up Construction] Loading state from localStorage:`, parsedData);
          console.log(`🏗️ [Ground Up Construction] Property Address from localStorage:`, parsedData.propertyInfo?.propertyAddress);
          
          // Convert timestamp strings back to proper objects
          const restoredData = {
            ...parsedData,
            createdAt: parsedData.createdAt ? new Date(parsedData.createdAt) : Timestamp.now(),
            updatedAt: parsedData.updatedAt ? new Date(parsedData.updatedAt) : Timestamp.now(),
            propertyInfo: {
              ...parsedData.propertyInfo,
              requestedClosingDate: parsedData.propertyInfo?.requestedClosingDate ? new Date(parsedData.propertyInfo.requestedClosingDate) : undefined,
            },
            borrowerInfo: {
              ...parsedData.borrowerInfo,
              dateOfBirth: parsedData.borrowerInfo?.dateOfBirth ? new Date(parsedData.borrowerInfo.dateOfBirth) : undefined,
            },
            progress: {
              ...parsedData.progress,
              applicationStarted: parsedData.progress?.applicationStarted ? new Date(parsedData.progress.applicationStarted) : Timestamp.now(),
              lastUpdated: parsedData.progress?.lastUpdated ? new Date(parsedData.progress.lastUpdated) : Timestamp.now(),
            },
          };
          
          console.log(`🏗️ [Ground Up Construction] Restored data Property Address:`, restoredData.propertyInfo?.propertyAddress);
          return restoredData;
        }
      } catch (error) {
        console.error(`🏗️ [Ground Up Construction] Error loading from localStorage:`, error);
      }
    }
    
    // Fallback to creating new application
    const baseApplication = createInitialApplication(userId, brokerId);
    return initialData ? { ...baseApplication, ...initialData } : baseApplication;
  });

  // ============================================================================
  // PERSISTENCE FUNCTIONS
  // ============================================================================

  const saveToLocalStorage = useCallback((data: ResidentialNOOGroundUpConstructionApplication) => {
    if (typeof window !== 'undefined') {
      try {
        // Convert Timestamp objects to strings for JSON serialization
        const serializableData = {
          ...data,
          createdAt: data.createdAt instanceof Date ? 
            (isNaN(data.createdAt.getTime()) ? new Date().toISOString() : data.createdAt.toISOString()) : 
            (typeof data.createdAt === 'string' ? data.createdAt : data.createdAt?.toString?.() || new Date().toISOString()),
          updatedAt: data.updatedAt instanceof Date ? 
            (isNaN(data.updatedAt.getTime()) ? new Date().toISOString() : data.updatedAt.toISOString()) : 
            (typeof data.updatedAt === 'string' ? data.updatedAt : data.updatedAt?.toString?.() || new Date().toISOString()),
          propertyInfo: {
            ...data.propertyInfo,
            requestedClosingDate: data.propertyInfo?.requestedClosingDate instanceof Date ? 
              (isNaN(data.propertyInfo.requestedClosingDate.getTime()) ? null : data.propertyInfo.requestedClosingDate.toISOString()) : 
              (typeof data.propertyInfo?.requestedClosingDate === 'string' ? data.propertyInfo.requestedClosingDate : data.propertyInfo?.requestedClosingDate?.toString?.() || null),
          },
          borrowerInfo: {
            ...data.borrowerInfo,
            dateOfBirth: data.borrowerInfo?.dateOfBirth instanceof Date ? 
              (isNaN(data.borrowerInfo.dateOfBirth.getTime()) ? null : data.borrowerInfo.dateOfBirth.toISOString()) : 
              (typeof data.borrowerInfo?.dateOfBirth === 'string' ? data.borrowerInfo.dateOfBirth : data.borrowerInfo?.dateOfBirth?.toString?.() || null),
          },
          progress: {
            ...data.progress,
            applicationStarted: data.progress?.applicationStarted instanceof Date ? 
              (isNaN(data.progress.applicationStarted.getTime()) ? new Date().toISOString() : data.progress.applicationStarted.toISOString()) : 
              (typeof data.progress?.applicationStarted === 'string' ? data.progress.applicationStarted : data.progress?.applicationStarted?.toString?.() || new Date().toISOString()),
            lastUpdated: data.progress?.lastUpdated instanceof Date ? 
              (isNaN(data.progress.lastUpdated.getTime()) ? new Date().toISOString() : data.progress.lastUpdated.toISOString()) : 
              (typeof data.progress?.lastUpdated === 'string' ? data.progress.lastUpdated : data.progress?.lastUpdated?.toString?.() || new Date().toISOString()),
          },
        };
        
        localStorage.setItem(storageKey, JSON.stringify(serializableData));
        console.log(`💾 [Ground Up Construction] State saved to localStorage`);
      } catch (error) {
        console.error(`🏗️ [Ground Up Construction] Error saving to localStorage:`, error);
      }
    }
  }, [storageKey]);

  // ============================================================================
  // UPDATE FUNCTIONS
  // ============================================================================

  const updateField = useCallback((
    path: string,
    value: any
  ) => {
    console.log(`🔄 [Ground Up Construction] Updating field: ${path} =`, value);
    
    setApplication(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: any = updated;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the final value
      current[keys[keys.length - 1]] = value;
      
      // Update timestamps
      updated.updatedAt = Timestamp.now();
      updated.progress.lastUpdated = Timestamp.now();
      
      // Save to localStorage
      saveToLocalStorage(updated);
      
      console.log(`✅ [Ground Up Construction] Field updated successfully: ${path}`);
      console.log(`📊 [Ground Up Construction] Current application state:`, updated);
      
      return updated;
    });
  }, [saveToLocalStorage]);

  const updateMultipleFields = useCallback((
    updates: Record<string, any>
  ) => {
    console.log(`🔄 [Ground Up Construction] Updating multiple fields:`, updates);
    
    setApplication(prev => {
      const updated = { ...prev };
      
      Object.entries(updates).forEach(([path, value]) => {
        const keys = path.split('.');
        let current: any = updated;
        
        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        // Set the final value
        current[keys[keys.length - 1]] = value;
        console.log(`  ✅ Updated: ${path} =`, value);
      });
      
      // Update timestamps
      updated.updatedAt = Timestamp.now();
      updated.progress.lastUpdated = Timestamp.now();
      
      // Save to localStorage
      saveToLocalStorage(updated);
      
      console.log(`✅ [Ground Up Construction] Multiple fields updated successfully`);
      console.log(`📊 [Ground Up Construction] Current application state:`, updated);
      
      return updated;
    });
  }, [saveToLocalStorage]);

  // ============================================================================
  // LOGGING FUNCTIONS
  // ============================================================================

  const logCurrentState = useCallback(() => {
    console.log(`📊 [Ground Up Construction] Current Application State:`, application);
    console.log(`📈 [Ground Up Construction] Progress:`, application.progress);
    console.log(`📝 [Ground Up Construction] Property Info:`, application.propertyInfo);
    console.log(`💰 [Ground Up Construction] Loan Details:`, application.loanDetails);
    console.log(`👤 [Ground Up Construction] Borrower Info:`, application.borrowerInfo);
  }, [application]);

  const logFieldValue = useCallback((path: string) => {
    const keys = path.split('.');
    let current: any = application;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        console.log(`❌ [Ground Up Construction] Field not found: ${path}`);
        return;
      }
    }
    
    console.log(`📋 [Ground Up Construction] Field value for "${path}":`, current);
  }, [application]);

  const clearState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
      console.log(`🗑️ [Ground Up Construction] State cleared from localStorage`);
    }
    
    // Reset to initial state
    const baseApplication = createInitialApplication(userId, brokerId);
    setApplication(baseApplication);
  }, [storageKey, userId, brokerId]);

  return {
    // State
    application,
    
    // Actions
    updateField,
    updateMultipleFields,
    clearState,
    
    // Logging
    logCurrentState,
    logFieldValue,
  };
};