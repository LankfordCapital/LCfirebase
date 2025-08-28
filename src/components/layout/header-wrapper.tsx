
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

  const isDashboard = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/broker-office') || 
                      pathname.startsWith('/workforce-office');

  // While loading auth state for dashboard pages, don't render any header to prevent flicker
  if (loading && isDashboard) {
    return null;
  }

  if (pathname.startsWith('/dashboard')) {
    return <BorrowerDashboardHeader />;
  }

  if (pathname.startsWith('/broker-office')) {
    return <BrokerOfficeHeader />;
  }
  
  if (pathname.startsWith('/workforce-office') || pathname.startsWith('/auth/admin-signup')) {
      return <WorkforceOfficeHeader />
  }

  if (pathname.startsWith('/auth')) {
    return null;
  }

  return <Header />;
}
