
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is now part of the workforce-office profile
export default function AdminProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/workforce-office/profile');
    }, [router]);

    return null; // Render nothing while redirecting
}

    