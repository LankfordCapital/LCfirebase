
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { 
  BorrowerProfile, 
  CompanyProfile, 
  PersonalFinancialStatement, 
  BusinessDebtSchedule 
} from '@/lib/firestore-services';

interface BorrowerProfileState {
  profile: BorrowerProfile | null;
  loading: boolean;
  error: string | null;
  profileCompletion: BorrowerProfile['profileCompletion'] | null;
}

export function useBorrowerProfile() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<BorrowerProfileState>({
    profile: null,
    loading: false,
    error: null,
    profileCompletion: null
  });

  // Load borrower profile
  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/borrower-profile?uid=${user.uid}`);
      const result = await response.json();

      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          profile: result.data, 
          profileCompletion: result.data.profileCompletion,
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load profile', 
        loading: false 
      }));
    }
  }, [user?.uid]);

  // Update personal information
  const updatePersonalInfo = useCallback(async (personalInfo: BorrowerProfile['personalInfo']) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePersonalInfo',
          uid: user.uid,
          personalInfo
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, personalInfo } : null,
          loading: false
        }));

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Personal information updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update personal information', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update personal information',
      });
    }
  }, [user?.uid, toast]);

  // Update contact information
  const updateContactInfo = useCallback(async (contactInfo: BorrowerProfile['contactInfo']) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateContactInfo',
          uid: user.uid,
          contactInfo
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, contactInfo } : null,
          loading: false
        }));

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Contact information updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update contact information', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update contact information',
      });
    }
  }, [user?.uid, toast]);

  // Add or update company information
  const updateCompanyInfo = useCallback(async (company: CompanyProfile) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateCompanyInfo',
          uid: user.uid,
          company
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => {
          if (!prev.profile) return prev;
          
          const companies = prev.profile.companies || [];
          const existingIndex = companies.findIndex(c => c.id === company.id);
          
          if (existingIndex >= 0) {
            companies[existingIndex] = company;
          } else {
            companies.push(company);
          }

          return {
            ...prev,
            profile: { ...prev.profile, companies },
            loading: false
          };
        });

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Company information updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update company information', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update company information',
      });
    }
  }, [user?.uid, toast]);

  // Remove company
  const removeCompany = useCallback(async (companyId: string) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeCompany',
          uid: user.uid,
          companyId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => {
          if (!prev.profile) return prev;
          
          const companies = prev.profile.companies?.filter(c => c.id !== companyId) || [];

          return {
            ...prev,
            profile: { ...prev.profile, companies },
            loading: false
          };
        });

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Company removed successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to remove company', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove company',
      });
    }
  }, [user?.uid, toast]);

  // Update credit scores
  const updateCreditScores = useCallback(async (creditScores: NonNullable<BorrowerProfile['financialInfo']>['creditScores']) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateCreditScores',
          uid: user.uid,
          creditScores
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => {
          if (!prev.profile) return prev;
          
          const financialInfo = prev.profile.financialInfo || {};
          financialInfo.creditScores = creditScores;

          return {
            ...prev,
            profile: { ...prev.profile, financialInfo },
            loading: false
          };
        });

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Credit scores updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update credit scores', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update credit scores',
      });
    }
  }, [user?.uid, toast]);

  // Update asset information
  const updateAssetInfo = useCallback(async (
    assetType: 'personal' | 'company', 
    assetData: any, 
    companyId?: string
  ) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateAssetInfo',
          uid: user.uid,
          assetType,
          assetData,
          companyId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => {
          if (!prev.profile) return prev;
          
          const financialInfo = prev.profile.financialInfo || {};
          
          if (assetType === 'personal') {
            financialInfo.personalAssets = assetData;
          } else if (assetType === 'company' && companyId) {
            financialInfo.companyAssets = financialInfo.companyAssets || {};
            financialInfo.companyAssets[companyId] = assetData;
          }

          return {
            ...prev,
            profile: { ...prev.profile, financialInfo },
            loading: false
          };
        });

        toast({
          title: 'Success',
          description: 'Asset information updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update asset information', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update asset information',
      });
    }
  }, [user?.uid, toast]);

  // Update document status
  const updateDocumentStatus = useCallback(async (
    documentType: string, 
    status: boolean, 
    companyId?: string
  ) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateDocumentStatus',
          uid: user.uid,
          documentType,
          status,
          companyId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => {
          if (!prev.profile) return prev;
          
          const requiredDocuments = prev.profile.requiredDocuments || {};
          
          if (companyId) {
            requiredDocuments.business = requiredDocuments.business || {};
            requiredDocuments.business[companyId] = requiredDocuments.business[companyId] || {};
            (requiredDocuments.business[companyId] as any)[documentType] = status;
          } else {
            requiredDocuments.personal = requiredDocuments.personal || {};
            (requiredDocuments.personal as any)[documentType] = status;
          }

          return {
            ...prev,
            profile: { ...prev.profile, requiredDocuments },
            loading: false
          };
        });

        // Recalculate profile completion
        await calculateProfileCompletion();

        toast({
          title: 'Success',
          description: 'Document status updated successfully',
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error, 
          loading: false 
        }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update document status', 
        loading: false 
      }));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update document status',
      });
    }
  }, [user?.uid, toast]);

  // Calculate profile completion
  const calculateProfileCompletion = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculateProfileCompletion',
          uid: user.uid
        })
      });

      const result = await response.json();

      if (result.success) {
        setState(prev => ({
          ...prev,
          profileCompletion: result.data
        }));
      }
    } catch (error) {
      console.error('Failed to calculate profile completion:', error);
    }
  }, [user?.uid]);

  // Save personal financial statement
  const saveFinancialStatement = useCallback(async (financialData: Partial<PersonalFinancialStatement>) => {
    if (!user?.uid) return;

    try {
      console.log('Hook: Saving financial statement for user:', user.uid);
      console.log('Hook: Financial data:', financialData);
      
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsertFinancialStatement',
          userId: user.uid,
          financialData
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reload profile to get updated data
        await loadProfile();
        
        toast({
          title: 'Success',
          description: 'Financial statement saved successfully',
        });
        return result.data.statementId;
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save financial statement',
      });
    }
  }, [user?.uid, toast]);

  // Save business debt schedule
  const saveDebtSchedule = useCallback(async (
    companyId: string, 
    debtData: Partial<BusinessDebtSchedule>
  ) => {
    if (!user?.uid) return;

    try {
      console.log('Hook: Saving debt schedule for user:', user.uid);
      console.log('Hook: Company ID:', companyId);
      console.log('Hook: Debt data:', debtData);
      
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsertDebtSchedule',
          userId: user.uid,
          companyId,
          debtData
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Debt schedule saved successfully',
        });
        return result.data.scheduleId;
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save debt schedule',
      });
    }
  }, [user?.uid, toast]);

  // Load business debt schedule
  const loadDebtSchedule = useCallback(async (companyId: string) => {
    if (!user?.uid) return null;

    try {
      console.log('Hook: Loading debt schedule for user:', user.uid);
      console.log('Hook: Company ID:', companyId);
      
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getDebtSchedule',
          userId: user.uid,
          companyId
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        console.log('Hook: Loaded debt schedule:', result.data);
        return result.data;
      } else {
        console.log('Hook: No debt schedule found for company:', companyId);
        return null;
      }
    } catch (error) {
      console.error('Hook: Error loading debt schedule:', error);
      return null;
    }
  }, [user?.uid]);

  // Load profile on mount
  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user?.uid, loadProfile]);

  // Deal History functions
  const updateDealHistory = useCallback(async (dealHistory: any[]) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateDealHistory',
          uid: user.uid,
          dealHistory
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setState(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, dealHistory } : null,
          loading: false
        }));

        toast({
          title: 'Deal History Updated',
          description: 'Your deal history has been saved successfully.',
        });
      } else {
        throw new Error(result.error || 'Failed to update deal history');
      }
    } catch (error) {
      console.error('Error updating deal history:', error);
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update deal history' }));
      
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update deal history. Please try again.',
      });
    }
  }, [user?.uid, toast]);

  const addDeal = useCallback(async (deal: any) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addDeal',
          uid: user.uid,
          deal
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reload profile to get updated deal history
        await loadProfile();
        
        toast({
          title: 'Deal Added',
          description: 'Your deal has been added successfully.',
        });
      } else {
        throw new Error(result.error || 'Failed to add deal');
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to add deal' }));
      
      toast({
        variant: 'destructive',
        title: 'Add Failed',
        description: 'Failed to add deal. Please try again.',
      });
    }
  }, [user?.uid, toast, loadProfile]);

  const updateDeal = useCallback(async (dealId: string, updates: any) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateDeal',
          uid: user.uid,
          dealId,
          updates
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reload profile to get updated deal history
        await loadProfile();
        
        toast({
          title: 'Deal Updated',
          description: 'Your deal has been updated successfully.',
        });
      } else {
        throw new Error(result.error || 'Failed to update deal');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update deal' }));
      
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update deal. Please try again.',
      });
    }
  }, [user?.uid, toast, loadProfile]);

  const removeDeal = useCallback(async (dealId: string) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeDeal',
          uid: user.uid,
          dealId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reload profile to get updated deal history
        await loadProfile();
        
        toast({
          title: 'Deal Removed',
          description: 'Your deal has been removed successfully.',
        });
      } else {
        throw new Error(result.error || 'Failed to remove deal');
      }
    } catch (error) {
      console.error('Error removing deal:', error);
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to remove deal' }));
      
      toast({
        variant: 'destructive',
        title: 'Remove Failed',
        description: 'Failed to remove deal. Please try again.',
      });
    }
  }, [user?.uid, toast, loadProfile]);

  return {
    // State
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    profileCompletion: state.profileCompletion,
    
    // Actions
    loadProfile,
    updatePersonalInfo,
    updateContactInfo,
    updateCompanyInfo,
    removeCompany,
    updateCreditScores,
    updateAssetInfo,
    updateDocumentStatus,
    calculateProfileCompletion,
    saveFinancialStatement,
    saveDebtSchedule,
    loadDebtSchedule,
    updateDealHistory,
    addDeal,
    updateDeal,
    removeDeal,
    
    // Utility
    hasProfile: !!state.profile,
    isComplete: state.profileCompletion?.overall === 100
  };
}
