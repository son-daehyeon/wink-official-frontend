import RecruitPageClient from './recruit-page-client';

import { latestRecruitQueryOptions } from '@/features/recruit';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function RecruitPage() {
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(latestRecruitQueryOptions(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecruitPageClient />
    </HydrationBoundary>
  );
}
