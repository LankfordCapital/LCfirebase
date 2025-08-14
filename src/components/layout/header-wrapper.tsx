
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
  const { user, loading, isAdmin } = useAuth();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');
  const isBrokerOfficePage = pathname.startsWith('/broker-office');
  const isWorkforceOfficePage = pathname.startsWith('/workforce-office');

  if (loading) {
    return (
      <div className="flex h-16 items-center justify-center border-b bg-background">
        <CustomLoader />
      </div>
    );
  }
  
  if (isAuthPage) {
    return null;
  }

  // Handle admin pages - show borrower dashboard header for admin users
  if (isAdminPage && user && isAdmin) {
    return <BorrowerDashboardHeader />;
  }

  if (isDashboardPage && user) {
    return <BorrowerDashboardHeader />;
  }

  if (isBrokerOfficePage && user) {
    return <BrokerOfficeHeader />;
  }
  
  if (isWorkforceOfficePage && user) {
      return <WorkforceOfficeHeader />;
  }

  return <Header />;
}
