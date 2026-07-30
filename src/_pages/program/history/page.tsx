import ProgramHistoryClient from './history-client';

import { programQueryOptions } from '@/features/program/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function ProgramHistoryPage() {
  const queryClient = createQueryClient();
  const api = await createServerApi();

  await queryClient.prefetchQuery(programQueryOptions.histories(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgramHistoryClient />
    </HydrationBoundary>
  );
}
