
'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState, ReactNode} from 'react';
import {useAuth} from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

function DefaultSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Wait until loading is false and we're on the client.
    if (!loading && isClient) {
      // If there's no user, redirect.
      if (!user) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, router, isClient, redirectTo]);

  // While loading, or if there's no user (and redirection is imminent),
  // show the skeleton.
  if (loading || !user) {
    return <Skeleton />;
  }
  
  // If we have a user, render the children.
  return children;
};
