
'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { WorkforceOfficeHeader } from '@/components/workforce-office-header';

export default function WorkforceOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['workforce']} redirectTo="/auth/workforce-signin">
        <div className="flex flex-col min-h-screen">
          <WorkforceOfficeHeader />
          <main className="flex-1 bg-primary/5 p-4 md:p-8">
            {children}
          </main>
        </div>
    </ProtectedRoute>
  );
}
