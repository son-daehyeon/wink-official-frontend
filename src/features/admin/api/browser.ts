'use client';

import { GetRecruitFormDetailResponse } from '@/entities/recruit';
import { authenticatedBrowserFetch } from '@/shared/api/client';
import { unwrapResponseContent } from '@/shared/api/openapi';

export async function getAdminRecruitForm(recruitId: string, formId: string) {
  const path = [
    '/api/admin/recruit',
    encodeURIComponent(recruitId),
    'form',
    encodeURIComponent(formId),
  ].join('/');
  const response = await authenticatedBrowserFetch(path, {
    method: 'GET',
    cache: 'no-store',
  });

  return unwrapResponseContent<GetRecruitFormDetailResponse>(response);
}
