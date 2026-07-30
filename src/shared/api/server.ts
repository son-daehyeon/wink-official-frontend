import { cookies } from 'next/headers';

import type { paths } from '@/shared/api/generated/openapi';
import { ApiError, isUnsafeMethod } from '@/shared/api/shared';
import createClient from 'openapi-fetch';
import 'server-only';

const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'X-XSRF-TOKEN';

function getServerApiBaseUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:8080'
  ).replace(/\/$/, '');
}

export async function createServerApi() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const baseUrl = getServerApiBaseUrl();

  return createClient<paths>({
    baseUrl,
    fetch: async (request) => {
      const headers = new Headers(request.headers);
      headers.set('Cookie', cookieHeader);

      if (isUnsafeMethod(request.method)) {
        const csrfToken = await getServerCsrf(baseUrl, cookieHeader);
        headers.set('Cookie', appendCookie(cookieHeader, `${XSRF_COOKIE}=${csrfToken}`));
        headers.set(XSRF_HEADER, decodeURIComponent(csrfToken));
      }

      return fetch(
        new Request(request, {
          cache: 'no-store',
          headers,
        }),
      );
    },
  });
}

function appendCookie(cookieHeader: string, cookie: string) {
  return cookieHeader ? `${cookieHeader}; ${cookie}` : cookie;
}

function getSetCookie(headers: Headers) {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const cookies = headersWithSetCookie.getSetCookie?.();

  if (cookies && cookies.length > 0) return cookies;

  const singleHeader = headers.get('set-cookie');
  return singleHeader ? [singleHeader] : [];
}

function getCookieFromSetCookie(setCookies: string[], name: string) {
  const prefix = `${name}=`;

  return setCookies
    .map((cookie) => cookie.split(';')[0])
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

async function getServerCsrf(baseUrl: string, cookieHeader: string) {
  const response = await fetch(`${baseUrl}/auth/csrf`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ApiError('CSRF 토큰을 발급받지 못했습니다.', response.status, null);
  }

  const setCookies = getSetCookie(response.headers);
  const token =
    getCookieFromSetCookie(setCookies, XSRF_COOKIE) ??
    ((await response.json().catch(() => null)) as { content?: { token?: string } } | null)?.content
      ?.token;

  if (!token) {
    throw new ApiError('CSRF 응답에 토큰이 없습니다.', response.status, null);
  }

  return token;
}
