
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import HeaderWrapper from '@/components/layout/header-wrapper';
import Footer from '@/components/layout/footer';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});


export const metadata: Metadata = {
    title: "Lankford Capital - Your Partner in Financial Growth",
    description: "Lankford Capital offers a wide range of loan products including residential, commercial, and industrial loans. We provide tailored financing solutions for construction, acquisition, and development projects. Your trusted partner for real estate and business financing.",
    keywords: "real estate financing, investment property loans, private lending, hard money lender, commercial real estate loans, residential investment loans, non-owner occupied loans, fix and flip loans, DSCR loans, ground up construction loans, bridge loans, commercial bridge loans, industrial property financing, land development loans, mezzanine financing, equipment financing, mobilization funding, capital for real estate investors, broker loan programs, Lankford Capital, Lankford Lending",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fontBody.variable, fontHeadline.variable, "h-full")}>
      <head>
          <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" />
          <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" />
      </head>
      <body className="font-body antialiased flex flex-col h-full">
        <Providers>
            <HeaderWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
