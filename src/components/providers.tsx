
'use client';

import { DocumentProvider } from '@/contexts/document-context';
import { AuthProvider } from '@/contexts/auth-context';
import { UIProvider } from '@/contexts/ui-context';
import { AIAssistant } from './ai-assistant';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentProvider>
        <UIProvider>
          {children}
          <AIAssistant />
        </UIProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}
