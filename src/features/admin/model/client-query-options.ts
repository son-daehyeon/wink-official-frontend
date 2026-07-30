'use client';

import { getAdminRecruitForm } from '../api/browser';
import { adminKeys } from './keys';

import { queryOptions } from '@tanstack/react-query';

export const adminClientQueryOptions = {
  recruitForm: (recruitId: string, formId: string) =>
    queryOptions({
      queryKey: adminKeys.recruitForm(recruitId, formId),
      queryFn: () => getAdminRecruitForm(recruitId, formId),
      enabled: !!recruitId && !!formId,
      gcTime: 0,
    }),
};
