
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
  const { user, loading, userProfile, isAdmin, getRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to be determined
    }

    if (!user) {
      router.push(redirectTo);
      return;
    }

    // An admin can access any page, so no need to redirect.
    if (isAdmin) {
      return;
    }

    // For non-admins, check if their role is in the allowed list.
    if (userProfile && !allowedRoles.includes(userProfile.role)) {
      // If the role is not allowed, redirect to the correct default page for their role.
      const path = getRedirectPath(userProfile);
      router.push(path);
    }
  }, [user, loading, userProfile, isAdmin, allowedRoles, redirectTo, router, getRedirectPath]);

  // While loading, or if the user is present but the profile isn't yet, show loader.
  if (loading || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  // If user is an admin, or their role is allowed, render the children.
  if (isAdmin || allowedRoles.includes(userProfile.role)) {
    return <>{children}</>;
  }

  // Fallback loader while redirecting unauthorized users.
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader className="h-10 w-10" />
    </div>
  );
}
