
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the applications page
    router.replace('/broker-office/applications');
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="font-headline text-3xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to the applications page.</p>
      </div>
    </div>
  );
}
