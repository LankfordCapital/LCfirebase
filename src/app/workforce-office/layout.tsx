
'use client';

import { WorkforceOfficeHeader } from '@/components/workforce-office-header';
import { ProtectedRoute } from '@/components/protected-route';

export default function WorkforceOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/auth/workforce-signin">
        <div className="flex flex-col min-h-screen">
          <WorkforceOfficeHeader />
          <main className="flex-1 bg-primary/5">
            <div className="p-4 md:p-6 lg:p-8 w-full">
              {children}
            </div>
          </main>
        </div>
    </ProtectedRoute>
  );
}
