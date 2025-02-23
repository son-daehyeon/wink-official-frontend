'use client';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        <title>Web IN Kookmin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>{children}</main>
        <Toaster position="top-right" richColors={true} duration={3000} closeButton={true} />
      </body>
    </html>
  );
}
