
'use client';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
      </div>
  );
}
