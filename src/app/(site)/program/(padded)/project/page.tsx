import ProgramProjectClient from './project-client';

import { programQueryOptions } from '@/features/program/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface ProgramProjectPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ProgramProjectPage({ searchParams }: ProgramProjectPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const queryClient = createQueryClient();
  const api = await createServerApi();

  await queryClient.prefetchQuery(programQueryOptions.projects(api, safePage));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgramProjectClient initialPage={safePage} />
    </HydrationBoundary>
  );
}
