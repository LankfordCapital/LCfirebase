import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { enhancedLoanApplicationService } from '@/lib/enhanced-loan-application-service';
import { EnhancedLoanApplication } from '@/lib/enhanced-loan-application-types';
// Use simplified types for now
interface SimpleLoanApplication {
  id?: string;
  userId: string;
  brokerId: string;
  loanCategory: string;
  loanProgram: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  borrowerInfo: any;
  businessInfo: any;
  financialInfo: any;
  loanDetails: any;
  propertyInfo: any;
  progress: any;
  history: any[];
  notes: any;
  [key: string]: any;
}

export function useLoanApplication(applicationId?: string) {
  const [application, setApplication] = useState<SimpleLoanApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  
  // Reference to store the last saved data for comparison
  const lastSavedDataRef = useRef<string>('');
  
  // Reference to store the auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // ============================================================================
  // LOAD APPLICATION DATA
  // ============================================================================
  
  const loadApplication = useCallback(async () => {
    if (!applicationId) return;
    
    // Don't try to load if user is not authenticated
    if (!user || !userProfile) {
      console.log('User not authenticated, skipping application load');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const appData = await enhancedLoanApplicationService.getLoanApplication(applicationId);
      if (appData) {
        setApplication(appData);
        // Store the last saved data for comparison
        lastSavedDataRef.current = JSON.stringify(appData);
      } else {
        setError('Application not found');
      }
    } catch (err) {
      console.error('Error loading application:', err);
      
      // Handle permission errors gracefully
      if (err instanceof Error && err.message.includes('permission-denied')) {
        setError('You do not have permission to access this application');
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to access this application.',
        });
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId, user, userProfile, toast]);
  
  // ============================================================================
  // AUTO-SAVE FUNCTIONALITY
  // ============================================================================
  
  const autoSave = useCallback(async (data: Partial<SimpleLoanApplication>) => {
    if (!applicationId || !user || !userProfile) return;
    
    // Don't try to save if we don't have an application loaded
    if (!application) {
      console.log('No application loaded, skipping auto-save');
      return;
    }
    
    try {
      setSaving(true);
      
      // Update the application state immediately for responsive UI
      setApplication(prev => prev ? { ...prev, ...data } : null);
      
      // Update the database
      await enhancedLoanApplicationService.updateApplicationFields(applicationId, data);
      
      // Update the last saved data reference
      const updatedApp = { ...application, ...data };
      lastSavedDataRef.current = JSON.stringify(updatedApp);
      
    } catch (err) {
      console.error('Error auto-saving application:', err);
      
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.message.includes('permission-denied')) {
          console.log('Permission denied, skipping auto-save');
          return;
        }
        if (err.message.includes('No document to update')) {
          console.log('Application document not found, skipping auto-save');
          setError('Application not found in database. Please refresh the page.');
          return;
        }
      }
      
      // Show error toast for other errors
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save your progress. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  }, [applicationId, application, user, userProfile, toast]);
  
  // ============================================================================
  // DEBOUNCED AUTO-SAVE
  // ============================================================================
  
  const debouncedAutoSave = useCallback((data: Partial<SimpleLoanApplication>) => {
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
  // UPDATE SPECIFIC FIELD
  // ============================================================================
  
  const updateField = useCallback(async (fieldPath: string, value: any) => {
    if (!applicationId || !user || !userProfile) return;
    
    try {
      // Update the application state immediately
      setApplication(prev => {
        if (!prev) return null;
        
        // Handle nested field updates using dot notation
        const fieldParts = fieldPath.split('.');
        const newApp = { ...prev };
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
      
      // Use debounced auto-save for field updates
      const updates = { [fieldPath]: value };
      debouncedAutoSave(updates);
      
    } catch (err) {
      console.error('Error updating field:', err);
    }
  }, [applicationId, user, userProfile, debouncedAutoSave]);
  
  // ============================================================================
  // UPDATE MULTIPLE FIELDS
  // ============================================================================
  
  const updateFields = useCallback(async (updates: Record<string, any>, immediate: boolean = false) => {
    if (!applicationId || !user || !userProfile) return;
    
    try {
      // Update the application state immediately
      setApplication(prev => prev ? { ...prev, ...updates } : null);
      
      // Use immediate save if requested, otherwise use debounced auto-save
      if (immediate) {
        await autoSave(updates);
      } else {
        debouncedAutoSave(updates);
      }
      
    } catch (err) {
      console.error('Error updating fields:', err);
    }
  }, [applicationId, user, userProfile, debouncedAutoSave, autoSave]);
  
  // ============================================================================
  // CREATE NEW APPLICATION
  // ============================================================================
  
  const createApplication = useCallback(async (
    userId: string,
    brokerId: string,
    loanProgram: string,
    initialData?: Partial<EnhancedLoanApplication>
  ) => {
    if (!user || !userProfile) {
      throw new Error('User must be authenticated to create an application');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newApplicationId = await enhancedLoanApplicationService.createLoanApplication(
        userId,
        brokerId,
        loanProgram as any,
        initialData
      );
      
      toast({
        title: 'Application Created',
        description: 'New loan application has been created successfully.',
      });
      
      return newApplicationId;
    } catch (err) {
      console.error('Error creating application:', err);
      setError(err instanceof Error ? err.message : 'Failed to create application');
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Failed to create loan application. Please try again.',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, userProfile, toast]);
  
  // ============================================================================
  // RESET APPLICATION
  // ============================================================================
  
  const resetApplication = useCallback(() => {
    setApplication(null);
    setError(null);
    setLoading(false);
    setSaving(false);
    
    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, []);
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Load application when ID changes or auth state changes
  useEffect(() => {
    if (applicationId && user && userProfile) {
      loadApplication();
    } else if (!applicationId) {
      resetApplication();
    }
  }, [applicationId, user, userProfile, loadApplication, resetApplication]);
  
  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
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
    loadApplication,
    updateField,
    updateFields,
    createApplication,
    resetApplication,
    
    // Utility
    hasUnsavedChanges: () => {
      if (!application) return false;
      const currentData = JSON.stringify(application);
      return currentData !== lastSavedDataRef.current;
    }
  };
}
