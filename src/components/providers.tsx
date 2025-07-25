
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DocumentProvider } from '@/contexts/document-context';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}
