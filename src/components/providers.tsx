
'use client';

import { DocumentProvider } from '@/contexts/document-context';
import { AuthProvider } from '@/contexts/auth-context';
import { UIProvider } from '@/contexts/ui-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}
