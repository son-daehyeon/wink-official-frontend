'use client';

import { ReactNode, useEffect, useState } from 'react';

import { createQueryClient } from '@/shared/lib/query-client';
import { Toaster } from '@/shared/ui/sonner';
import { DehydratedState, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export default function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

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
          {children}
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
