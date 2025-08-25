
'use client';

import { ProtectedRoute } from '@/components/protected-route';


export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <ProtectedRoute allowedRoles={['broker', 'workforce', 'admin']} redirectTo="/auth/broker-signin">
          <div className="flex flex-col min-h-screen">
            <main>
              {children}
            </main>
          </div>
        </ProtectedRoute>
  );
}
