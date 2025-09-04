
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import '@/lib/db-init'; // Initialize database collections

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});


export const metadata: Metadata = {
    title: "Lankford Capital - Your Partner in Financial Growth",
    description: "Lankford Capital offers a wide range of loan products including residential, commercial, and industrial loans. We provide tailored financing solutions for construction, acquisition, and development projects. Your trusted partner for real estate and business financing.",
    keywords: "real estate financing, investment property loans, private lending, hard money lender, commercial real estate loans, residential investment loans, non-owner occupied loans, fix and flip loans, DSCR loans, ground up construction loans, bridge loans, commercial bridge loans, industrial property financing, land development loans, mezzanine financing, equipment financing, mobilization funding, capital for real estate investors, broker loan programs, Lankford Capital, Lankford Lending",
      icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
    manifest: '/site.webmanifest',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fontBody.variable, fontHeadline.variable, "h-full")}>
              <head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
        </head>
      <body className="font-body antialiased flex flex-col h-full">
        <Providers>
            {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
