/* eslint-disable @tanstack/query/exhaustive-deps -- API transports do not define cache identity. */
import type { CheckRegisterResponse, CheckResetPasswordResponse } from './contracts';

import type { paths } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent } from '@/shared/api/openapi';
import { queryOptions } from '@tanstack/react-query';
import type { Client } from 'openapi-fetch';

export type AuthApiClient = Client<paths>;

export const authKeys = {
  all: ['auth'] as const,
  registerCheck: () => [...authKeys.all, 'register-check'] as const,
  resetPasswordCheck: () => [...authKeys.all, 'reset-password-check'] as const,
};

export function checkRegister(api: AuthApiClient, token: string) {
  return api
    .POST('/auth/register/check', { body: { token } })
    .then(unwrapOpenApiContent<CheckRegisterResponse>);
}

export function checkResetPassword(api: AuthApiClient, token: string) {
  return api
    .POST('/auth/reset-password/check', { body: { token } })
    .then(unwrapOpenApiContent<CheckResetPasswordResponse>);
}

export const authQueryOptions = {
  registerCheck: (api: AuthApiClient, token: string) =>
    queryOptions({
      queryKey: authKeys.registerCheck(),
      queryFn: () => checkRegister(api, token),
      enabled: !!token,
      gcTime: 0,
      retry: false,
    }),
  resetPasswordCheck: (api: AuthApiClient, token: string) =>
    queryOptions({
      queryKey: authKeys.resetPasswordCheck(),
      queryFn: () => checkResetPassword(api, token),
      enabled: !!token,
      gcTime: 0,
      retry: false,
    }),
};
