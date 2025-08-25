
'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import BorrowerDashboardHeader from '../borrower-dashboard-header';
import BrokerOfficeHeader from '../broker-office-header';
import WorkforceOfficeHeader from '../workforce-office-header';
import { useAuth } from '@/contexts/auth-context';
import { CustomLoader } from '../ui/custom-loader';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const { userProfile, loading, isLoggingOut } = useAuth();

  // If logging out, show minimal header to prevent redirects
  if (isLoggingOut) {
    return (
      <div className="flex h-16 items-center justify-center border-b bg-background">
        <CustomLoader />
      </div>
    );
  }
  
  if (loading) {
     return (
      <div className="flex h-16 items-center justify-center border-b bg-background">
        <CustomLoader />
      </div>
    );
  }

  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return null;
  }
  
  // Use userProfile to determine header, which ensures role is known
  if (userProfile) {
    switch (userProfile.role) {
      case 'admin':
      case 'workforce':
        if (pathname.startsWith('/workforce-office') || pathname.startsWith('/dashboard')) {
          return <WorkforceOfficeHeader />;
        }
        break;
      case 'broker':
        if (pathname.startsWith('/broker-office')) {
          return <BrokerOfficeHeader />;
        }
        break;
      case 'borrower':
         if (pathname.startsWith('/dashboard')) {
          return <BorrowerDashboardHeader />;
        }
        break;
    }
  }
  
  // Default public header if not in any specific dashboard or for non-logged-in users
  return <Header />;
}
