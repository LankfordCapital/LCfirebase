import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { authenticatedGet } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardLoanApplication {
  id: string;
  property: string;
  type: string;
  status: string;
  progress: number;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export interface DashboardDocument {
  id: string;
  name: string;
  status: string;
  userId: string;
  createdAt: any;
  type: string;
}

export interface DashboardActivity {
  id: string;
  type: 'document' | 'application' | 'system';
  message: string;
  timestamp: any;
  userId: string;
}

export interface DashboardWorkforceMember {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  isAvailable: boolean;
}

export interface DashboardData {
  loanApplications: DashboardLoanApplication[];
  documents: DashboardDocument[];
  recentActivity: DashboardActivity[];
  workforceMembers: DashboardWorkforceMember[];
  summary: {
    availablePrograms: number;
    activeLoans: number;
    documentsSubmitted: number;
    documentsPending: number;
  };
}

export function useDashboardData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData>({
    loanApplications: [],
    documents: [],
    recentActivity: [],
    workforceMembers: [],
    summary: {
      availablePrograms: 18, // This can stay hardcoded as it's a business constant
      activeLoans: 0,
      documentsSubmitted: 0,
      documentsPending: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLoanApplications = useCallback(async () => {
    if (!user?.uid) return [];

    try {
      const response = await authenticatedGet(`/api/enhanced-loan-applications?action=getByUser&userId=${user.uid}`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((app: any) => ({
          id: app.id,
          property: app.propertyAddress || 'Property Address Not Set',
          type: app.loanProgram || 'Unknown Program',
          status: app.status || 'Draft',
          progress: typeof app.progress === 'object' ? app.progress.overallProgress || 0 : app.progress || 0,
          userId: app.userId,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading loan applications:', error);
      return [];
    }
  }, [user?.uid]);

  const loadDocuments = useCallback(async () => {
    if (!user?.uid) return [];

    try {
      const response = await fetch(`/api/borrower-documents?borrowerId=${user.uid}`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.documents)) {
        return result.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.name || doc.fileName,
          status: doc.status || 'pending',
          userId: doc.borrowerId,
          createdAt: doc.uploadedAt,
          type: doc.type || 'other'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading documents:', error);
      return [];
    }
  }, [user?.uid]);

  const loadWorkforceMembers = useCallback(async () => {
    try {
      const response = await fetch('/api/workforce-members');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.workforceMembers)) {
        return result.workforceMembers.map((member: any) => ({
          id: member.uid,
          name: member.name,
          title: member.title,
          avatar: member.avatar,
          isAvailable: true // All workforce members are available for booking
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading workforce members:', error);
      return [];
    }
  }, []);

  const generateRecentActivity = useCallback((applications: DashboardLoanApplication[], documents: DashboardDocument[]) => {
    const activities: DashboardActivity[] = [];
    
    // Add activities from loan applications
    applications.forEach(app => {
      if (app.updatedAt) {
        activities.push({
          id: `app-${app.id}`,
          type: 'application',
          message: `Loan application ${app.id} status updated to ${app.status}`,
          timestamp: app.updatedAt,
          userId: app.userId
        });
      }
    });

    // Add activities from documents
    documents.forEach(doc => {
      if (doc.createdAt) {
        activities.push({
          id: `doc-${doc.id}`,
          type: 'document',
          message: `Document '${doc.name}' was ${doc.status}`,
          timestamp: doc.createdAt,
          userId: doc.userId
        });
      }
    });

    // Sort by timestamp and return most recent 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [loanApplications, documents, workforceMembers] = await Promise.all([
        loadLoanApplications(),
        loadDocuments(),
        loadWorkforceMembers()
      ]);

      const recentActivity = generateRecentActivity(loanApplications, documents);
      
      const activeLoans = loanApplications.filter(app => 
        app.status !== 'Completed' && app.status !== 'Cancelled' && app.status !== 'Draft'
      );
      
      const submittedDocuments = documents.filter(doc => 
        doc.status === 'submitted' || doc.status === 'approved'
      );
      
      const pendingDocuments = documents.filter(doc => 
        doc.status === 'pending' || doc.status === 'requested'
      );

      setData({
        loanApplications,
        documents,
        recentActivity,
        workforceMembers,
        summary: {
          availablePrograms: 18,
          activeLoans: activeLoans.length,
          documentsSubmitted: submittedDocuments.length,
          documentsPending: pendingDocuments.length,
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid, loadLoanApplications, loadDocuments, loadWorkforceMembers, generateRecentActivity, toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    data,
    loading,
    error,
    refreshData
  };
}
