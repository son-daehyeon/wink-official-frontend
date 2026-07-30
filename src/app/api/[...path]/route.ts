import { NextRequest } from 'next/server';

import {
  PROXY_CLIENT_CONTEXT_HEADER,
  TRUSTED_INGRESS_HEADER,
  createSignedClientContext,
} from '@/shared/api/proxy-client-context';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const FORWARDED_HEADERS = [
  'forwarded',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-port',
  'x-forwarded-proto',
];

const MAX_PROXY_BODY_BYTES = 1024 * 1024;
const VALID_HEADER_TOKEN = /^[!#$%&'*+\-.^_`|~0-9a-z]+$/;

class RequestBodyTooLargeError extends Error {}

function getApiBaseUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:8080'
  ).replace(/\/$/, '');
}

function copyRequestHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);

  stripHopByHopHeaders(headers);
  for (const header of FORWARDED_HEADERS) {
    headers.delete(header);
  }

  headers.delete('host');
  headers.delete('content-length');
  headers.delete(PROXY_CLIENT_CONTEXT_HEADER);
  headers.delete(TRUSTED_INGRESS_HEADER);
  headers.set('accept-encoding', 'identity');
  headers.set(PROXY_CLIENT_CONTEXT_HEADER, createSignedClientContext(request));

  return headers;
}

function copyResponseHeaders(response: Response) {
  const headers = new Headers(response.headers);
  const setCookies = response.headers.getSetCookie();

  stripHopByHopHeaders(headers);

  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('set-cookie');
  for (const cookie of setCookies) {
    headers.append('set-cookie', cookie);
  }

  return headers;
}

function stripHopByHopHeaders(headers: Headers) {
  const connectionTokens =
    headers
      .get('connection')
      ?.split(',')
      .map((token) => token.trim().toLowerCase())
      .filter((token) => VALID_HEADER_TOKEN.test(token)) ?? [];

  for (const header of [...HOP_BY_HOP_HEADERS, ...connectionTokens]) {
    headers.delete(header);
  }
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const upstreamUrl = new URL(`${getApiBaseUrl()}/${path.map(encodeURIComponent).join('/')}`);
  upstreamUrl.search = request.nextUrl.search;

  const method = request.method.toUpperCase();
  let body: ArrayBuffer | undefined;
  try {
    body = method === 'GET' || method === 'HEAD' ? undefined : await readRequestBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return new Response(null, { status: 413 });
    }
    throw error;
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers: copyRequestHeaders(request),
    body,
    cache: 'no-store',
    redirect: 'manual',
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyResponseHeaders(upstreamResponse),
  });
}

async function readRequestBody(request: NextRequest) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PROXY_BODY_BYTES) {
    throw new RequestBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) return undefined;

  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    receivedBytes += value.byteLength;
    if (receivedBytes > MAX_PROXY_BODY_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
