import ProgramActivityClient from './activity-client';

import { programQueryOptions } from '@/features/program/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function ProgramActivityPage() {
  const queryClient = createQueryClient();
  const api = await createServerApi();

  await queryClient.prefetchQuery(programQueryOptions.activities(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgramActivityClient />
    </HydrationBoundary>
  );
}
