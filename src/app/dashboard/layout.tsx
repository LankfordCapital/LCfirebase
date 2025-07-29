
'use client';

import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex flex-col min-h-screen">
          <BorrowerDashboardHeader />
          <main className="flex-1">
              <div className="container mx-auto p-4 md:p-6 lg:p-8">
                  {children}
              </div>
          </main>
      </div>
  );
}
