import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  userService, 
  loanApplicationService, 
  documentService, 
  appointmentService, 
  workforceMemberService,
  comparablePropertyService,
  marketAnalysisService,
  type FirestoreUser,
  type LoanApplication,
  type Document,
  type Appointment,
  type WorkforceMember,
  type ComparableProperty,
  type MarketAnalysis
} from '@/lib/firestore-services';

// Hook state interface
interface BackendState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Pagination interface
interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Generic hook for managing backend state
function useBackendState<T>() {
  const [state, setState] = useState<BackendState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset
  };
}

// Main backend hook
export function useBackend() {
  const { user, userProfile, isAdmin } = useAuth();

  // User management
  const userState = useBackendState<FirestoreUser[]>();
  const userPagination = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Loan applications
  const loanApplicationState = useBackendState<LoanApplication[]>();
  const loanApplicationPagination = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Documents
  const documentState = useBackendState<Document[]>();
  const documentPagination = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Appointments
  const appointmentState = useBackendState<Appointment[]>();
  const appointmentPagination = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Workforce members
  const workforceMemberState = useBackendState<WorkforceMember[]>();

  // Comparable properties
  const comparablePropertyState = useBackendState<ComparableProperty[]>();

  // Market analyses
  const marketAnalysisState = useBackendState<MarketAnalysis[]>();

  // User Management Functions
  const getAllUsers = useCallback(async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: FirestoreUser['role'];
      status?: FirestoreUser['status'];
      search?: string;
    }
  ) => {
    if (!isAdmin) {
      userState.setError('Unauthorized: Admin access required');
      return;
    }

    try {
      userState.setLoading(true);
      const users = await userService.getAll();
      
      // Apply filters
      let filteredUsers = users;
      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Update pagination state
      userPagination[1]({
        page,
        limit,
        total: filteredUsers.length,
        hasMore: endIndex < filteredUsers.length
      });
      
      userState.setData(paginatedUsers);
    } catch (error) {
      userState.setError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }, [isAdmin, userState, userPagination]);

  const getUserById = useCallback(async (uid: string) => {
    try {
      userState.setLoading(true);
      const user = await userService.getById(uid);
      if (user) {
        userState.setData([user]);
      } else {
        userState.setError('User not found');
      }
    } catch (error) {
      userState.setError(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }, [userState]);

  const updateUserRole = useCallback(async (uid: string, newRole: FirestoreUser['role']) => {
    if (!isAdmin) {
      userState.setError('Unauthorized: Admin access required');
      return;
    }

    try {
      userState.setLoading(true);
      await userService.updateUserRole(uid, newRole);
      
      // Refresh user data
      if (userState.data) {
        const updatedUsers = userState.data.map(user => 
          user.uid === uid ? { ...user, role: newRole } : user
        );
        userState.setData(updatedUsers);
      }
    } catch (error) {
      userState.setError(error instanceof Error ? error.message : 'Failed to update user role');
    }
  }, [isAdmin, userState]);

  const updateUserStatus = useCallback(async (uid: string, newStatus: FirestoreUser['status']) => {
    if (!isAdmin) {
      userState.setError('Unauthorized: Admin access required');
      return;
    }

    try {
      userState.setLoading(true);
      await userService.updateUserStatus(uid, newStatus);
      
      // Refresh user data
      if (userState.data) {
        const updatedUsers = userState.data.map(user => 
          user.uid === uid ? { ...user, status: newStatus } : user
        );
        userState.setData(updatedUsers);
      }
    } catch (error) {
      userState.setError(error instanceof Error ? error.message : 'Failed to update user status');
    }
  }, [isAdmin, userState]);

  // Loan Application Functions
  const getAllLoanApplications = useCallback(async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: LoanApplication['status'];
      program?: string;
      userId?: string;
      assignedTo?: string;
    }
  ) => {
    try {
      loanApplicationState.setLoading(true);
      const applications = await loanApplicationService.getAll();
      
      // Apply filters
      let filteredApplications = applications;
      if (filters?.status) {
        filteredApplications = filteredApplications.filter(app => app.status === filters.status);
      }
      if (filters?.program) {
        filteredApplications = filteredApplications.filter(app => app.program === filters.program);
      }
      if (filters?.userId) {
        filteredApplications = filteredApplications.filter(app => app.userId === filters.userId);
      }
      if (filters?.assignedTo) {
        filteredApplications = filteredApplications.filter(app => app.assignedTo === filters.assignedTo);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
      
      // Update pagination state
      loanApplicationPagination[1]({
        page,
        limit,
        total: filteredApplications.length,
        hasMore: endIndex < filteredApplications.length
      });
      
      loanApplicationState.setData(paginatedApplications);
    } catch (error) {
      loanApplicationState.setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    }
  }, [loanApplicationState, loanApplicationPagination]);

  const getLoanApplicationById = useCallback(async (id: string) => {
    try {
      loanApplicationState.setLoading(true);
      const application = await loanApplicationService.getById(id);
      if (application) {
        loanApplicationState.setData([application]);
      } else {
        loanApplicationState.setError('Application not found');
      }
    } catch (error) {
      loanApplicationState.setError(error instanceof Error ? error.message : 'Failed to fetch application');
    }
  }, [loanApplicationState]);

  const createLoanApplication = useCallback(async (applicationData: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      loanApplicationState.setLoading(true);
      const applicationId = await loanApplicationService.create(applicationData);
      
      // Refresh applications list
      await getAllLoanApplications();
      
      return applicationId;
    } catch (error) {
      loanApplicationState.setError(error instanceof Error ? error.message : 'Failed to create application');
      throw error;
    }
  }, [loanApplicationState, getAllLoanApplications]);

  const submitLoanApplication = useCallback(async (applicationId: string) => {
    try {
      loanApplicationState.setLoading(true);
      await loanApplicationService.submitApplication(applicationId);
      
      // Refresh applications list
      await getAllLoanApplications();
    } catch (error) {
      loanApplicationState.setError(error instanceof Error ? error.message : 'Failed to submit application');
      throw error;
    }
  }, [loanApplicationState, getAllLoanApplications]);

  const assignLoanApplication = useCallback(async (applicationId: string, workforceMemberId: string) => {
    try {
      loanApplicationState.setLoading(true);
      await loanApplicationService.assignToWorkforce(applicationId, workforceMemberId);
      
      // Refresh applications list
      await getAllLoanApplications();
    } catch (error) {
      loanApplicationState.setError(error instanceof Error ? error.message : 'Failed to assign application');
      throw error;
    }
  }, [loanApplicationState, getAllLoanApplications]);

  // Document Functions
  const getAllDocuments = useCallback(async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: Document['type'];
      status?: Document['status'];
      userId?: string;
      applicationId?: string;
    }
  ) => {
    try {
      documentState.setLoading(true);
      const documents = await documentService.getAll();
      
      // Apply filters
      let filteredDocuments = documents;
      if (filters?.type) {
        filteredDocuments = filteredDocuments.filter(doc => doc.type === filters.type);
      }
      if (filters?.status) {
        filteredDocuments = filteredDocuments.filter(doc => doc.status === filters.status);
      }
      if (filters?.userId) {
        filteredDocuments = filteredDocuments.filter(doc => doc.userId === filters.userId);
      }
      if (filters?.applicationId) {
        filteredDocuments = filteredDocuments.filter(doc => doc.applicationId === filters.applicationId);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
      
      // Update pagination state
      documentPagination[1]({
        page,
        limit,
        total: filteredDocuments.length,
        hasMore: endIndex < filteredDocuments.length
      });
      
      documentState.setData(paginatedDocuments);
    } catch (error) {
      documentState.setError(error instanceof Error ? error.message : 'Failed to fetch documents');
    }
  }, [documentState, documentPagination]);

  const updateDocumentStatus = useCallback(async (
    documentId: string, 
    status: Document['status'], 
    reviewedBy?: string
  ) => {
    try {
      documentState.setLoading(true);
      await documentService.updateDocumentStatus(documentId, status, reviewedBy);
      
      // Refresh documents list
      await getAllDocuments();
    } catch (error) {
      documentState.setError(error instanceof Error ? error.message : 'Failed to update document status');
      throw error;
    }
  }, [documentState, getAllDocuments]);

  // Appointment Functions
  const getAllAppointments = useCallback(async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: Appointment['status'];
      type?: Appointment['type'];
      userId?: string;
      workforceMemberId?: string;
      date?: Date;
    }
  ) => {
    try {
      appointmentState.setLoading(true);
      const appointments = await appointmentService.getAll();
      
      // Apply filters
      let filteredAppointments = appointments;
      if (filters?.status) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === filters.status);
      }
      if (filters?.type) {
        filteredAppointments = filteredAppointments.filter(apt => apt.type === filters.type);
      }
      if (filters?.userId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.userId === filters.userId);
      }
      if (filters?.workforceMemberId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.workforceMemberId === filters.workforceMemberId);
      }
      if (filters?.date) {
        filteredAppointments = filteredAppointments.filter(apt => {
          const aptDate = apt.date.toDate();
          return aptDate.toDateString() === filters.date!.toDateString();
        });
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
      
      // Update pagination state
      appointmentPagination[1]({
        page,
        limit,
        total: filteredAppointments.length,
        hasMore: endIndex < filteredAppointments.length
      });
      
      appointmentState.setData(paginatedAppointments);
    } catch (error) {
      appointmentState.setError(error instanceof Error ? error.message : 'Failed to fetch appointments');
    }
  }, [appointmentState, appointmentPagination]);

  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      appointmentState.setLoading(true);
      const appointmentId = await appointmentService.create(appointmentData);
      
      // Refresh appointments list
      await getAllAppointments();
      
      return appointmentId;
    } catch (error) {
      appointmentState.setError(error instanceof Error ? error.message : 'Failed to create appointment');
      throw error;
    }
  }, [appointmentState, getAllAppointments]);

  const getAvailableSlots = useCallback(async (workforceMemberId: string, date: Date) => {
    try {
      const availableSlots = await appointmentService.getAvailableSlots(workforceMemberId, date);
      return availableSlots;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get available slots');
    }
  }, []);

  // Workforce Member Functions
  const getActiveWorkforceMembers = useCallback(async () => {
    try {
      workforceMemberState.setLoading(true);
      const members = await workforceMemberService.getActiveMembers();
      workforceMemberState.setData(members);
    } catch (error) {
      workforceMemberState.setError(error instanceof Error ? error.message : 'Failed to fetch workforce members');
    }
  }, [workforceMemberState]);

  const getWorkforceMembersBySpecialty = useCallback(async (specialty: string) => {
    try {
      workforceMemberState.setLoading(true);
      const members = await workforceMemberService.getMembersBySpecialty(specialty);
      workforceMemberState.setData(members);
    } catch (error) {
      workforceMemberState.setError(error instanceof Error ? error.message : 'Failed to fetch workforce members by specialty');
    }
  }, [workforceMemberState]);

  // Comparable Property Functions
  const getComparablesByLocation = useCallback(async (city: string, state: string, zipCode?: string) => {
    try {
      comparablePropertyState.setLoading(true);
      const comparables = await comparablePropertyService.getComparablesByLocation(city, state, zipCode);
      comparablePropertyState.setData(comparables);
    } catch (error) {
      comparablePropertyState.setError(error instanceof Error ? error.message : 'Failed to fetch comparable properties');
    }
  }, [comparablePropertyState]);

  const getRecentSales = useCallback(async (days: number = 90) => {
    try {
      comparablePropertyState.setLoading(true);
      const sales = await comparablePropertyService.getRecentSales(days);
      comparablePropertyState.setData(sales);
    } catch (error) {
      comparablePropertyState.setError(error instanceof Error ? error.message : 'Failed to fetch recent sales');
    }
  }, [comparablePropertyState]);

  // Market Analysis Functions
  const getMarketAnalysisByLocation = useCallback(async (city: string, state: string) => {
    try {
      marketAnalysisState.setLoading(true);
      const analyses = await marketAnalysisService.getAnalysisByLocation(city, state);
      marketAnalysisState.setData(analyses);
    } catch (error) {
      marketAnalysisState.setError(error instanceof Error ? error.message : 'Failed to fetch market analysis');
    }
  }, [marketAnalysisState]);

  const getRecentMarketAnalyses = useCallback(async (days: number = 30) => {
    try {
      marketAnalysisState.setLoading(true);
      const analyses = await marketAnalysisService.getRecentAnalyses(days);
      marketAnalysisState.setData(analyses);
    } catch (error) {
      marketAnalysisState.setError(error instanceof Error ? error.message : 'Failed to fetch recent market analyses');
    }
  }, [marketAnalysisState]);

  // Utility functions
  const resetAllStates = useCallback(() => {
    userState.reset();
    loanApplicationState.reset();
    documentState.reset();
    appointmentState.reset();
    workforceMemberState.reset();
    comparablePropertyState.reset();
    marketAnalysisState.reset();
  }, [
    userState, loanApplicationState, documentState, appointmentState, 
    workforceMemberState, comparablePropertyState, marketAnalysisState
  ]);

  // Memoized values
  const isLoading = useMemo(() => 
    userState.loading || 
    loanApplicationState.loading || 
    documentState.loading || 
    appointmentState.loading || 
    workforceMemberState.loading || 
    comparablePropertyState.loading || 
    marketAnalysisState.loading,
    [
      userState.loading, loanApplicationState.loading, documentState.loading,
      appointmentState.loading, workforceMemberState.loading, 
      comparablePropertyState.loading, marketAnalysisState.loading
    ]
  );

  const hasError = useMemo(() => 
    userState.error || 
    loanApplicationState.error || 
    documentState.error || 
    appointmentState.error || 
    workforceMemberState.error || 
    comparablePropertyState.error || 
    marketAnalysisState.error,
    [
      userState.error, loanApplicationState.error, documentState.error,
      appointmentState.error, workforceMemberState.error, 
      comparablePropertyState.error, marketAnalysisState.error
    ]
  );

  return {
    // State
    userState,
    loanApplicationState,
    documentState,
    appointmentState,
    workforceMemberState,
    comparablePropertyState,
    marketAnalysisState,
    
    // Pagination
    userPagination: userPagination[0],
    loanApplicationPagination: loanApplicationPagination[0],
    documentPagination: documentPagination[0],
    appointmentPagination: appointmentPagination[0],
    
    // User functions
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    
    // Loan application functions
    getAllLoanApplications,
    getLoanApplicationById,
    createLoanApplication,
    submitLoanApplication,
    assignLoanApplication,
    
    // Document functions
    getAllDocuments,
    updateDocumentStatus,
    
    // Appointment functions
    getAllAppointments,
    createAppointment,
    getAvailableSlots,
    
    // Workforce member functions
    getActiveWorkforceMembers,
    getWorkforceMembersBySpecialty,
    
    // Comparable property functions
    getComparablesByLocation,
    getRecentSales,
    
    // Market analysis functions
    getMarketAnalysisByLocation,
    getRecentMarketAnalyses,
    
    // Utility functions
    resetAllStates,
    isLoading,
    hasError
  };
}
