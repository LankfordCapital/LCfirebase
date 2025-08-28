
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
    if (loading) {
      return; 
    }

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (userProfile && !allowedRoles.includes(userProfile.role)) {
        const defaultPath = getRedirectPath(userProfile);
        router.push(defaultPath);
    }

  }, [user, userProfile, loading, allowedRoles, redirectTo, router, getRedirectPath]);

  if (loading || !userProfile) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }
  
  if (!allowedRoles.includes(userProfile.role)) {
       return (
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
            <CustomLoader className="h-10 w-10" />
          </div>
        );
  }

  return <>{children}</>;
}
