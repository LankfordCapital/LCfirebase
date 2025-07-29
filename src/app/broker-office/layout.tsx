
'use client';

import { ProtectedRoute } from "@/components/protected-route";
import { Loader2 } from "lucide-react";

function BrokerOfficeSkeleton() {
  // A simple full-page loader since the broker office layout is simpler.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary/5">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProtectedRoute redirectTo="/auth/broker-signin" Skeleton={BrokerOfficeSkeleton}>
        <div className="bg-primary/5 min-h-screen">{children}</div>
      </ProtectedRoute>
  );
}
