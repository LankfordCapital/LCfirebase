import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase-client';

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
  uploadedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
}

export class BrokerDocumentService {
  private readonly collectionName = 'broker-documents';

  /**
   * Upload a document file to Firebase Storage
   */
  async uploadDocument(file: File, brokerId: string, documentType: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `${documentType}-${Date.now()}-${file.name}`;
      const storagePath = `broker-documents/${brokerId}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { success: true, url: downloadURL };
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
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...documentData,
        uploadedAt: serverTimestamp(),
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
      const q = query(
        collection(db, this.collectionName),
        where('brokerId', '==', brokerId),
        orderBy('uploadedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const documents: BrokerDocument[] = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as BrokerDocument);
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
      const docRef = doc(db, this.collectionName, documentId);
      const updateData: Partial<BrokerDocument> = { status };
      
      if (reviewedBy) {
        updateData.reviewedBy = reviewedBy;
        updateData.reviewedAt = serverTimestamp() as Timestamp;
      }
      
      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(docRef, updateData);
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
  async deleteDocument(documentId: string, fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, this.collectionName, documentId));

      // Delete from Storage
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

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
      const docRef = doc(db, this.collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
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

export const brokerDocumentService = new BrokerDocumentService();
