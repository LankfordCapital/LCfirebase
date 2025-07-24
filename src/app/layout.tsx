import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AIAssistant } from '@/components/ai-assistant';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'Lankford Capital Group - Your Partner in Financial Growth',
  description:
    'Lankford Capital Group offers a wide range of loan products including residential, commercial, industrial, and SBA loans. We provide tailored financing solutions for construction, acquisition, and development projects. Your trusted partner for real estate and business financing.',
  keywords:
    'lending, loan, residential lending, commercial lending, industrial loans, sba loans, construction financing, fix and flip, dscr loans, land acquisition, equipment financing, broker services, capital group',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fontBody.variable, fontHeadline.variable)}>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <AIAssistant />
        <Toaster />
      </body>
    </html>
  );
}
