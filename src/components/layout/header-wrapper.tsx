
'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import BorrowerDashboardHeader from '../borrower-dashboard-header';
import BrokerOfficeHeader from '../broker-office-header';
import WorkforceOfficeHeader from '../workforce-office-header';
import { useAuth } from '@/contexts/auth-context';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const { loading } = useAuth();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isBrokerOfficePage = pathname.startsWith('/broker-office');
  const isWorkforceOfficePage = pathname.startsWith('/workforce-office');

  // While auth state is loading, don't show any header for protected areas to prevent flashing.
  if (loading && (isDashboardPage || isBrokerOfficePage || isWorkforceOfficePage)) {
    return null;
  }

  if (isDashboardPage) {
    return <BorrowerDashboardHeader />;
  }

  if (isBrokerOfficePage) {
    return <BrokerOfficeHeader />;
  }
  
  if (pathname.startsWith('/workforce-office') || pathname.startsWith('/auth/admin-signup')) {
      return <WorkforceOfficeHeader />
  }

  if (isAuthPage) {
    return null;
  }

  return <Header />;
}
