
'use client';

import { ProtectedRoute } from "@/components/protected-route";
import BrokerOfficePageClient from "@/components/broker-office-page-client";

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
