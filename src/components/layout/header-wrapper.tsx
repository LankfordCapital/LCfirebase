
'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import BorrowerDashboardHeader from '../borrower-dashboard-header';
import BrokerOfficeHeader from '../broker-office-header';
import WorkforceOfficeHeader from '../workforce-office-header';
import { useAuth } from '@/contexts/auth-context';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isBrokerOfficePage = pathname.startsWith('/broker-office');
  const isWorkforceOfficePage = pathname.startsWith('/workforce-office');
  const isProtected = isDashboardPage || isBrokerOfficePage || isWorkforceOfficePage;

  if (loading && isProtected) {
    return null; // Don't render any header while checking auth for protected pages
  }

  // If on a protected route but there's no user, render nothing.
  // This prevents the header flash before the redirect.
  if (isProtected && !user) {
    return null;
  }

  if (isDashboardPage) {
    return <BorrowerDashboardHeader />;
  }

  if (isBrokerOfficePage) {
    return <BrokerOfficeHeader />;
  }
  
  if (isWorkforceOfficePage) {
      return <WorkforceOfficeHeader />
  }

  if (isAuthPage) {
    return null;
  }

  return <Header />;
}
