
'use client';

export default function BrokerOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="bg-primary/5 min-h-screen">
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
  );
}
