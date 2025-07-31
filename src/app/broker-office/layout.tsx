
'use client';

import { BrokerOfficeHeader } from '@/components/broker-office-header';
import { ProtectedRoute } from '@/components/protected-route';


export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="bg-primary/5 min-h-screen">
          <main>
            {children}
          </main>
        </div>
  );
}
