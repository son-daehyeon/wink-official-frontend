'use client';

import { getCurrentUser } from '../api/client';

import { userKeys } from '@/entities/user';
import { queryOptions } from '@tanstack/react-query';

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: userKeys.me(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 60 * 1000,
  });
}
