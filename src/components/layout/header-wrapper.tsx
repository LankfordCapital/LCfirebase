
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
  const { user, loading, userProfile, isLoggingOut } = useAuth();

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
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');
  const isBrokerOfficePage = pathname.startsWith('/broker-office');
  const isWorkforceOfficePage = pathname.startsWith('/workforce-office');

  if (isAuthPage) {
    return null;
  }
  
  // Use userProfile to determine header, which ensures role is known
  if (userProfile) {
    if (userProfile.role === 'admin') {
      if (isAdminPage || isDashboardPage || isWorkforceOfficePage) {
        return <WorkforceOfficeHeader />;
      }
    } else if (userProfile.role === 'workforce') {
      if (isWorkforceOfficePage) {
        return <WorkforceOfficeHeader />;
      }
    } else if (userProfile.role === 'broker') {
      if (isBrokerOfficePage) {
        return <BrokerOfficeHeader />;
      }
    } else if (userProfile.role === 'borrower') {
       if (isDashboardPage) {
        return <BorrowerDashboardHeader />;
      }
    }
  }
  
  // Default public header if not in any specific dashboard
  return <Header />;
}

    