
'use client';

import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';
import { ProtectedRoute } from '@/components/protected-route';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isApplicationPage = pathname.startsWith('/dashboard/application');

  return (
    // <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
          <BorrowerDashboardHeader />
          <main className="flex-1">
              <div className={isApplicationPage ? "" : "container mx-auto p-4 md:p-6 lg:p-8"}>
                  {children}
              </div>
          </main>
      </div>
    // </ProtectedRoute>
  );
}
