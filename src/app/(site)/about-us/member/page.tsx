import AboutUsMemberClient from './member-client';

import { programQueryOptions } from '@/features/program/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function AboutUsMemberPage() {
  const queryClient = createQueryClient();
  const api = await createServerApi();

  await queryClient.prefetchQuery(programQueryOptions.users(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AboutUsMemberClient />
    </HydrationBoundary>
  );
}
