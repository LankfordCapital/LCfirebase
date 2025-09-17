// ============================================================================
// USE GROUND UP CONSTRUCTION FORM HOOK
// ============================================================================
// Simple hook to save form data to the comprehensive object structure

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  ResidentialNOOGroundUpConstructionApplication,
  ApplicationProgress,
  ApplicationHistoryEntry
} from '@/lib/residential-noo-ground-up-construction-types';

export function useGroundUpConstructionForm(applicationId?: string) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [application, setApplication] = useState<ResidentialNOOGroundUpConstructionApplication | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks - with safe initialization
  const authContext = useAuth();
  const user = authContext?.user || null;
  const toastContext = useToast();
  const toast = toastContext?.toast || (() => {});
  
  // ============================================================================
  // INITIALIZATION CHECK
  // ============================================================================
  
  useEffect(() => {
    // Check if contexts are ready
    if (authContext && toastContext) {
      setIsInitialized(true);
    }
  }, [authContext, toastContext]);

  // ============================================================================
  // DATA TRANSFORMATION HELPER
  // ============================================================================
  
  const transformApiDataToApplication = useCallback((apiData: any): ResidentialNOOGroundUpConstructionApplication => {
    return {
      // Map the basic fields
      userId: apiData.userId || user?.uid || '',
      brokerId: apiData.brokerId || user?.uid || '',
      loanType: 'residential_noo_ground_up_construction',
      status: apiData.status || 'draft',
      createdAt: apiData.createdAt || new Date() as any,
      updatedAt: apiData.updatedAt || new Date() as any,
      
      // Map nested objects with defaults
      propertyInfo: apiData.propertyInfo || {
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
        requestedClosingDate: new Date() as any
      },
      
      loanDetails: apiData.loanDetails || {
        loanAmount: 0,
        transactionType: 'purchase'
      },
      
      businessInfo: apiData.businessInfo || {
        companyName: '',
        companyEin: ''
      },
      
      financialInfo: apiData.financialInfo || {
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
        netOperatingIncome: 0
      },
      
      borrowerInfo: apiData.borrowerInfo || {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: new Date() as any,
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
        employmentStatus: 'employed',
        annualIncome: 0,
        citizenship: 'us_citizen'
      },
      
      // Add all other required fields with defaults
      financialAssets: apiData.financialAssets || {
        checkingAccounts: [],
        savingsAccounts: [],
        investments: [],
        realEstate: [],
        vehicles: [],
        otherAssets: [],
        totalAssets: 0
      },
      
      financialLiabilities: apiData.financialLiabilities || {
        creditCards: [],
        personalLoans: [],
        studentLoans: [],
        autoLoans: [],
        mortgages: [],
        businessLoans: [],
        otherLiabilities: [],
        totalLiabilities: 0
      },
      
      incomeInfo: apiData.incomeInfo || {
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
      
      employmentInfo: apiData.employmentInfo || {
        currentEmployer: {
          companyName: '',
          position: '',
          startDate: new Date() as any,
          annualSalary: 0,
          supervisorName: '',
          supervisorPhone: '',
          companyAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          }
        },
        previousEmployment: []
      },
      
      businessInfoExtended: apiData.businessInfoExtended || {
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
          zipCode: ''
        },
        annualRevenue: 0,
        annualProfit: 0,
        businessLicense: '',
        businessExperience: {
          totalYearsInIndustry: 0
        }
      },
      
      propertyDetails: apiData.propertyDetails || {
        zoning: '',
        permittedUses: [],
        buildingPermits: [],
        environmentalIssues: {
          hasIssues: false
        },
        propertyPhotos: [],
        propertyDocuments: []
      },
      
      constructionPlans: apiData.constructionPlans || {
        planRevision: '',
        planDate: new Date() as any,
        architectName: '',
        architectLicense: '',
        engineerName: '',
        engineerLicense: '',
        plansApproved: false,
        approvalAuthority: '',
        approvalNumber: ''
      },
      
      contractorInfo: apiData.contractorInfo || {
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
        subcontractors: []
      },
      
      constructionBudget: apiData.constructionBudget || {
        totalBudget: 0,
        breakdown: [],
        contingency: 0,
        softCosts: 0,
        hardCosts: 0,
        fundingSources: []
      },
      
      constructionTimeline: apiData.constructionTimeline || {
        startDate: new Date() as any,
        completionDate: new Date() as any,
        duration: 0,
        milestones: [],
        criticalPath: []
      },
      
      insuranceInfo: apiData.insuranceInfo || {
        buildersRisk: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any,
          deductible: 0
        },
        generalLiability: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any,
          deductible: 0
        },
        workersComp: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any
        },
        additionalInsurance: []
      },
      
      permitInfo: apiData.permitInfo || {
        buildingPermits: [],
        otherPermits: [],
        allPermitsApproved: false
      },
      
      applicationReview: apiData.applicationReview || {
        reviewChecklist: {
          allPagesCompleted: false,
          allDocumentsUploaded: false,
          allRequiredFieldsFilled: false,
          financialsVerified: false,
          plansApproved: false,
          permitsObtained: false,
          insuranceInPlace: false,
          contractorVetted: false
        },
        finalReview: {
          reviewedBy: '',
          reviewDate: new Date() as any,
          reviewNotes: '',
          approvalStatus: 'pending'
        },
        submission: {
          submittedBy: '',
          submittedAt: new Date() as any,
          submissionMethod: 'online',
          confirmationNumber: ''
        }
      },
      
      documents: apiData.documents || {
        einCertificate: {
          name: 'EIN Certificate (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        formationDocumentation: {
          name: 'Formation Documentation (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        operatingAgreementBylaws: {
          name: 'Operating Agreement/Bylaws (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        partnershipOfficerList: {
          name: 'Partnership/Officer List (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        businessLicense: {
          name: 'Business License (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        certificateOfGoodStanding: {
          name: 'Certificate of Good Standing (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        buildingPermits: [],
        otherPermits: [],
        additionalDocuments: []
      },
      
                progress: {
            // Map the API progress fields to our expected page structure
            page1Completed: apiData.progress?.borrowerInfoCompleted || false,
            page2Completed: apiData.progress?.financialInfoCompleted || false,
            page3Completed: apiData.progress?.propertyInfoCompleted || false,
            page4Completed: apiData.progress?.businessInfoCompleted || false,
            page5Completed: apiData.progress?.loanDetailsCompleted || false,
            page6Completed: apiData.progress?.employmentInfoCompleted || false,
            page7Completed: false, // Future pages
            page8Completed: false,
            page9Completed: false,
            page10Completed: false,
            page11Completed: false,
            page12Completed: false,
            overallProgress: apiData.progress?.overallProgress || 0,
            sectionsCompleted: apiData.progress?.sectionsCompleted || 0,
            totalSections: 12,
            documentsRequired: apiData.progress?.documentsRequired || 0,
            documentsUploaded: apiData.progress?.documentsUploaded || 0,
            documentsVerified: apiData.progress?.documentsVerified || 0,
            documentsMissing: apiData.progress?.documentsMissing || 0,
            applicationStarted: apiData.progress?.applicationStarted || new Date() as any,
            lastUpdated: apiData.progress?.lastUpdated || new Date() as any
          },
      
      history: apiData.history || [{
        action: 'application_loaded',
        description: 'Application loaded from database',
        performedBy: user?.uid || '',
        timestamp: new Date() as any,
        status: 'draft'
      }],
      
      notes: apiData.notes || {
        noteHistory: []
      },
      
      calculatedFields: apiData.calculatedFields || {
        debtToIncomeRatio: 0,
        loanToValueRatio: 0,
        debtServiceCoverageRatio: 0,
        constructionCostPerSqFt: 0,
        timelineEfficiency: 0,
        riskScore: 0,
        riskFactors: []
      }
    };
  }, [user]);

  // ============================================================================
  // LOAD EXISTING APPLICATION
  // ============================================================================
  
  const loadApplication = useCallback(async () => {
    if (!applicationId || !user || !authContext || !toastContext) return;
    
    try {
      console.log('Loading application:', applicationId);
      
      const response = await fetch(`/api/enhanced-loan-applications?id=${applicationId}`);
      if (!response.ok) {
        throw new Error(`Failed to load application: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        console.log('Application loaded successfully:', result.data);
        
        // Transform the API data to match our expected structure
        const transformedApplication = transformApiDataToApplication(result.data);
        console.log('Transformed application:', transformedApplication);
        console.log('Progress mapping:', {
          page1Completed: transformedApplication.progress.page1Completed,
          page2Completed: transformedApplication.progress.page2Completed,
          overallProgress: transformedApplication.progress.overallProgress
        });
        setApplication(transformedApplication);
      } else {
        console.error('Failed to load application:', result.error);
        toast({
          variant: 'destructive',
          title: 'Load Error',
          description: result.error || 'Failed to load application',
        });
      }
    } catch (error) {
      console.error('Error loading application:', error);
      toast({
        variant: 'destructive',
        title: 'Load Error',
        description: error instanceof Error ? error.message : 'Failed to load application',
      });
    }
  }, [applicationId, user, authContext, toastContext, toast]);

  // Load application when applicationId is provided
  useEffect(() => {
    if (applicationId && isInitialized && !application) {
      loadApplication();
    }
  }, [applicationId, isInitialized, application, loadApplication]);
  
  // ============================================================================
  // INITIALIZE APPLICATION
  // ============================================================================
  
  const initializeApplication = useCallback((brokerId: string) => {
    if (!user || !authContext || !toastContext) return null;
    
    // Initialize progress tracking
    const progress: ApplicationProgress = {
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
      applicationStarted: new Date() as any, // Will be converted to Timestamp when saved
      lastUpdated: new Date() as any
    };

    // Initialize history
    const history: ApplicationHistoryEntry[] = [{
      action: 'application_created',
      description: 'Residential NOO Ground Up Construction application created',
      performedBy: brokerId,
      timestamp: new Date() as any,
      status: 'draft'
    }];

    // Create the application object with default values
    const newApplication: ResidentialNOOGroundUpConstructionApplication = {
      userId: user.uid,
      brokerId,
      loanType: 'residential_noo_ground_up_construction',
      status: 'draft',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      
      // Initialize all page data with empty/default values
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
        requestedClosingDate: new Date() as any
      },
      
      loanDetails: {
        loanAmount: 0,
        transactionType: 'purchase'
      },
      
      businessInfo: {
        companyName: '',
        companyEin: ''
      },
      
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
        netOperatingIncome: 0
      },
      
      borrowerInfo: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: new Date() as any,
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
        employmentStatus: 'employed',
        annualIncome: 0,
        citizenship: 'us_citizen'
      },
      
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
      
      incomeInfo: {
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
      
      employmentInfo: {
        currentEmployer: {
          companyName: '',
          position: '',
          startDate: new Date() as any,
          annualSalary: 0,
          supervisorName: '',
          supervisorPhone: '',
          companyAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          }
        },
        previousEmployment: []
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
          zipCode: ''
        },
        annualRevenue: 0,
        annualProfit: 0,
        businessLicense: '',
        businessExperience: {
          totalYearsInIndustry: 0
        }
      },
      
      propertyDetails: {
        zoning: '',
        permittedUses: [],
        buildingPermits: [],
        environmentalIssues: {
          hasIssues: false
        },
        propertyPhotos: [],
        propertyDocuments: []
      },
      
      constructionPlans: {
        planRevision: '',
        planDate: new Date() as any,
        architectName: '',
        architectLicense: '',
        engineerName: '',
        engineerLicense: '',
        plansApproved: false,
        approvalAuthority: '',
        approvalNumber: ''
      },
      
      contractorInfo: {
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
        subcontractors: []
      },
      
      constructionBudget: {
        totalBudget: 0,
        breakdown: [],
        contingency: 0,
        softCosts: 0,
        hardCosts: 0,
        fundingSources: []
      },
      
      constructionTimeline: {
        startDate: new Date() as any,
        completionDate: new Date() as any,
        duration: 0,
        milestones: [],
        criticalPath: []
      },
      
      insuranceInfo: {
        buildersRisk: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any,
          deductible: 0
        },
        generalLiability: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any,
          deductible: 0
        },
        workersComp: {
          carrier: '',
          policyNumber: '',
          coverage: 0,
          premium: 0,
          effectiveDate: new Date() as any,
          expirationDate: new Date() as any
        },
        additionalInsurance: []
      },
      
      permitInfo: {
        buildingPermits: [],
        otherPermits: [],
        allPermitsApproved: false
      },
      
      applicationReview: {
        reviewChecklist: {
          allPagesCompleted: false,
          allDocumentsUploaded: false,
          allRequiredFieldsFilled: false,
          financialsVerified: false,
          plansApproved: false,
          permitsObtained: false,
          insuranceInPlace: false,
          contractorVetted: false
        },
        finalReview: {
          reviewedBy: '',
          reviewDate: new Date() as any,
          reviewNotes: '',
          approvalStatus: 'pending'
        },
        submission: {
          submittedBy: '',
          submittedAt: new Date() as any,
          submissionMethod: 'online',
          confirmationNumber: ''
        }
      },
      
      documents: {
        einCertificate: {
          name: 'EIN Certificate (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        formationDocumentation: {
          name: 'Formation Documentation (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        operatingAgreementBylaws: {
          name: 'Operating Agreement/Bylaws (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        partnershipOfficerList: {
          name: 'Partnership/Officer List (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        businessLicense: {
          name: 'Business License (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        certificateOfGoodStanding: {
          name: 'Certificate of Good Standing (Company)',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          uploadedAt: new Date() as any,
          uploadedBy: '',
          status: 'missing'
        },
        buildingPermits: [],
        otherPermits: [],
        additionalDocuments: []
      },
      
      progress,
      history,
      notes: {
        noteHistory: []
      },
      
      calculatedFields: {
        debtToIncomeRatio: 0,
        loanToValueRatio: 0,
        debtServiceCoverageRatio: 0,
        constructionCostPerSqFt: 0,
        timelineEfficiency: 0,
        riskScore: 0,
        riskFactors: []
      }
    };

    setApplication(newApplication);
    return newApplication;
  }, [user]);

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================
  
  const updateField = useCallback((fieldPath: string, value: any) => {
    if (!application) return;
    
    // Update local state immediately for responsive UI
    setApplication(prev => {
      if (!prev) return prev;
      
      const newApp = { ...prev };
      const fieldParts = fieldPath.split('.');
      let current: any = newApp;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (!current[fieldParts[i]]) {
          current[fieldParts[i]] = {};
        }
        current = current[fieldParts[i]];
      }
      
      current[fieldParts[fieldParts.length - 1]] = value;
      return newApp;
    });
    
    // Trigger auto-save with the updated data
    const updates = { [fieldPath]: value };
    debouncedAutoSave(updates);
  }, [application, debouncedAutoSave]);
  
  const updateFields = useCallback((updates: Record<string, any>) => {
    if (!application) return;
    
    // Update local state immediately
    setApplication(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, [application]);

  // ============================================================================
  // AUTO-SAVE OPERATIONS
  // ============================================================================
  
  const autoSave = useCallback(async (data: Partial<ResidentialNOOGroundUpConstructionApplication>) => {
    if (!applicationId || !user || !userProfile) return;
    
    try {
      setSaving(true);
      console.log('Auto-saving application data:', data);
      
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          action: 'updateSection',
          applicationId: applicationId,
          section: 'propertyInfo',
          data: data
        })
      });
      
      if (!response.ok) {
        throw new Error(`Auto-save failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setLastSaved(new Date());
        console.log('Auto-save successful');
      } else {
        throw new Error(result.error || 'Auto-save failed');
      }
      
    } catch (err) {
      console.error('Auto-save error:', err);
      // Don't show toast for auto-save errors to avoid spam
    } finally {
      setSaving(false);
    }
  }, [applicationId, user, userProfile]);
  
  // Debounced auto-save
  const debouncedAutoSave = useCallback((data: Partial<ResidentialNOOGroundUpConstructionApplication>) => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer for 2 seconds
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave(data);
    }, 2000);
  }, [autoSave]);

  // ============================================================================
  // SAVE OPERATIONS
  // ============================================================================
  
  const saveApplication = useCallback(async (saveFunction: (data: ResidentialNOOGroundUpConstructionApplication) => Promise<void>) => {
    if (!application) return;
    
    setSaving(true);
    
    try {
      await saveFunction(application);
      setLastSaved(new Date());
      
      toast({
        title: 'Success',
        description: 'Application saved successfully!',
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save application';
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  }, [application, toast]);

  // ============================================================================
  // PROGRESS OPERATIONS
  // ============================================================================
  
  const markPageCompleted = useCallback((pageNumber: number) => {
    if (!application) return;
    
    setApplication(prev => {
      if (!prev) return prev;
      
      const newApp = { ...prev };
      const progress = newApp.progress;
      
      const pageKey = `page${pageNumber}Completed` as keyof typeof progress;
      if (pageKey in progress) {
        (progress as any)[pageKey] = true;
        
        // Recalculate overall progress
        const completedPages = Object.keys(progress)
          .filter(key => key.startsWith('page') && key.endsWith('Completed'))
          .filter(key => (progress as any)[key])
          .length;
        
        progress.sectionsCompleted = completedPages;
        progress.overallProgress = Math.round((completedPages / progress.totalSections) * 100);
        progress.lastUpdated = new Date() as any;
      }
      
      return newApp;
    });
  }, [application]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const getApplicationData = useCallback(() => {
    return application;
  }, [application]);
  
  const resetApplication = useCallback(() => {
    setApplication(null);
    setLastSaved(null);
  }, []);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================
  
  return {
    // State
    application,
    saving,
    lastSaved,
    isInitialized,
    
    // Actions
    initializeApplication,
    loadApplication,
    updateField,
    updateFields,
    saveApplication,
    markPageCompleted,
    getApplicationData,
    resetApplication,
    
    // Computed values
    progress: application?.progress || null,
    documents: application?.documents || null,
    calculatedFields: application?.calculatedFields || null,
    
    // Helper functions
    isPageCompleted: (pageNumber: number) => {
      if (!application?.progress) return false;
      const pageKey = `page${pageNumber}Completed` as keyof typeof application.progress;
      return (application.progress as any)[pageKey] || false;
    },
    
    getOverallProgress: () => application?.progress?.overallProgress || 0,
    
    getDocumentsStatus: () => {
      if (!application?.documents) return { uploaded: 0, total: 0 };
      
      const total = Object.keys(application.documents).length;
      const uploaded = Object.values(application.documents).filter(doc => 
        doc && typeof doc === 'object' && 'status' in doc && doc.status === 'uploaded'
      ).length;
      
      return { uploaded, total };
    }
  };
  
  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  
  // ============================================================================
  // RETURN HOOK INTERFACE
  // ============================================================================
  
  return {
    // State
    application,
    saving,
    lastSaved,
    isInitialized,
    
    // Operations
    initializeApplication,
    updateField,
    updateFields,
    saveApplication,
    markPageCompleted,
    getApplicationData,
    resetApplication,
    
    // Utilities
    getDocumentProgress
  };
}
