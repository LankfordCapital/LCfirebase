
'use client';

import { ProtectedRoute } from "@/components/protected-route";
import { Loader2 } from "lucide-react";
import BrokerOfficePageClient from "@/components/broker-office-page-client";
import { useAuth } from "@/contexts/auth-context";

function BrokerOfficeSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

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
      <ProtectedRoute redirectTo="/auth/broker-signin" Skeleton={BrokerOfficeSkeleton}>
        <BrokerOfficeLayoutContent>{children}</BrokerOfficeLayoutContent>
      </ProtectedRoute>
  );
}
