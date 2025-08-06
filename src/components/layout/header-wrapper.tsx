
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { BorrowerDashboardHeader } from '../borrower-dashboard-header';
import { BrokerOfficeHeader } from '../broker-office-header';
import { WorkforceOfficeHeader } from '../workforce-office-header';


export default function HeaderWrapper() {
  const pathname = usePathname();

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
