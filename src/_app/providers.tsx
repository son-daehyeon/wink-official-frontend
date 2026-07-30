'use client';

import { ReactNode, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/cn';
import { createQueryClient } from '@/shared/lib/query-client';
import { Toaster } from '@/shared/ui/sonner';
import { Footer, Header } from '@/widgets/layout';
import { DehydratedState, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

const IGNORE_PATHS = ['/auth', '/recruit/form', '/admin'];

export default function Providers({ children, dehydratedState }: ProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(createQueryClient);
  const ignoreLayoutChrome = IGNORE_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    try {
      window.localStorage.removeItem('recruit');
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NuqsAdapter>
          <Header />

          <main
            className={cn(
              'pt-14',
              ignoreLayoutChrome ? 'min-h-[100dvh]' : 'min-h-[calc(100dvh-274px)]',
            )}
          >
            {children}
          </main>

          {!ignoreLayoutChrome && <Footer />}

          <Toaster
            className="font-sans"
            position="top-center"
            duration={3000}
            closeButton={true}
            richColors={true}
            theme="light"
          />
        </NuqsAdapter>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
