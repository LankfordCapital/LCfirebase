
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { CustomLoader } from './ui/custom-loader';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <CustomLoader className="h-8 w-8" />
    </div>
  )
}

interface UserProfile {
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
}

export const ProtectedRoute = ({
  children,
  allowedRoles = ['borrower', 'broker', 'workforce', 'admin'],
  redirectTo = '/auth/signin',
}: {
  children: ReactNode;
  allowedRoles?: UserProfile['role'][];
  redirectTo?: string;
}) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userProfile = docSnap.data() as UserProfile;
        
        // Master admin bypass
        if (user.email === 'admin@lankfordcapital.com') {
            userProfile.status = 'approved';
            userProfile.role = 'admin';
        }
        
        setProfile(userProfile);

        if (userProfile.status === 'pending' && pathname !== '/auth/pending-approval') {
          router.push('/auth/pending-approval');
        } else if (userProfile.status === 'approved') {
          if (!allowedRoles.includes(userProfile.role) && userProfile.role !== 'admin') {
            // If user is approved but in the wrong dashboard, send them to their correct one
            switch(userProfile.role) {
                case 'borrower':
                    router.push('/dashboard');
                    break;
                case 'broker':
                    router.push('/broker-office');
                    break;
                case 'workforce':
                    router.push('/workforce-office');
                    break;
                default:
                    router.push('/auth/signin'); 
            }
          }
        }
      } else {
         // User exists in Auth but not in Firestore. This could be the admin user.
         if (user.email === 'admin@lankfordcapital.com') {
             setProfile({ role: 'admin', status: 'approved' });
         } else {
             // Or an edge case. Log them out.
            console.error("User profile not found in Firestore.");
            router.push('/auth/signin');
         }
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user, authLoading, router, redirectTo, pathname, allowedRoles]);

  if (authLoading || loadingProfile || !profile) {
    return <FullPageLoader />;
  }

  if (profile.status === 'pending') {
    // Already handled by redirect, but this prevents flashing content
    return <FullPageLoader />;
  }
  
  if (profile.status === 'approved' && (allowedRoles.includes(profile.role) || profile.role === 'admin')) {
      return children;
  }

  // Fallback loader while redirecting
  return <FullPageLoader />;
};
