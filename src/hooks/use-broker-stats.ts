'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { authenticatedGet } from '@/lib/api-client';

export interface BrokerStats {
  activeBorrowers: number;
  loansInProgress: number;
  totalFundedVolume: number;
  loading: boolean;
  error: string | null;
}

export function useBrokerStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BrokerStats>({
    activeBorrowers: 0,
    loansInProgress: 0,
    totalFundedVolume: 0,
    loading: true,
    error: null,
  });

  const loadBrokerStats = useCallback(async () => {
    if (!user?.uid) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Get broker's loan applications
      const applicationsResponse = await authenticatedGet(`/api/enhanced-loan-applications?action=getByBroker&brokerId=${user.uid}`);
      const applicationsResult = await applicationsResponse.json();

      if (!applicationsResult.success) {
        throw new Error(applicationsResult.error || 'Failed to load applications');
      }

      const applications = applicationsResult.data || [];

      // Calculate statistics
      const activeBorrowers = new Set(
        applications
          .filter(app => app.status !== 'Cancelled' && app.status !== 'Completed')
          .map(app => app.borrowerInfo?.email || app.userId)
      ).size;

      const loansInProgress = applications.filter(app => 
        app.status !== 'Cancelled' && 
        app.status !== 'Completed' && 
        app.status !== 'Funded'
      ).length;

      const totalFundedVolume = applications
        .filter(app => app.status === 'Funded' || app.status === 'Approved')
        .reduce((sum, app) => sum + (app.loanAmount || 0), 0);

      setStats({
        activeBorrowers,
        loansInProgress,
        totalFundedVolume,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error loading broker stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load statistics',
      }));
    }
  }, [user?.uid]);

  useEffect(() => {
    loadBrokerStats();
  }, [loadBrokerStats]);

  return {
    ...stats,
    refresh: loadBrokerStats,
  };
}
