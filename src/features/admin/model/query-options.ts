/* eslint-disable @tanstack/query/exhaustive-deps -- API transports do not define cache identity. */
import {
  type AdminApiClient,
  getAdminActivities,
  getAdminPreUsers,
  getAdminRecruit,
  getAdminRecruitForms,
  getAdminRecruitSms,
  getAdminRecruits,
  getAdminUsers,
} from '../api/server';
import { adminKeys } from './keys';

import { queryOptions } from '@tanstack/react-query';

export const adminQueryOptions = {
  recruits: (api: AdminApiClient) =>
    queryOptions({
      queryKey: adminKeys.recruits(),
      queryFn: () => getAdminRecruits(api),
    }),
  recruit: (api: AdminApiClient, recruitId: string) =>
    queryOptions({
      queryKey: adminKeys.recruit(recruitId),
      queryFn: () => getAdminRecruit(api, recruitId),
      enabled: !!recruitId,
    }),
  recruitForms: (api: AdminApiClient, recruitId: string) =>
    queryOptions({
      queryKey: adminKeys.recruitForms(recruitId),
      queryFn: () => getAdminRecruitForms(api, recruitId),
      enabled: !!recruitId,
    }),
  recruitSms: (api: AdminApiClient, recruitId: string) =>
    queryOptions({
      queryKey: adminKeys.recruitSms(recruitId),
      queryFn: () => getAdminRecruitSms(api, recruitId),
      enabled: !!recruitId,
    }),
  users: (api: AdminApiClient, page = 0, query = '') =>
    queryOptions({
      queryKey: adminKeys.users(page, query),
      queryFn: () => getAdminUsers(api, page, query),
    }),
  preUsers: (api: AdminApiClient, page = 0, query = '') =>
    queryOptions({
      queryKey: adminKeys.preUsers(page, query),
      queryFn: () => getAdminPreUsers(api, page, query),
    }),
  activities: (api: AdminApiClient, page = 0, query = '') =>
    queryOptions({
      queryKey: adminKeys.activities(page, query),
      queryFn: () => getAdminActivities(api, page, query),
    }),
};
