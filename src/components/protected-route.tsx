
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CustomLoader } from './ui/custom-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading, userProfile, getRedirectPath, isLoggingOut } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoggingOut) return;
    if (loading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (userProfile) {
      if (allowedRoles.includes(userProfile.role)) {
        setIsAuthorized(true);
      } else {
        const path = getRedirectPath();
        router.push(path);
      }
    }
    // If no userProfile, onAuthStateChanged in AuthContext will handle it
    // or the loading screen will persist. This prevents premature redirects.

  }, [user, userProfile, loading, allowedRoles, redirectTo, router, getRedirectPath, isLoggingOut]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return <>{children}</>;
}
