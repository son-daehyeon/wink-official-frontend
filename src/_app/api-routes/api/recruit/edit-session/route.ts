import { NextRequest, NextResponse } from 'next/server';

import {
  PROXY_CLIENT_CONTEXT_HEADER,
  createSignedClientContext,
} from '@/shared/api/proxy-client-context';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const EDIT_SESSION_COOKIE = 'WINK_RECRUIT_EDIT_TOKEN';
const EDIT_SESSION_COOKIE_PATH = '/api/recruit/edit-session';
const EDIT_SESSION_MAX_AGE_SECONDS = 2 * 60 * 60;
const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'X-XSRF-TOKEN';
const TOKEN_EXPRESSION = /^[A-Za-z0-9]{64,256}$/;
const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, no-cache, max-age=0, must-revalidate',
  Expires: '0',
  Pragma: 'no-cache',
  Vary: 'Cookie, Origin',
};

class InvalidBodyError extends Error {
  public constructor(public readonly status: number) {
    super('Invalid request body');
  }
}

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

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      content: null,
    },
    {
      status,
      headers: NO_STORE_HEADERS,
    },
  );
}

function noContentResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: NO_STORE_HEADERS,
  });
}

async function readJsonBody(request: NextRequest, maxBytes: number) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new InvalidBodyError(413);
  }

  const reader = request.body?.getReader();
  if (!reader) {
    throw new InvalidBodyError(400);
  }

  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    receivedBytes += value.byteLength;
    if (receivedBytes > maxBytes) {
      await reader.cancel();
      throw new InvalidBodyError(413);
    }

    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new InvalidBodyError(400);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizePayload(value: unknown, editToken: string): unknown {
  if (typeof value === 'string') {
    return value.includes(editToken) ? value.replaceAll(editToken, '[REDACTED]') : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item, editToken));
  }

  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key.replaceAll(/[^a-z]/gi, '').toLowerCase() !== 'edittoken')
      .map(([key, item]) => [key, sanitizePayload(item, editToken)]),
  );
}

async function getCsrfHeaders() {
  const csrfResponse = await fetch(`${getApiBaseUrl()}/auth/csrf`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    redirect: 'manual',
  });

  if (!csrfResponse.ok) {
    throw new Error('CSRF request failed');
  }

  const setCookies = getSetCookie(csrfResponse.headers);
  const csrfToken =
    getCookieFromSetCookie(setCookies, XSRF_COOKIE) ??
    ((await csrfResponse.json().catch(() => null)) as { content?: { token?: string } } | null)
      ?.content?.token;

  if (!csrfToken) {
    throw new Error('CSRF token missing');
  }

  const cookiePairs = setCookies.map((cookie) => cookie.split(';')[0]).filter(Boolean);

  if (!cookiePairs.some((cookie) => cookie.startsWith(`${XSRF_COOKIE}=`))) {
    cookiePairs.push(`${XSRF_COOKIE}=${csrfToken}`);
  }

  return {
    Cookie: cookiePairs.join('; '),
    [XSRF_HEADER]: decodeCookieValue(csrfToken),
  };
}

async function postUpstream(request: NextRequest, path: string, body: Record<string, unknown>) {
  const csrfHeaders = await getCsrfHeaders();

  return fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      [PROXY_CLIENT_CONTEXT_HEADER]: createSignedClientContext(request),
      ...csrfHeaders,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
    redirect: 'manual',
  });
}

async function toSafeUpstreamResponse(
  upstreamResponse: Response,
  editToken: string,
  fallbackError: string,
) {
  if (!upstreamResponse.ok) {
    return errorResponse(fallbackError, upstreamResponse.status);
  }

  if (upstreamResponse.status === 204) {
    return noContentResponse();
  }

  const payload = (await upstreamResponse.json().catch(() => null)) as unknown;

  if (payload === null) {
    return errorResponse('서버 응답을 확인하지 못했습니다.', 502);
  }

  return NextResponse.json(sanitizePayload(payload, editToken), {
    status: upstreamResponse.status,
    headers: NO_STORE_HEADERS,
  });
}

function setEditSessionCookie(response: NextResponse, editToken: string, maxAge: number) {
  response.cookies.set(EDIT_SESSION_COOKIE, editToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: EDIT_SESSION_COOKIE_PATH,
  });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse('허용되지 않은 요청입니다.', 403);
  }

  try {
    const body = await readJsonBody(request, 2_048);
    const editToken = isRecord(body) && typeof body.token === 'string' ? body.token.trim() : '';

    if (!TOKEN_EXPRESSION.test(editToken)) {
      return errorResponse('지원서 수정 링크가 올바르지 않습니다.', 400);
    }

    const upstreamResponse = await postUpstream(request, '/recruit/edit-session', {
      editToken,
    });
    const response = await toSafeUpstreamResponse(
      upstreamResponse,
      editToken,
      '지원서 수정 링크가 만료되었거나 올바르지 않습니다.',
    );

    if (upstreamResponse.ok) {
      setEditSessionCookie(response, editToken, EDIT_SESSION_MAX_AGE_SECONDS);
    }

    return response;
  } catch (error) {
    if (error instanceof InvalidBodyError) {
      return errorResponse('요청 형식이 올바르지 않습니다.', error.status);
    }

    return errorResponse('지원서 수정 세션을 시작하지 못했습니다.', 502);
  }
}

export async function GET(request: NextRequest) {
  const editToken = request.cookies.get(EDIT_SESSION_COOKIE)?.value ?? '';

  if (!TOKEN_EXPRESSION.test(editToken)) {
    return errorResponse('지원서 수정 세션이 만료되었습니다.', 401);
  }

  try {
    const upstreamResponse = await postUpstream(request, '/recruit/edit-session', {
      editToken,
    });

    return toSafeUpstreamResponse(
      upstreamResponse,
      editToken,
      '지원서 수정 정보를 불러오지 못했습니다.',
    );
  } catch {
    return errorResponse('지원서 수정 정보를 불러오지 못했습니다.', 502);
  }
}

export async function PUT(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse('허용되지 않은 요청입니다.', 403);
  }

  const editToken = request.cookies.get(EDIT_SESSION_COOKIE)?.value ?? '';

  if (!TOKEN_EXPRESSION.test(editToken)) {
    return errorResponse('지원서 수정 세션이 만료되었습니다.', 401);
  }

  try {
    const form = await readJsonBody(request, 128 * 1_024);

    if (!isRecord(form)) {
      return errorResponse('지원서 형식이 올바르지 않습니다.', 400);
    }

    const upstreamResponse = await postUpstream(request, '/recruit/edit-session/form', {
      editToken,
      form,
    });

    return toSafeUpstreamResponse(upstreamResponse, editToken, '지원서를 수정하지 못했습니다.');
  } catch (error) {
    if (error instanceof InvalidBodyError) {
      return errorResponse('요청 형식이 올바르지 않습니다.', error.status);
    }

    return errorResponse('지원서를 수정하지 못했습니다.', 502);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse('허용되지 않은 요청입니다.', 403);
  }

  const response = noContentResponse();
  setEditSessionCookie(response, '', 0);
  return response;
}
