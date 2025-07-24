'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DocumentProvider } from '@/contexts/document-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DocumentProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </DocumentProvider>
  );
}
