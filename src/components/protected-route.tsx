
'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState, ReactNode} from 'react';
import {useAuth} from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

function DefaultSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}


export const ProtectedRoute = ({
  children,
  redirectTo = '/auth/signin',
  Skeleton = DefaultSkeleton,
}: {
  children: ReactNode;
  redirectTo?: string;
  Skeleton?: React.ComponentType;
}) => {
  const {user, loading} = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading || !user) {
    return <Skeleton />;
  }
  
  return children;
};
