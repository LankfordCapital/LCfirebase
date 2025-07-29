
'use client';

import { ProtectedRoute } from "@/components/protected-route";
import { Loader2 } from "lucide-react";
import BrokerOfficePageClient from "@/components/broker-office-page-client";
import { useAuth } from "@/contexts/auth-context";

function BrokerOfficeLayoutContent({ children }: { children: React.ReactNode }) {
    return (
         <div className="bg-primary/5 min-h-screen">{children}</div>
    )
}

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProtectedRoute redirectTo="/auth/broker-signin">
        <BrokerOfficeLayoutContent>{children}</BrokerOfficeLayoutContent>
      </ProtectedRoute>
  );
}
