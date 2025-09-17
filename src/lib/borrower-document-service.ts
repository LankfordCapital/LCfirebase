// Removed direct Firestore imports - using API endpoints instead
import { authenticatedGet, authenticatedPost, authenticatedDelete } from './api-client';

export interface BorrowerDocument {
  id?: string;
  borrowerId: string;
  type: 'id_license' | 'credit_report' | 'asset_statement' | 'financial_statement' | 'hud1_document' | 'other';
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export class BorrowerDocumentService {
  private readonly collectionName = 'borrower-documents';

  /**
   * Upload a document file to Firebase Storage via API
   */
  async uploadDocument(file: File, borrowerId: string, documentType: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('borrowerId', borrowerId);
      formData.append('documentType', documentType);
      formData.append('documentName', documentType);

      const response = await authenticatedPost('/api/borrower-documents/upload', formData);

      const data = await response.json();

      if (data.success) {
        return { success: true, url: data.url };
      } else {
        return { success: false, error: data.error || 'Upload failed' };
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Add a new borrower document to Firestore via API
   */
  async addDocument(documentData: Omit<BorrowerDocument, 'id' | 'uploadedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await authenticatedPost('/api/borrower-documents', {
        action: 'addDocument',
        documentData
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, id: data.documentId };
      } else {
        return { success: false, error: data.error || 'Failed to add document' };
      }
    } catch (error) {
      console.error('Error adding document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add document' 
      };
    }
  }

  /**
   * Get all documents for a specific borrower via API
   */
  async getBorrowerDocuments(borrowerId: string): Promise<{ success: boolean; documents?: BorrowerDocument[]; error?: string }> {
    try {
      const response = await authenticatedGet('/api/borrower-documents', { borrowerId });
      const data = await response.json();

      if (data.success) {
        return { success: true, documents: data.documents };
      } else {
        return { success: false, error: data.error || 'Failed to get documents' };
      }
    } catch (error) {
      console.error('Error getting borrower documents:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get documents' 
      };
    }
  }

  /**
   * Update document status via API
   */
  async updateDocumentStatus(
    documentId: string, 
    status: BorrowerDocument['status'], 
    reviewedBy?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await authenticatedPost('/api/borrower-documents', {
        action: 'updateDocumentStatus',
        documentId,
        status,
        reviewedBy,
        notes
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update document' };
      }
    } catch (error) {
      console.error('Error updating document status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update document' 
      };
    }
  }

  /**
   * Delete a document via API
   */
  async deleteDocument(documentId: string, fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await authenticatedPost('/api/borrower-documents', {
        action: 'deleteDocument',
        documentId,
        fileUrl
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to delete document' };
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete document' 
      };
    }
  }

  /**
   * Get document by ID via API
   */
  async getDocument(documentId: string): Promise<{ success: boolean; document?: BorrowerDocument; error?: string }> {
    try {
      const response = await authenticatedGet('/api/borrower-documents', { documentId });
      const data = await response.json();

      if (data.success && data.document) {
        return { success: true, document: data.document };
      } else {
        return { success: false, error: data.error || 'Document not found' };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get document' 
      };
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload PDF, DOC, DOCX, or image files.' };
    }

    return { valid: true };
  }
}

export const borrowerDocumentService = new BorrowerDocumentService();
