import AdminRecruitStatisticsClient from './admin-recruit-statistics-client';

import { adminQueryOptions } from '@/features/admin/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface AdminRecruitStatisticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRecruitStatisticsPage({
  params,
}: AdminRecruitStatisticsPageProps) {
  const { id } = await params;
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(adminQueryOptions.recruit(api, id)),
    queryClient.prefetchQuery(adminQueryOptions.recruitForms(api, id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminRecruitStatisticsClient recruitId={id} />
    </HydrationBoundary>
  );
}
