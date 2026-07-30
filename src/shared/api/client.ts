'use client';

import type { paths } from '@/shared/api/generated/openapi';
import { getBrowserCookie, isUnsafeMethod } from '@/shared/api/shared';
import createClient from 'openapi-fetch';

let csrfRequest: Promise<void> | null = null;
let refreshRequest: Promise<boolean> | null = null;

async function ensureCsrfCookie(method?: string) {
  if (!isUnsafeMethod(method) || getBrowserCookie('XSRF-TOKEN')) return;

  csrfRequest ??= fetch('/api/auth/csrf', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('CSRF 토큰을 발급받지 못했습니다.');
      }
    })
    .finally(() => {
      csrfRequest = null;
    });

  await csrfRequest;
}

async function refreshAuthCookies() {
  await ensureCsrfCookie('POST');

  const csrfToken = getBrowserCookie('XSRF-TOKEN');
  refreshRequest ??= fetch('/api/auth/refresh-token', {
    method: 'POST',
    credentials: 'include',
    headers: csrfToken
      ? {
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        }
      : undefined,
  })
    .then((response) => response.ok)
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

async function authenticatedFetch(input: Request) {
  await ensureCsrfCookie(input.method);

  const headers = new Headers(input.headers);
  const csrfToken = getBrowserCookie('XSRF-TOKEN');

  if (csrfToken && isUnsafeMethod(input.method)) {
    headers.set('X-XSRF-TOKEN', decodeURIComponent(csrfToken));
  }

  const requestWithCredentials = new Request(input, {
    credentials: 'include',
    headers,
  });
  const retryRequest = requestWithCredentials.clone();
  let response = await fetch(requestWithCredentials);
  const path = new URL(input.url).pathname.replace(/^\/api/, '');
  const canRefresh = path === '/auth/me' || !path.startsWith('/auth/');

  if (response.status === 401 && canRefresh && (await refreshAuthCookies())) {
    response = await fetch(retryRequest);
  }

  return response;
}

export function authenticatedBrowserFetch(input: string, init?: RequestInit) {
  return authenticatedFetch(new Request(new URL(input, window.location.origin), init));
}

export const browserApi = createClient<paths>({
  baseUrl: '/api',
  credentials: 'include',
  fetch: authenticatedFetch,
});
