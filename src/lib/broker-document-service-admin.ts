import { adminDb, adminStorage } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface BrokerDocument {
  id?: string;
  brokerId: string;
  type: 'w9' | 'wiring_instructions' | 'id_license' | 'broker_agreement' | 'other';
  name: string;
  fileName: string;
  fileUrl: string;
  filePath: string; // Store the storage path for easier deletion
  fileSize: number;
  mimeType: string;
  uploadedAt: any;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: any;
}

export class BrokerDocumentAdminService {
  private readonly collectionName = 'broker-documents';

  /**
   * Upload a document file to Firebase Storage
   */
  async uploadDocument(file: File, brokerId: string, documentType: string): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
    try {
      const fileName = `${documentType}-${Date.now()}-${file.name}`;
      const storagePath = `broker-documents/${brokerId}/${fileName}`;
      const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
      const fileRef = bucket.file(storagePath);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

    // Generate download URL using signed URL
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
    });
    
    console.log('Signed URL generated successfully');

      return { success: true, url: downloadURL, path: storagePath };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Add a new broker document to Firestore
   */
  async addDocument(documentData: Omit<BrokerDocument, 'id' | 'uploadedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const docRef = await adminDb.collection(this.collectionName).add({
        ...documentData,
        uploadedAt: FieldValue.serverTimestamp(),
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add document' 
      };
    }
  }

  /**
   * Get all documents for a specific broker
   */
  async getBrokerDocuments(brokerId: string): Promise<{ success: boolean; documents?: BrokerDocument[]; error?: string }> {
    try {
      const querySnapshot = await adminDb
        .collection(this.collectionName)
        .where('brokerId', '==', brokerId)
        .get();

      const documents: BrokerDocument[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as BrokerDocument);
      });

      // Sort by uploadedAt in descending order
      documents.sort((a, b) => {
        if (a.uploadedAt && b.uploadedAt) {
          return b.uploadedAt.toMillis() - a.uploadedAt.toMillis();
        }
        return 0;
      });

      return { success: true, documents };
    } catch (error) {
      console.error('Error getting broker documents:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get documents' 
      };
    }
  }

  /**
   * Update document status
   */
  async updateDocumentStatus(
    documentId: string, 
    status: BrokerDocument['status'], 
    reviewedBy?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = adminDb.collection(this.collectionName).doc(documentId);
      const updateData: any = { status };
      
      if (reviewedBy) {
        updateData.reviewedBy = reviewedBy;
        updateData.reviewedAt = FieldValue.serverTimestamp();
      }
      
      if (notes) {
        updateData.notes = notes;
      }

      await docRef.update(updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating document status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update document' 
      };
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string, filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from Firestore
      await adminDb.collection(this.collectionName).doc(documentId).delete();

      // Delete from Storage
      const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
      const fileRef = bucket.file(filePath);
      await fileRef.delete();

      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete document' 
      };
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<{ success: boolean; document?: BrokerDocument; error?: string }> {
    try {
      const docRef = adminDb.collection(this.collectionName).doc(documentId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        return { 
          success: true, 
          document: { id: docSnap.id, ...docSnap.data() } as BrokerDocument 
        };
      } else {
        return { success: false, error: 'Document not found' };
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

export const brokerDocumentAdminService = new BrokerDocumentAdminService();
