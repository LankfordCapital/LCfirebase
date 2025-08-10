
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { scanFile } from '@/app/actions/scan-file';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './auth-context';
import { app } from '@/lib/firebase-client';

export type UploadStatus = 'pending' | 'uploaded' | 'verified' | 'missing';

export type Document = {
  name: string;
  file: File;
  dataUri: string; // Keep for local use like AI scanning before upload
  storagePath: string;
  downloadURL: string;
  status: UploadStatus;
};

type DocumentStore = {
  [key: string]: Omit<Document, 'file' | 'dataUri'> & { file?: File, dataUri?: string };
};

interface DocumentContextType {
  documents: DocumentStore;
  addDocument: (doc: Pick<Document, 'name' | 'file'>) => Promise<boolean>;
  updateDocumentStatus: (docName: string, status: UploadStatus) => void;
  getDocument: (docName: string) => DocumentStore[string] | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<DocumentStore>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const addDocument = useCallback(async (doc: Pick<Document, 'name' | 'file'>): Promise<boolean> => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to upload documents.',
        });
        return false;
    }

    // Step 1: Scan the file for malware
    const formData = new FormData();
    formData.append('upload', doc.file);

    try {
        const scanResult = await scanFile(formData);
        if(scanResult.verdict !== 'clean') {
            toast({
                variant: 'destructive',
                title: 'Malware Detected',
                description: `The file "${doc.file.name}" could not be uploaded. Reason: ${scanResult.summary}`,
            });
            return false;
        }
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'File Scan Failed',
            description: `Could not scan "${doc.file.name}". Please try again.`,
        });
        return false;
    }
    
    // Step 2: If clean, upload to Firebase Storage
    const firebaseStorage = getStorage(app);
    const storagePath = `documents/${user.uid}/${doc.name}`;
    const storageRef = ref(firebaseStorage, storagePath);

    try {
        await uploadBytes(storageRef, doc.file);
        const downloadURL = await getDownloadURL(storageRef);
        const dataUri = await fileToDataUri(doc.file);

        setDocuments(prev => ({
          ...prev,
          [doc.name]: {
            name: doc.name,
            status: 'uploaded',
            storagePath,
            downloadURL,
            file: doc.file, // Keep file object for potential local use
            dataUri, // Keep dataUri for local AI scanning
          },
        }));

        toast({
            title: 'File Scanned & Uploaded',
            description: `"${doc.file.name}" is clean and has been securely uploaded.`,
        });

        return true;

    } catch (error) {
        console.error("Firebase Storage upload error:", error);
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: `Could not upload "${doc.file.name}" to storage.`,
        });
        return false;
    }
  }, [toast, user]);

  const updateDocumentStatus = useCallback((docName: string, status: UploadStatus) => {
    setDocuments(prev => {
      if (prev[docName]) {
        return {
          ...prev,
          [docName]: { ...prev[docName], status },
        };
      }
      return prev;
    });
  }, []);

  const getDocument = useCallback((docName: string) => {
    return documents[docName];
  }, [documents]);

  return (
    <DocumentContext.Provider value={{ documents, addDocument, updateDocumentStatus, getDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};
