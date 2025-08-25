
'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { UIProvider } from '@/contexts/ui-context';
import { DocumentProvider } from '@/contexts/document-context';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Lazy load the AI assistant to improve initial page load performance
const AIAssistant = dynamic(() => import('./ai-assistant').then(mod => ({ default: mod.AIAssistant })), {
  ssr: false,
  loading: () => null,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <DocumentProvider>
          <AIAssistant />
          {children}
        </DocumentProvider>
      </UIProvider>
    </AuthProvider>
  );
}
