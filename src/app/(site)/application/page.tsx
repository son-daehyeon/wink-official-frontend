import ApplicationPageClient from './application-page-client';

import { applicationQueryOptions } from '@/features/application/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function ApplicationPage() {
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(applicationQueryOptions.list(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApplicationPageClient />
    </HydrationBoundary>
  );
}
