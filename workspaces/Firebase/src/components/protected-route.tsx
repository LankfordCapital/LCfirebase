
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomLoader } from './ui/custom-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push(redirectTo);
      return;
    }

    const checkUserAuthorization = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;
          const userStatus = userData.status;
          
          if (userRole === 'workforce' && allowedRoles.includes('workforce')) {
            setIsAuthorized(true);
          } else if (userStatus === 'pending' && userRole !== 'admin') {
            router.push('/auth/pending-approval');
          } else if (userStatus === 'approved' && allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else if(user?.email === 'admin@lankfordcapital.com' && (allowedRoles.includes('workforce') || allowedRoles.includes('admin'))) {
            setIsAuthorized(true);
          }
          else {
            router.push(redirectTo);
          }
        } else {
             if(user?.email === 'admin@lankfordcapital.com' && (allowedRoles.includes('workforce') || allowedRoles.includes('admin'))) {
                setIsAuthorized(true);
             } else {
                // If no user doc, they can't be authorized unless it's the master admin
                console.warn("No user document found for UID:", user.uid);
                router.push(redirectTo);
             }
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        router.push(redirectTo);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkUserAuthorization();
  }, [user, loading, router, allowedRoles, redirectTo]);

  if (loading || isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
