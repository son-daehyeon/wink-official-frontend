'use client';

import { currentUserQueryOptions } from './query-options';

import type { User } from '@/entities/user';
import { userKeys } from '@/entities/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isInit: boolean;
}

export function useUserStore(): UserStore {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(currentUserQueryOptions());

  return {
    user: data ?? null,
    setUser: (user) => queryClient.setQueryData(userKeys.me(), user),
    isInit: !isPending,
  };
}
