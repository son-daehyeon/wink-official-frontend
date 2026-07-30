import ProgramStudyClient from './study-client';

import { programQueryOptions } from '@/features/program/server';
import { createServerApi } from '@/shared/api/server';
import { createQueryClient } from '@/shared/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface ProgramStudyPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    query?: string;
  }>;
}

export default async function ProgramStudyPage({ searchParams }: ProgramStudyPageProps) {
  const params = await searchParams;
  const category = params.category ?? '전체';
  const query = params.query ?? '';
  const page = Number(params.page ?? 0);
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const queryClient = createQueryClient();
  const api = await createServerApi();

  await Promise.all([
    queryClient.prefetchQuery(programQueryOptions.studyCategories(api)),
    queryClient.prefetchQuery(programQueryOptions.studies(api, category, safePage, query)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgramStudyClient initialCategory={category} initialPage={safePage} initialQuery={query} />
    </HydrationBoundary>
  );
}
