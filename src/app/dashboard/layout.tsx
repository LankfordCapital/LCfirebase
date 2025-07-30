
'use client';

import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';
import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
          <BorrowerDashboardHeader />
          <main className="flex-1">
              <div className="container mx-auto p-4 md:p-6 lg:p-8">
                  {children}
              </div>
          </main>
      </div>
    // </ProtectedRoute>
  );
}
