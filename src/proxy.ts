import { NextRequest, NextResponse } from 'next/server';

import { ORIGINAL_REQUEST_TARGET_HEADER, createLoginRedirect } from '@/shared/lib/auth-redirect';

const ACCESS_COOKIE = 'WINK_ACCESS_TOKEN';
const REFRESH_COOKIE = 'WINK_REFRESH_TOKEN';
const REFRESH_ATTEMPT_COOKIE = 'WINK_REFRESH_ATTEMPTED';
const PROTECTED_ROUTE_FALLBACKS = ['/admin', '/application'];

function shouldAttemptRefresh(request: NextRequest) {
  return (
    !request.cookies.has(ACCESS_COOKIE) &&
    request.cookies.has(REFRESH_COOKIE) &&
    !request.cookies.has(REFRESH_ATTEMPT_COOKIE)
  );
}

function getProtectedRouteFallback(pathname: string) {
  return (
    PROTECTED_ROUTE_FALLBACKS.find(
      (fallback) => pathname === fallback || pathname.startsWith(`${fallback}/`),
    ) ?? null
  );
}

export function proxy(request: NextRequest) {
  const originalTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!shouldAttemptRefresh(request)) {
    const protectedRouteFallback = getProtectedRouteFallback(request.nextUrl.pathname);

    if (protectedRouteFallback && !request.cookies.has(ACCESS_COOKIE)) {
      return NextResponse.redirect(
        new URL(
          createLoginRedirect(originalTarget, protectedRouteFallback),
          request.nextUrl.origin,
        ),
        307,
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(ORIGINAL_REQUEST_TARGET_HEADER, originalTarget);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const refreshUrl = new URL('/api/session/refresh', request.nextUrl.origin);
  refreshUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(refreshUrl, 307);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
