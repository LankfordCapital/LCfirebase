import { 
  userService, 
  loanApplicationService, 
  documentService, 
  appointmentService, 
  workforceMemberService,
  comparablePropertyService,
  marketAnalysisService,
  BatchService,
  type FirestoreUser,
  type LoanApplication,
  type Document,
  type Appointment,
  type WorkforceMember,
  type ComparableProperty,
  type MarketAnalysis
} from './firestore-services';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// User API Services
export class UserApiService {
  // Get all users with pagination and filtering
  static async getAllUsers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: FirestoreUser['role'];
      status?: FirestoreUser['status'];
      search?: string;
    }
  ): Promise<PaginatedResponse<FirestoreUser>> {
    try {
      let allUsers = await userService.getAll();
      
      // Apply filters
      if (filters?.role) {
        allUsers = allUsers.filter(user => user.role === filters.role);
      }
      if (filters?.status) {
        allUsers = allUsers.filter(user => user.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        allUsers = allUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total: allUsers.length,
          hasMore: endIndex < allUsers.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  }

  // Get user by ID
  static async getUserById(uid: string): Promise<ApiResponse<FirestoreUser>> {
    try {
      const user = await userService.getById(uid);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }

  // Update user role
  static async updateUserRole(uid: string, newRole: FirestoreUser['role']): Promise<ApiResponse<void>> {
    try {
      await userService.updateUserRole(uid, newRole);
      return {
        success: true,
        message: 'User role updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user role'
      };
    }
  }

  // Update user status
  static async updateUserStatus(uid: string, newStatus: FirestoreUser['status']): Promise<ApiResponse<void>> {
    try {
      await userService.updateUserStatus(uid, newStatus);
      return {
        success: true,
        message: 'User status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user status'
      };
    }
  }

  // Get users by role
  static async getUsersByRole(role: FirestoreUser['role']): Promise<ApiResponse<FirestoreUser[]>> {
    try {
      const users = await userService.getUsersByRole(role);
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users by role'
      };
    }
  }
}

// Loan Application API Services
export class LoanApplicationApiService {
  // Get all applications with pagination and filtering
  static async getAllApplications(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: LoanApplication['status'];
      program?: string;
      userId?: string;
      assignedTo?: string;
    }
  ): Promise<PaginatedResponse<LoanApplication>> {
    try {
      let allApplications = await loanApplicationService.getAll();
      
      // Apply filters
      if (filters?.status) {
        allApplications = allApplications.filter(app => app.status === filters.status);
      }
      if (filters?.program) {
        allApplications = allApplications.filter(app => app.program === filters.program);
      }
      if (filters?.userId) {
        allApplications = allApplications.filter(app => app.userId === filters.userId);
      }
      if (filters?.assignedTo) {
        allApplications = allApplications.filter(app => app.assignedTo === filters.assignedTo);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedApplications = allApplications.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedApplications,
        pagination: {
          page,
          limit,
          total: allApplications.length,
          hasMore: endIndex < allApplications.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch applications'
      };
    }
  }

  // Get application by ID
  static async getApplicationById(id: string): Promise<ApiResponse<LoanApplication>> {
    try {
      const application = await loanApplicationService.getById(id);
      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }
      
      return {
        success: true,
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch application'
      };
    }
  }

  // Create new application
  static async createApplication(applicationData: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<string>> {
    try {
      const applicationId = await loanApplicationService.create(applicationData);
      return {
        success: true,
        data: applicationId,
        message: 'Application created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create application'
      };
    }
  }

  // Submit application
  static async submitApplication(applicationId: string): Promise<ApiResponse<void>> {
    try {
      await loanApplicationService.submitApplication(applicationId);
      return {
        success: true,
        message: 'Application submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit application'
      };
    }
  }

  // Assign application to workforce member
  static async assignApplication(applicationId: string, workforceMemberId: string): Promise<ApiResponse<void>> {
    try {
      await loanApplicationService.assignToWorkforce(applicationId, workforceMemberId);
      return {
        success: true,
        message: 'Application assigned successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign application'
      };
    }
  }
}

// Document API Services
export class DocumentApiService {
  // Get all documents with pagination and filtering
  static async getAllDocuments(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: Document['type'];
      status?: Document['status'];
      userId?: string;
      applicationId?: string;
    }
  ): Promise<PaginatedResponse<Document>> {
    try {
      let allDocuments = await documentService.getAll();
      
      // Apply filters
      if (filters?.type) {
        allDocuments = allDocuments.filter(doc => doc.type === filters.type);
      }
      if (filters?.status) {
        allDocuments = allDocuments.filter(doc => doc.status === filters.status);
      }
      if (filters?.userId) {
        allDocuments = allDocuments.filter(doc => doc.userId === filters.userId);
      }
      if (filters?.applicationId) {
        allDocuments = allDocuments.filter(doc => doc.applicationId === filters.applicationId);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocuments = allDocuments.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedDocuments,
        pagination: {
          page,
          limit,
          total: allDocuments.length,
          hasMore: endIndex < allDocuments.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch documents'
      };
    }
  }

  // Update document status
  static async updateDocumentStatus(
    documentId: string, 
    status: Document['status'], 
    reviewedBy?: string
  ): Promise<ApiResponse<void>> {
    try {
      await documentService.updateDocumentStatus(documentId, status, reviewedBy);
      return {
        success: true,
        message: 'Document status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document status'
      };
    }
  }
}

// Appointment API Services
export class AppointmentApiService {
  // Get all appointments with pagination and filtering
  static async getAllAppointments(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: Appointment['status'];
      type?: Appointment['type'];
      userId?: string;
      workforceMemberId?: string;
      date?: Date;
    }
  ): Promise<PaginatedResponse<Appointment>> {
    try {
      let allAppointments = await appointmentService.getAll();
      
      // Apply filters
      if (filters?.status) {
        allAppointments = allAppointments.filter(apt => apt.status === filters.status);
      }
      if (filters?.type) {
        allAppointments = allAppointments.filter(apt => apt.type === filters.type);
      }
      if (filters?.userId) {
        allAppointments = allAppointments.filter(apt => apt.userId === filters.userId);
      }
      if (filters?.workforceMemberId) {
        allAppointments = allAppointments.filter(apt => apt.workforceMemberId === filters.workforceMemberId);
      }
      if (filters?.date) {
        allAppointments = allAppointments.filter(apt => {
          const aptDate = apt.date.toDate();
          return aptDate.toDateString() === filters.date!.toDateString();
        });
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAppointments = allAppointments.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedAppointments,
        pagination: {
          page,
          limit,
          total: allAppointments.length,
          hasMore: endIndex < allAppointments.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments'
      };
    }
  }

  // Get available time slots for a workforce member on a specific date
  static async getAvailableSlots(workforceMemberId: string, date: Date): Promise<ApiResponse<Date[]>> {
    try {
      const availableSlots = await appointmentService.getAvailableSlots(workforceMemberId, date);
      return {
        success: true,
        data: availableSlots
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get available slots'
      };
    }
  }

  // Create new appointment
  static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<string>> {
    try {
      const appointmentId = await appointmentService.create(appointmentData);
      return {
        success: true,
        data: appointmentId,
        message: 'Appointment created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment'
      };
    }
  }
}

// Workforce Member API Services
export class WorkforceMemberApiService {
  // Get all active workforce members
  static async getActiveMembers(): Promise<ApiResponse<WorkforceMember[]>> {
    try {
      const members = await workforceMemberService.getActiveMembers();
      return {
        success: true,
        data: members
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch active members'
      };
    }
  }

  // Get members by specialty
  static async getMembersBySpecialty(specialty: string): Promise<ApiResponse<WorkforceMember[]>> {
    try {
      const members = await workforceMemberService.getMembersBySpecialty(specialty);
      return {
        success: true,
        data: members
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch members by specialty'
      };
    }
  }
}

// Comparable Property API Services
export class ComparablePropertyApiService {
  // Get comparable properties by location
  static async getComparablesByLocation(
    city: string, 
    state: string, 
    zipCode?: string
  ): Promise<ApiResponse<ComparableProperty[]>> {
    try {
      const comparables = await comparablePropertyService.getComparablesByLocation(city, state, zipCode);
      return {
        success: true,
        data: comparables
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comparable properties'
      };
    }
  }

  // Get recent sales
  static async getRecentSales(days: number = 90): Promise<ApiResponse<ComparableProperty[]>> {
    try {
      const sales = await comparablePropertyService.getRecentSales(days);
      return {
        success: true,
        data: sales
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent sales'
      };
    }
  }
}

// Market Analysis API Services
export class MarketAnalysisApiService {
  // Get market analysis by location
  static async getAnalysisByLocation(city: string, state: string): Promise<ApiResponse<MarketAnalysis[]>> {
    try {
      const analyses = await marketAnalysisService.getAnalysisByLocation(city, state);
      return {
        success: true,
        data: analyses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market analysis'
      };
    }
  }

  // Get recent market analyses
  static async getRecentAnalyses(days: number = 30): Promise<ApiResponse<MarketAnalysis[]>> {
    try {
      const analyses = await marketAnalysisService.getRecentAnalyses(days);
      return {
        success: true,
        data: analyses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent analyses'
      };
    }
  }
}


