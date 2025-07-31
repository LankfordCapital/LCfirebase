
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BorrowerDashboardHeader } from '@/components/borrower-dashboard-header';
import { BrokerOfficeHeader } from '@/components/broker-office-header';
import { WorkforceOfficeHeader } from '@/components/workforce-office-header';
import { AIAssistant } from '../ai-assistant';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';
import { useUI } from '@/contexts/ui-context';

export function HeaderWrapper() {
  const pathname = usePathname();
  const { openAssistant } = useUI();

  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/book-appointment');
  const isBrokerOffice = pathname.startsWith('/broker-office');
  const isWorkforceOffice = pathname.startsWith('/workforce-office');
  const isBorrowerDashboard = pathname.startsWith('/dashboard');

  let HeaderComponent = Header;
  let showFooter = true;
  let showAIAssistant = true;
  
  if (isAuthPage) {
    HeaderComponent = () => null;
    showFooter = false;
    showAIAssistant = false;
  } else if (isBorrowerDashboard) {
    HeaderComponent = BorrowerDashboardHeader;
    showFooter = false;
  } else if (isBrokerOffice) {
    HeaderComponent = BrokerOfficeHeader;
    showFooter = false;
  } else if (isWorkforceOffice) {
    HeaderComponent = WorkforceOfficeHeader;
    showFooter = false;
  }

  return (
    <>
      <HeaderComponent />
      {showAIAssistant && (
         <>
          <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50"
            size="icon"
            onClick={() => openAssistant()}
          >
            <MessageSquare className="h-8 w-8" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
          <AIAssistant />
        </>
      )}
      {showFooter && <Footer />}
    </>
  );
}
