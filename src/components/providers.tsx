
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

function ConditionalAIAssistant() {
  const [shouldLoadAI, setShouldLoadAI] = useState(false);

  useEffect(() => {
    // Load AI assistant immediately since video was the performance bottleneck
    setShouldLoadAI(true);
  }, []);

  if (!shouldLoadAI) {
    return null;
  }

  return <AIAssistant />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <DocumentProvider>
          <ConditionalAIAssistant />
          {children}
        </DocumentProvider>
      </UIProvider>
    </AuthProvider>
  );
}
