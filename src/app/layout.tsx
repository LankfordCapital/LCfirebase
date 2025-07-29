
'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AIAssistant } from '@/components/ai-assistant';
import { Providers } from '@/components/providers';
import { usePathname } from 'next/navigation';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

// Using a wrapper component to access pathname, as RootLayout cannot be a 'use client' component with metadata.
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/broker-office') || pathname.startsWith('/workforce-office');

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && !isDashboardPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && !isDashboardPage && <Footer />}
      {!isAuthPage && !isDashboardPage && <AIAssistant />}
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fontBody.variable, fontHeadline.variable)}>
      <head>
          <title>Lankford Capital - Your Partner in Financial Growth</title>
          <meta name="description" content="Lankford Capital offers a wide range of loan products including residential, commercial, and industrial loans. We provide tailored financing solutions for construction, acquisition, and development projects. Your trusted partner for real estate and business financing." />
          <meta name="keywords" content="real estate financing, investment property loans, private lending, hard money lender, commercial real estate loans, residential investment loans, non-owner occupied loans, fix and flip loans, DSCR loans, ground up construction loans, bridge loans, commercial bridge loans, industrial property financing, land development loans, mezzanine financing, equipment financing, mobilization funding, capital for real estate investors, broker loan programs, Lankford Capital, Lankford Lending" />
          <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" />
          <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
