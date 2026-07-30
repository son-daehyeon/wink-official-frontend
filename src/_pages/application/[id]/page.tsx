import ApplicationDetailClient from './application-detail-client';

import { applicationQueryOptions } from '@/features/application/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(applicationQueryOptions.detail(id, api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApplicationDetailClient id={id} />
    </HydrationBoundary>
  );
}
