
'use client';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { UIProvider } from '@/contexts/ui-context';
import { DocumentProvider } from '@/contexts/document-context';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { CustomLoader } from './ui/custom-loader';
import HeaderWrapper from './layout/header-wrapper';
import Footer from './layout/footer';

// Lazy load the AI assistant to improve initial page load performance
const AIAssistant = dynamic(() => import('./ai-assistant').then(mod => ({ default: mod.AIAssistant })), {
  ssr: false,
  loading: () => null,
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { loading, user, userProfile } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/broker-office') || pathname.startsWith('/workforce-office');

  // While loading auth state for dashboard pages, don't render any header to prevent flicker
  if (loading && !isAuthPage && isDashboard) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <CustomLoader className="h-12 w-12" />
      </div>
    );
  }

  // If we're on a dashboard page but don't have the profile yet, keep showing the loader.
  // This is the key change to prevent rendering the page before the role is known.
  if (isDashboard && user && !userProfile) {
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <CustomLoader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIAssistant />
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
