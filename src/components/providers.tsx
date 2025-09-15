
'use client';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { UIProvider } from '@/contexts/ui-context';
import { DocumentProvider } from '@/contexts/document-context';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { CustomLoader } from './ui/custom-loader';
import HeaderWrapper from './layout/header-wrapper';
import Footer from './layout/footer';
import ErrorBoundary from './error-boundary';
import { AIAssistantFallback } from './ai-assistant-fallback';
import { ChunkErrorHandler } from './chunk-error-handler';

// Lazy load the AI assistant to improve initial page load performance
const AIAssistant = dynamic(() => import('./ai-assistant').then(mod => ({ default: mod.AIAssistant })), {
  ssr: false,
  loading: () => null,
  timeout: 10000, // Add timeout to prevent chunk loading errors
  onError: (error) => {
    console.error('Failed to load AI Assistant:', error);
  },
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { loading, user, userProfile } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/broker-office') || pathname.startsWith('/workforce-office');

  // While loading or on a dashboard page without a confirmed user profile, show a full-screen loader.
  // This is the key fix to prevent rendering the wrong layout before the user's role is known.
  if (loading || (isDashboard && user && !userProfile)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <CustomLoader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <ChunkErrorHandler />
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
      <ErrorBoundary fallback={AIAssistantFallback}>
        <AIAssistant />
      </ErrorBoundary>
    </>
  );
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <DocumentProvider>
           <AppContent>{children}</AppContent>
        </DocumentProvider>
      </UIProvider>
    </AuthProvider>
  );
}
