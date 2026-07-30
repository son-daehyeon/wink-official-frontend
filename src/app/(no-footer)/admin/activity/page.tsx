import AdminActivityClient from './admin-activity-client';

import { adminQueryOptions } from '@/features/admin/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface AdminActivityPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}

export default async function AdminActivityPage({ searchParams }: AdminActivityPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const query = params.query ?? '';
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(adminQueryOptions.activities(api, safePage, query));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminActivityClient />
    </HydrationBoundary>
  );
}
