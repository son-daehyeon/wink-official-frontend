import { cache } from 'react';

import { UserResponse } from '@/entities/user';
import type { User } from '@/entities/user';
import { userKeys } from '@/entities/user';
import { unwrapOpenApiContent } from '@/shared/api/openapi';
import { createServerApi } from '@/shared/api/server';
import { ApiError } from '@/shared/api/shared';
import { queryOptions } from '@tanstack/react-query';

export const getServerCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const api = await createServerApi();
    const { user } = unwrapOpenApiContent<UserResponse>(await api.GET('/auth/me'));

    return user;
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      return null;
    }

    throw error;
  }
});

export function serverCurrentUserQueryOptions() {
  return queryOptions({
    queryKey: userKeys.me(),
    queryFn: getServerCurrentUser,
    retry: false,
    staleTime: 60 * 1000,
  });
}
