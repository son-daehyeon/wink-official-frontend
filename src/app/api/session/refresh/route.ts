import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ACCESS_COOKIE = 'WINK_ACCESS_TOKEN';
const REFRESH_COOKIE = 'WINK_REFRESH_TOKEN';
const REFRESH_ATTEMPT_COOKIE = 'WINK_REFRESH_ATTEMPTED';
const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'X-XSRF-TOKEN';

function getApiBaseUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:8080'
  ).replace(/\/$/, '');
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

function sanitizeNext(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get('next') ?? '/';

  if (!rawNext.startsWith('/') || rawNext.startsWith('//') || rawNext.includes('\\')) {
    return '/';
  }

  try {
    const nextUrl = new URL(rawNext, request.nextUrl.origin);

    if (nextUrl.origin !== request.nextUrl.origin) {
      return '/';
    }

    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  } catch {
    return '/';
  }
}

function redirectWithAttemptCookie(request: NextRequest) {
  const response = new NextResponse(null, {
    status: 307,
    headers: {
      location: sanitizeNext(request),
    },
  });
  response.cookies.set(REFRESH_ATTEMPT_COOKIE, '1', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    maxAge: 10,
    path: '/',
  });

  return response;
}

function redirectClearingSession(request: NextRequest) {
  const response = redirectWithAttemptCookie(request);

  response.cookies.set(ACCESS_COOKIE, '', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  response.cookies.set(REFRESH_COOKIE, '', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';

  if (!request.cookies.has(REFRESH_COOKIE)) {
    return redirectClearingSession(request);
  }

  try {
    const csrfResponse = await fetch(`${getApiBaseUrl()}/auth/csrf`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!csrfResponse.ok) {
      return redirectClearingSession(request);
    }

    const csrfSetCookies = getSetCookie(csrfResponse.headers);
    const csrfToken =
      getCookieFromSetCookie(csrfSetCookies, XSRF_COOKIE) ??
      ((await csrfResponse.json().catch(() => null)) as { content?: { token?: string } } | null)
        ?.content?.token;

    if (!csrfToken) {
      return redirectClearingSession(request);
    }

    const refreshResponse = await fetch(`${getApiBaseUrl()}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        cookie: `${cookieHeader}; ${XSRF_COOKIE}=${csrfToken}`,
        [XSRF_HEADER]: decodeURIComponent(csrfToken),
      },
      cache: 'no-store',
    });

    if (!refreshResponse.ok) {
      return redirectClearingSession(request);
    }

    const response = redirectWithAttemptCookie(request);

    for (const cookie of [...csrfSetCookies, ...getSetCookie(refreshResponse.headers)]) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  } catch {
    return redirectClearingSession(request);
  }
}
