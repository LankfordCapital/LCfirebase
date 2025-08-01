
'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ProtectedRoute allowedRoles={['borrower']}>
      <div className="flex flex-col min-h-screen">
          <BorrowerDashboardHeader />
          <main className="flex-1 bg-primary/5">
            {children}
          </main>
      </div>
    </ProtectedRoute>
  );
}
