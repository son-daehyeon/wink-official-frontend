import OauthLoginClient from './oauth-login-client';

import { applicationQueryOptions } from '@/features/application/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface OauthLoginPageProps {
  params: Promise<{ id: string }>;
}

export default async function OauthLoginPage({ params }: OauthLoginPageProps) {
  const { id } = await params;
  const api = await createServerApi();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(applicationQueryOptions.detail(id, api));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OauthLoginClient id={id} />
    </HydrationBoundary>
  );
}
