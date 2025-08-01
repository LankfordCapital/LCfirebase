
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';

export const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
  allowedRoles?: any[];
  redirectTo?: string;
}) => {
  const { loading } = useAuth();

  if (loading) {
    // You can return a loader here if you want
    return null;
  }
  
  return <>{children}</>;
};
