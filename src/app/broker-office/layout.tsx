
'use client';

import { BrokerOfficeHeader } from "@/components/broker-office-header";
import { ProtectedRoute } from "@/components/protected-route";

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/auth/broker-signin">
        <div className="bg-primary/5 min-h-screen">
          <BrokerOfficeHeader />
          <main>
            {children}
          </main>
        </div>
    </ProtectedRoute>
  );
}
