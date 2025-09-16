import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { authenticatedGet } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface WorkforceLoanApplication {
  id: string;
  borrower: {
    name: string;
    email: string;
    phone: string;
  };
  broker: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
  };
  property: string;
  type: string;
  status: string;
  progress: number;
  missingDocuments: string[];
  loanAmount: number;
  ltv: number;
  arv: number;
  interestRate: number;
  term: number;
  createdAt: any;
  updatedAt: any;
}

export interface WorkforceBroker {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  activeLoans: number;
  totalVolume: number;
  status: string;
  createdAt: any;
  updatedAt: any;
}

export interface WorkforceSummary {
  activeClients: number;
  loansInUnderwriting: number;
  totalFundedYTD: number;
}

export interface WorkforceData {
  summary: WorkforceSummary;
  loanApplications: WorkforceLoanApplication[];
  brokers: WorkforceBroker[];
}

export function useWorkforceData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<WorkforceData>({
    summary: {
      activeClients: 0,
      loansInUnderwriting: 0,
      totalFundedYTD: 0,
    },
    loanApplications: [],
    brokers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLoanApplications = useCallback(async () => {
    try {
      const response = await authenticatedGet('/api/enhanced-loan-applications?action=getAll');

      const result = await response.json();
      
      if (result.success && Array.isArray(result.applications)) {
        return result.applications.map((app: any) => ({
          id: app.id,
          borrower: {
            name: app.borrowerInfo?.name || 'Unknown Borrower',
            email: app.borrowerInfo?.email || 'No email provided',
            phone: app.borrowerInfo?.phone || 'No phone provided',
          },
          broker: {
            name: app.brokerInfo?.name || 'Direct',
            company: app.brokerInfo?.company,
            email: app.brokerInfo?.email,
            phone: app.brokerInfo?.phone,
          },
          property: app.propertyAddress || 'Property address not set',
          type: app.loanProgram || 'Unknown Program',
          status: app.status || 'Draft',
          progress: typeof app.progress === 'object' && app.progress?.overallProgress ? app.progress.overallProgress : (typeof app.progress === 'number' ? app.progress : 0),
          missingDocuments: app.missingDocuments || [],
          loanAmount: app.loanAmount || 0,
          ltv: app.ltv || 0,
          arv: app.arv || 0,
          interestRate: app.interestRate || 0,
          term: app.term || 0,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading loan applications:', error);
      return [];
    }
  }, []);

  const loadBrokers = useCallback(async () => {
    try {
      const response = await fetch('/api/brokers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      
      if (result.success && Array.isArray(result.brokers)) {
        return result.brokers.map((broker: any) => ({
          id: broker.id,
          name: broker.name || 'Unknown Broker',
          company: broker.company || 'No company',
          email: broker.email || 'No email',
          phone: broker.phone || 'No phone',
          activeLoans: broker.activeLoans || 0,
          totalVolume: broker.totalVolume || 0,
          status: broker.status || 'Active',
          createdAt: broker.createdAt,
          updatedAt: broker.updatedAt,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading brokers:', error);
      return [];
    }
  }, []);

  const calculateSummary = useCallback((loanApplications: WorkforceLoanApplication[]) => {
    const activeClients = new Set(loanApplications.map(app => app.borrower.email)).size;
    const loansInUnderwriting = loanApplications.filter(app => 
      app.status === 'Underwriting' || app.status === 'Review' || app.status === 'Pending'
    ).length;
    const totalFundedYTD = loanApplications
      .filter(app => app.status === 'Funded' || app.status === 'Approved')
      .reduce((sum, app) => sum + (app.loanAmount || 0), 0);

    return {
      activeClients,
      loansInUnderwriting,
      totalFundedYTD,
    };
  }, []);

  const loadWorkforceData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [loanApplications, brokers] = await Promise.all([
        loadLoanApplications(),
        loadBrokers()
      ]);

      const summary = calculateSummary(loanApplications);

      setData({
        summary,
        loanApplications,
        brokers,
      });
    } catch (error) {
      console.error('Error loading workforce data:', error);
      setError('Failed to load workforce data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load workforce data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid, loadLoanApplications, loadBrokers, calculateSummary, toast]);

  useEffect(() => {
    loadWorkforceData();
  }, [loadWorkforceData]);

  const refreshData = useCallback(() => {
    loadWorkforceData();
  }, [loadWorkforceData]);

  return {
    data,
    loading,
    error,
    refreshData
  };
}
