
'use client';
import { ProtectedRoute } from '@/components/protected-route';

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProtectedRoute redirectTo="/auth/broker-signin">
        <div className="bg-primary/5 min-h-screen">{children}</div>
      </ProtectedRoute>
  );
}
