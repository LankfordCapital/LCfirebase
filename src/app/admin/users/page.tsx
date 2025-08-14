'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main admin panel since user management is handled there
    router.push('/admin');
  }, [router]);

  return null;
}

