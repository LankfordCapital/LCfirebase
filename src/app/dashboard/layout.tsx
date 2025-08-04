
'use client';

import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ProtectedRoute allowedRoles={['borrower']} redirectTo="/auth/signin">
      <div className="flex flex-col min-h-screen">
          <main className="flex-1 bg-primary/5">
            {children}
          </main>
      </div>
    </ProtectedRoute>
  );
}
