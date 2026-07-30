import { ReactNode } from 'react';

import { Roboto } from 'next/font/google';
import { cookies } from 'next/headers';

import Providers from '@/_app/providers';
import '@/_app/styles/global.css';
import { serverCurrentUserQueryOptions } from '@/features/user/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { dehydrate } from '@tanstack/react-query';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const queryClient = createQueryClient();
  const cookieStore = await cookies();
  const canPrefetchCurrentUser =
    cookieStore.has('WINK_ACCESS_TOKEN') || !cookieStore.has('WINK_REFRESH_TOKEN');

  if (canPrefetchCurrentUser) {
    await queryClient.prefetchQuery(serverCurrentUserQueryOptions());
  }

  return (
    <html lang="ko">
      <head>
        <title>WINK: Web IN Kookmin</title>
        <meta name="description" content="국민대학교 소프트웨어융합대학 웹 학술 동아리 WINK" />
        <meta name="keywords" content="국민대학교, WINK, 웹 개발, 웹 동아리, 국민대 웹 동아리" />
        <meta name="author" content="WINK - Web IN Kookmin" />
        <meta name="robots" content="index,nofollow" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />

        <meta property="og:url" content="https://wink.kookmin.ac.kr" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Web IN Kookmin" />
        <meta
          property="og:description"
          content="국민대학교 소프트웨어융합대학 웹 학술 동아리 WINK"
        />
        <meta property="og:image" content="https://i.imgur.com/qXRRE56.png" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={roboto.variable}>
        <Providers dehydratedState={dehydrate(queryClient)}>{children}</Providers>
      </body>
    </html>
  );
}
