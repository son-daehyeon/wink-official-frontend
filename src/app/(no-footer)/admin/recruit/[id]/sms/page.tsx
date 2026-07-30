import AdminRecruitSmsClient from './admin-recruit-sms-client';

import { adminQueryOptions } from '@/features/admin/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface AdminRecruitSmsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRecruitSmsPage({ params }: AdminRecruitSmsPageProps) {
  const { id } = await params;
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(adminQueryOptions.recruitSms(api, id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminRecruitSmsClient recruitId={id} />
    </HydrationBoundary>
  );
}
