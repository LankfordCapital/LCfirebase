
'use client';

import { ProtectedRoute } from '@/components/protected-route';


export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <ProtectedRoute allowedRoles={['broker', 'workforce', 'admin']} redirectTo="/auth/signin">
          <div className="flex flex-col min-h-screen">
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </ProtectedRoute>
  );
}

    