
'use client';

import { ProtectedRoute } from '@/components/protected-route';
import ChatLauncher from '@/components/chat-launcher';


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
            <ChatLauncher />
          </div>
        </ProtectedRoute>
  );
}

    