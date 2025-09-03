import { 
  userAdminService, 
  loanApplicationAdminService, 
  type FirestoreUser,
  type LoanApplication
} from './firestore-admin-services';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// User API Service
export class UserApiService {
  static async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: FirestoreUser['role'],
    status?: FirestoreUser['status']
  ): Promise<PaginatedResponse<FirestoreUser>> {
    try {
      let allUsers = await userAdminService.getAll();
      
      // Apply filters
      if (role) {
        allUsers = allUsers.filter(user => user.role === role);
      }
      if (status) {
        allUsers = allUsers.filter(user => user.status === status);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        allUsers = allUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const total = allUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      
      return {
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          hasMore: endIndex < total
        }
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Failed to get users');
    }
  }

  static async getUserById(uid: string): Promise<ApiResponse<FirestoreUser>> {
    try {
      const user = await userAdminService.getById(uid);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: 'Failed to get user' };
    }
  }

  static async createUser(userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<string>> {
    try {
      const userId = await userAdminService.create(userData as Omit<FirestoreUser, 'id'>);
      return { success: true, data: userId, message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  static async updateUser(uid: string, userData: Partial<FirestoreUser>): Promise<ApiResponse<void>> {
    try {
      await userAdminService.update(uid, userData);
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  static async deleteUser(uid: string): Promise<ApiResponse<void>> {
    try {
      await userAdminService.delete(uid);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  static async getUsersByRole(role: FirestoreUser['role']): Promise<ApiResponse<FirestoreUser[]>> {
    try {
      const users = await userAdminService.getUsersByRole(role);
      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting users by role:', error);
      return { success: false, error: 'Failed to get users by role' };
    }
  }

  static async getUsersByStatus(status: FirestoreUser['status']): Promise<ApiResponse<FirestoreUser[]>> {
    try {
      const users = await userAdminService.getUsersByStatus(status);
      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting users by status:', error);
      return { success: false, error: 'Failed to get users by status' };
    }
  }

  static async updateUserStatus(uid: string, status: FirestoreUser['status']): Promise<ApiResponse<void>> {
    try {
      await userAdminService.updateUserStatus(uid, status);
      return { success: true, message: 'User status updated successfully' };
    } catch (error) {
      console.error('Error updating user status:', error);
      return { success: false, error: 'Failed to update user status' };
    }
  }

  static async updateUserRole(uid: string, role: FirestoreUser['role']): Promise<ApiResponse<void>> {
    try {
      await userAdminService.updateUserRole(uid, role);
      return { success: true, message: 'User role updated successfully' };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  }
}

// Loan Application API Service
export class LoanApplicationApiService {
  static async getAllApplications(
    page: number = 1,
    limit: number = 20,
    status?: LoanApplication['status'],
    program?: string,
    brokerId?: string,
    userId?: string
  ): Promise<PaginatedResponse<LoanApplication>> {
    try {
      let allApplications = await loanApplicationAdminService.getAll();
      
      // Apply filters
      if (status) {
        allApplications = allApplications.filter(app => app.status === status);
      }
      if (program) {
        allApplications = allApplications.filter(app => app.program === program);
      }
      if (brokerId) {
        allApplications = allApplications.filter(app => app.brokerId === brokerId);
      }
      if (userId) {
        allApplications = allApplications.filter(app => app.userId === userId);
      }
      
      // Apply pagination
      const total = allApplications.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedApplications = allApplications.slice(startIndex, endIndex);
      
      return {
        data: paginatedApplications,
        pagination: {
          page,
          limit,
          total,
          hasMore: endIndex < total
        }
      };
    } catch (error) {
      console.error('Error getting applications:', error);
      throw new Error('Failed to get applications');
    }
  }

  static async getApplicationById(id: string): Promise<ApiResponse<LoanApplication>> {
    try {
      const application = await loanApplicationAdminService.getById(id);
      if (!application) {
        return { success: false, error: 'Application not found' };
      }
      return { success: true, data: application };
    } catch (error) {
      console.error('Error getting application:', error);
      return { success: false, error: 'Failed to get application' };
    }
  }

  static async createApplication(applicationData: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<string>> {
    try {
      const applicationId = await loanApplicationAdminService.create(applicationData as Omit<LoanApplication, 'id'>);
      return { success: true, data: applicationId, message: 'Application created successfully' };
    } catch (error) {
      console.error('Error creating application:', error);
      return { success: false, error: 'Failed to create application' };
    }
  }

  static async submitApplication(applicationId: string): Promise<ApiResponse<void>> {
    try {
      await loanApplicationAdminService.submitApplication(applicationId);
      return { success: true, message: 'Application submitted successfully' };
    } catch (error) {
      console.error('Error submitting application:', error);
      return { success: false, error: 'Failed to submit application' };
    }
  }

  static async assignApplication(applicationId: string, workforceMemberId: string): Promise<ApiResponse<void>> {
    try {
      await loanApplicationAdminService.assignToWorkforce(applicationId, workforceMemberId);
      return { success: true, message: 'Application assigned successfully' };
    } catch (error) {
      console.error('Error assigning application:', error);
      return { success: false, error: 'Failed to assign application' };
    }
  }

  // New broker-specific methods
  static async getApplicationsByBroker(brokerId: string): Promise<ApiResponse<LoanApplication[]>> {
    try {
      const applications = await loanApplicationAdminService.getApplicationsByBroker(brokerId);
      return { success: true, data: applications };
    } catch (error) {
      console.error('Error getting broker applications:', error);
      return { success: false, error: 'Failed to get broker applications' };
    }
  }

  static async createInitialApplication(
    brokerId: string,
    loanType: LoanApplication['loanType'],
    borrowerInfo: LoanApplication['borrowerInfo'],
    program: string
  ): Promise<ApiResponse<string>> {
    try {
      const applicationId = await loanApplicationAdminService.createInitialApplication(
        brokerId,
        loanType,
        borrowerInfo,
        program
      );
      return { 
        success: true, 
        data: applicationId, 
        message: 'Initial application created successfully. Borrower account will be linked when created.' 
      };
    } catch (error) {
      console.error('Error creating initial application:', error);
      return { success: false, error: 'Failed to create initial application' };
    }
  }

  static async linkToBorrower(applicationId: string, borrowerUserId: string): Promise<ApiResponse<void>> {
    try {
      await loanApplicationAdminService.linkToBorrower(applicationId, borrowerUserId);
      return { success: true, message: 'Application linked to borrower successfully' };
    } catch (error) {
      console.error('Error linking application to borrower:', error);
      return { success: false, error: 'Failed to link application to borrower' };
    }
  }

  static async calculateProgress(applicationId: string): Promise<ApiResponse<number>> {
    try {
      const progress = await loanApplicationAdminService.calculateProgress(applicationId);
      return { success: true, data: progress, message: 'Progress calculated successfully' };
    } catch (error) {
      console.error('Error calculating progress:', error);
      return { success: false, error: 'Failed to calculate progress' };
    }
  }

  static async uploadDocument(
    applicationId: string,
    documentType: keyof LoanApplication['documents'],
    documentData: {
      name: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      uploadedBy: string;
      category?: string;
    }
  ): Promise<ApiResponse<void>> {
    try {
      await loanApplicationAdminService.uploadDocument(
        applicationId,
        documentType,
        documentData
      );
      return { success: true, message: 'Document uploaded successfully' };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { success: false, error: 'Failed to upload document' };
    }
  }
}

// Appointment API Service
export class AppointmentApiService {
  static async getAllAppointments(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      type?: string;
      userId?: string;
      workforceMemberId?: string;
      date?: Date;
    }
  ): Promise<ApiResponse<any>> {
    try {
      // TODO: Implement appointment service logic
      // This is a placeholder implementation
      return {
        success: true,
        data: {
          appointments: [],
          pagination: {
            page,
            limit,
            total: 0,
            hasMore: false
          }
        }
      };
    } catch (error) {
      console.error('Error getting appointments:', error);
      return { success: false, error: 'Failed to get appointments' };
    }
  }

  static async createAppointment(appointmentData: any): Promise<ApiResponse<string>> {
    try {
      // TODO: Implement appointment creation logic
      return { success: true, data: 'appointment-id', message: 'Appointment created successfully' };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { success: false, error: 'Failed to create appointment' };
    }
  }

  static async getAvailableSlots(workforceMemberId: string, date: Date): Promise<ApiResponse<any>> {
    try {
      // TODO: Implement available slots logic
      return {
        success: true,
        data: {
          slots: []
        }
      };
    } catch (error) {
      console.error('Error getting available slots:', error);
      return { success: false, error: 'Failed to get available slots' };
    }
  }
}


