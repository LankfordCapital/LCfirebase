
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DocumentProvider } from '@/contexts/document-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

const protectedRoutes = [
  '/dashboard',
  '/broker-office',
  '/workforce-office'
];

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (loading && isProtectedRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && isProtectedRoute) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentProvider>
        <SidebarProvider>
          <AuthGuard>{children}</AuthGuard>
        </SidebarProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}
