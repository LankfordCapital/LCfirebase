
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
  const { user, loading, userProfile, getRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No need to check for `loading` here, as the Providers component handles it.
    if (!user) {
      router.push(redirectTo);
      return;
    }
    
    if (userProfile && !allowedRoles.includes(userProfile.role)) {
       const path = getRedirectPath(userProfile);
       router.push(path);
    }
  }, [user, userProfile, allowedRoles, redirectTo, router, getRedirectPath]);

  // The Providers component now shows a loader, so we can simplify this.
  // We only render children if the role is allowed.
  if (userProfile && allowedRoles.includes(userProfile.role)) {
    return <>{children}</>;
  }

  // Otherwise, render a loader while the redirect in useEffect happens.
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader className="h-10 w-10" />
    </div>
  );
}
