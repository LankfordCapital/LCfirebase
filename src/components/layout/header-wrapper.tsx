
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';
import { BrokerOfficeHeader } from '@/components/broker-office-header';
import { WorkforceOfficeHeader } from '@/components/workforce-office-header';

export function HeaderWrapper() {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/book-appointment');
  const isBrokerOffice = pathname.startsWith('/broker-office');
  const isWorkforceOffice = pathname.startsWith('/workforce-office');
  const isBorrowerDashboard = pathname.startsWith('/dashboard');

  if (isAuthPage) {
    return null; // No header or footer on auth pages
  }

  if (isBorrowerDashboard) {
    return <BorrowerDashboardHeader />;
  }

  if (isBrokerOffice) {
    return <BrokerOfficeHeader />;
  }
  
  if (isWorkforceOffice) {
    return <WorkforceOfficeHeader />;
  }

  // Default public-facing header and footer
  return (
    <>
      <Header />
      <div className="flex-1" /> {/* This is a placeholder for the main content that is outside this component */}
      <Footer />
    </>
  );
}

