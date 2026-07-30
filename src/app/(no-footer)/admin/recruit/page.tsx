import AdminRecruitClient from './admin-recruit-client';

import { adminQueryOptions } from '@/features/admin/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function AdminRecruitPage() {
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(adminQueryOptions.recruits(api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminRecruitClient />
    </HydrationBoundary>
  );
}
