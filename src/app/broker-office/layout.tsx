
'use client';

import { BrokerOfficeHeader } from "@/components/broker-office-header";

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="bg-primary/5 min-h-screen">
          <BrokerOfficeHeader />
          <main>
            {children}
          </main>
        </div>
  );
}
