'use client';

import { DocumentProvider } from '@/contexts/document-context';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentProvider>
        {children}
      </DocumentProvider>
    </AuthProvider>
  );
}
