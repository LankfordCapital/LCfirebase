'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  addDocument: (doc: Omit<Document, 'dataUri'> & { dataUri?: string }) => Promise<void>;
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

  const addDocument = useCallback(async (doc: Omit<Document, 'dataUri'> & { dataUri?: string }) => {
    let dataUri = doc.dataUri;
    if (!dataUri) {
      dataUri = await fileToDataUri(doc.file);
    }
    
    setDocuments(prev => ({
      ...prev,
      [doc.name]: { ...doc, dataUri: dataUri! },
    }));
  }, []);

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
