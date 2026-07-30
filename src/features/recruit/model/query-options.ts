/* eslint-disable @tanstack/query/exhaustive-deps -- API transports do not define cache identity. */
import { getEditForm } from '../api/client';
import { recruitKeys } from './keys';

import { GetRecruitResponse } from '@/entities/recruit';
import type { paths } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent } from '@/shared/api/openapi';
import { queryOptions } from '@tanstack/react-query';
import type { Client } from 'openapi-fetch';

export type RecruitApiClient = Client<paths>;

export function getLatestRecruit(api: RecruitApiClient) {
  return api.GET('/recruit/latest').then(unwrapOpenApiContent) as Promise<GetRecruitResponse>;
}

export function latestRecruitQueryOptions(api: RecruitApiClient) {
  return queryOptions({
    queryKey: recruitKeys.latest(),
    queryFn: () => getLatestRecruit(api),
  });
}

export function editFormQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: recruitKeys.editForm(),
    queryFn: getEditForm,
    enabled,
    gcTime: 0,
    retry: false,
    staleTime: Infinity,
  });
}
