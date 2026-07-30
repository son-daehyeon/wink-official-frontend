import AdminRecruitDetailClient from './admin-recruit-detail-client';

import { adminQueryOptions } from '@/features/admin/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface AdminRecruitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRecruitDetailPage({ params }: AdminRecruitDetailPageProps) {
  const { id } = await params;
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(adminQueryOptions.recruit(api, id)),
    queryClient.prefetchQuery(adminQueryOptions.recruitForms(api, id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminRecruitDetailClient recruitId={id} />
    </HydrationBoundary>
  );
}
