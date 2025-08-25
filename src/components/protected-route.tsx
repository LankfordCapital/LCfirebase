
'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CustomLoader } from './ui/custom-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (!user) {
      router.push(redirectTo); // No user, redirect to sign-in
      return;
    }

    if (userProfile) {
      if (!allowedRoles.includes(userProfile.role)) {
         // User's role is not allowed, redirect to their default dashboard
         if (userProfile.role === 'borrower') router.push('/dashboard');
         else if (userProfile.role === 'broker') router.push('/broker-office');
         else if (userProfile.role === 'workforce' || userProfile.role === 'admin') router.push('/workforce-office');
         else router.push(redirectTo); // Fallback
      }
      // If role is allowed, the component will render children.
    }
    
    // If there's a user but no profile yet, auth context is still resolving.
    // The loading screen will show until profile is loaded and this effect re-runs.

  }, [user, userProfile, loading, allowedRoles, redirectTo, router]);

  if (loading || !userProfile || !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return <>{children}</>;
}

    