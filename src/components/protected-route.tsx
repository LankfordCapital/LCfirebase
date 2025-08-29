
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
  const { user, loading, userProfile, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to be determined
    }

    if (!user) {
      router.push(redirectTo);
      return;
    }

    // An admin can access any page
    if (isAdmin) {
      return;
    }

    // For non-admins, check if their role is in the allowed list
    if (userProfile && !allowedRoles.includes(userProfile.role)) {
      router.push('/auth/signin'); // Or a generic 'unauthorized' page
    }
  }, [user, loading, userProfile, isAdmin, allowedRoles, redirectTo, router]);

  // If loading, or if the user is present but the profile isn't yet, show loader.
  // Also covers the case where a non-admin is about to be redirected.
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

  // Fallback loader while redirecting unauthorized users
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader className="h-10 w-10" />
    </div>
  );
}
