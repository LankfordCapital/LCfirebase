// Residential NOO Loan Application Hook
// This hook provides type-safe operations for Residential NOO loan applications

import { useState, useEffect, useCallback } from 'react';
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
} from '@/lib/residential-noo-loan-application-types';
import { residentialNOOService } from '@/lib/residential-noo-loan-application-service';

// ============================================================================
// HOOK FOR RESIDENTIAL NOO LOAN APPLICATIONS
// ============================================================================

export function useResidentialNOOLoanApplication(applicationId?: string) {
  // State
  const [application, setApplication] = useState<ResidentialNOOLoanApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // LOAD APPLICATION
  // ============================================================================

  const loadApplication = useCallback(async () => {
    if (!applicationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const app = await residentialNOOService.getApplication(applicationId);
      setApplication(app);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application');
      console.error('Error loading application:', err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // Load application when component mounts or applicationId changes
  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  // ============================================================================
  // CREATE APPLICATION
  // ============================================================================

  const createApplication = useCallback(async (
    userId: string,
    brokerId: string,
    program: ResidentialNOOProgram
  ): Promise<string | null> => {
    setSaving(true);
    setError(null);
    
    try {
      const newApplicationId = await residentialNOOService.createApplication(
        userId,
        brokerId,
        program
      );
      
      // Load the newly created application
      await loadApplication();
      
      return newApplicationId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
      console.error('Error creating application:', err);
      return null;
    } finally {
      setSaving(false);
    }
  }, [loadApplication]);

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================

  const updateField = useCallback(async (
    fieldPath: string,
    value: any
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateField(applicationId, fieldPath, value);
      
      // Update local state
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
      console.error('Error updating field:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  const updateFields = useCallback(async (
    updates: Record<string, any>,
    immediate: boolean = false
  ): Promise<void> => {
    if (!applicationId) return;
    
    if (!immediate) {
      setSaving(true);
    }
    setError(null);
    
    try {
      await residentialNOOService.updateFields(applicationId, updates);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fields');
      console.error('Error updating fields:', err);
    } finally {
      if (!immediate) {
        setSaving(false);
      }
    }
  }, [applicationId]);

  // ============================================================================
  // STATUS OPERATIONS
  // ============================================================================

  const updateStatus = useCallback(async (
    status: ApplicationStatus,
    performedBy: string,
    notes?: string
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateStatus(applicationId, status, performedBy, notes);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return { ...prev, status };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  // ============================================================================
  // PROGRAM-SPECIFIC UPDATE METHODS
  // ============================================================================

  const updateGroundUpConstructionInfo = useCallback(async (
    info: Partial<GroundUpConstructionInfo>
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateGroundUpConstructionInfo(applicationId, info);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          groundUpConstructionInfo: {
            ...prev.groundUpConstructionInfo,
            ...info
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update construction info');
      console.error('Error updating construction info:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  const updateFixAndFlipInfo = useCallback(async (
    info: Partial<FixAndFlipInfo>
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateFixAndFlipInfo(applicationId, info);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          fixAndFlipInfo: {
            ...prev.fixAndFlipInfo,
            ...info
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fix and flip info');
      console.error('Error updating fix and flip info:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  const updateDSCRInfo = useCallback(async (
    info: Partial<DSCRInfo>
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateDSCRInfo(applicationId, info);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dscrInfo: {
            ...prev.dscrInfo,
            ...info
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update DSCR info');
      console.error('Error updating DSCR info:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  const updateBridgeInfo = useCallback(async (
    info: Partial<BridgeInfo>
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.updateBridgeInfo(applicationId, info);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          bridgeInfo: {
            ...prev.bridgeInfo,
            ...info
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bridge info');
      console.error('Error updating bridge info:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  // ============================================================================
  // PROGRESS OPERATIONS
  // ============================================================================

  const markSectionCompleted = useCallback(async (
    sectionName: keyof ApplicationProgress
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.markSectionCompleted(applicationId, sectionName);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return prev;
        const newProgress = { ...prev.progress };
        newProgress[sectionName] = true;
        
        // Recalculate progress
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
          newProgress[section as keyof ApplicationProgress]
        ).length;
        
        newProgress.sectionsCompleted = completedSections;
        newProgress.overallProgress = Math.round((completedSections / newProgress.totalSections) * 100);
        
        return { ...prev, progress: newProgress };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark section completed');
      console.error('Error marking section completed:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId]);

  // ============================================================================
  // DOCUMENT OPERATIONS
  // ============================================================================

  const addDocument = useCallback(async (
    documentName: string,
    fileUrl: string,
    category: 'borrower' | 'company' | 'property' | 'additional',
    uploadedBy: string,
    fileSize: number,
    mimeType: string
  ): Promise<void> => {
    if (!applicationId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await residentialNOOService.addDocument(
        applicationId,
        documentName,
        fileUrl,
        category,
        uploadedBy,
        fileSize,
        mimeType
      );
      
      // Reload application to get updated document list
      await loadApplication();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
      console.error('Error adding document:', err);
    } finally {
      setSaving(false);
    }
  }, [applicationId, loadApplication]);

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  const calculateDTI = useCallback((): number => {
    if (!application) return 0;
    return residentialNOOService.calculateDTI(application);
  }, [application]);

  const calculateLTV = useCallback((): number => {
    if (!application) return 0;
    return residentialNOOService.calculateLTV(application);
  }, [application]);

  const validateApplication = useCallback(() => {
    if (!application) return { isValid: false, missingFields: [], errors: [] };
    return residentialNOOService.validateApplication(application);
  }, [application]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // State
    application,
    loading,
    saving,
    error,
    
    // Actions
    createApplication,
    loadApplication,
    updateField,
    updateFields,
    updateStatus,
    updateGroundUpConstructionInfo,
    updateFixAndFlipInfo,
    updateDSCRInfo,
    updateBridgeInfo,
    markSectionCompleted,
    addDocument,
    
    // Utilities
    calculateDTI,
    calculateLTV,
    validateApplication,
    resetError,
    
    // Type-safe getters for program-specific info
    groundUpConstructionInfo: application?.groundUpConstructionInfo,
    fixAndFlipInfo: application?.fixAndFlipInfo,
    dscrInfo: application?.dscrInfo,
    bridgeInfo: application?.bridgeInfo,
    
    // Type-safe getters for common info
    borrowerInfo: application?.borrowerInfo,
    businessInfo: application?.businessInfo,
    financialAssets: application?.financialAssets,
    financialLiabilities: application?.financialLiabilities,
    incomeInformation: application?.incomeInformation,
    loanDetails: application?.loanDetails,
    propertyInfo: application?.propertyInfo,
    documents: application?.documents,
    progress: application?.progress,
    history: application?.history,
    notes: application?.notes,
    
    // Program and status
    program: application?.program,
    status: application?.status,
    loanType: application?.loanType
  };
}
