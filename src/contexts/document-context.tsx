'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { scanFile, FileScanResult } from '@/app/actions/scan-file';
import { useToast } from '@/hooks/use-toast';

export type UploadStatus = 'pending' | 'uploaded' | 'verified' | 'missing';

export type Document = {
  name: string;
  file: File;
  dataUri: string;
  status: UploadStatus;
};

type DocumentStore = {
  [key: string]: Document;
};

interface DocumentContextType {
  documents: DocumentStore;
  addDocument: (doc: Omit<Document, 'dataUri'> & { dataUri?: string }) => Promise<boolean>;
  updateDocumentStatus: (docName: string, status: UploadStatus) => void;
  getDocument: (docName: string) => Document | undefined;
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
  const { toast } = useToast();

  const addDocument = useCallback(async (doc: Omit<Document, 'dataUri'> & { dataUri?: string }): Promise<boolean> => {
    
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


    // Step 2: If clean, proceed with adding the document
    let dataUri = doc.dataUri;
    if (!dataUri) {
      dataUri = await fileToDataUri(doc.file);
    }
    
    setDocuments(prev => ({
      ...prev,
      [doc.name]: { ...doc, dataUri: dataUri! },
    }));

    toast({
        title: 'File Scanned & Uploaded',
        description: `"${doc.file.name}" is clean and has been uploaded.`,
    });

    return true;

  }, [toast]);

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
