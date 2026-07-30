import { NextRequest } from 'next/server';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import 'server-only';

export const PROXY_CLIENT_CONTEXT_HEADER = 'x-wink-client-context';
export const TRUSTED_INGRESS_HEADER = 'x-wink-trusted-ingress';

const KEY_BYTES = 32;

export function createSignedClientContext(request: NextRequest) {
  const key = decodeKey('RECRUIT_PROXY_CLIENT_HMAC_KEY');
  const address = getClientAddress(request);
  const encodedAddress = Buffer.from(address, 'utf8').toString('base64url');
  const signature = createHmac('sha256', key).update(address, 'utf8').digest('base64url');
  return `${encodedAddress}.${signature}`;
}

function getClientAddress(request: NextRequest) {
  const encodedIngressToken = process.env.RECRUIT_TRUSTED_INGRESS_TOKEN;
  const configuredHops = process.env.RECRUIT_TRUSTED_PROXY_HOPS;

  if (process.env.NODE_ENV !== 'production' && !encodedIngressToken && !configuredHops) {
    return '127.0.0.1';
  }

  if (process.env.VERCEL === '1') {
    return getVercelClientAddress(request);
  }

  const expectedIngressToken = decodeKey('RECRUIT_TRUSTED_INGRESS_TOKEN');
  const suppliedIngressToken = decodeBase64(request.headers.get(TRUSTED_INGRESS_HEADER) ?? '');
  if (
    suppliedIngressToken.byteLength !== expectedIngressToken.byteLength ||
    !timingSafeEqual(suppliedIngressToken, expectedIngressToken)
  ) {
    throw new Error('Request did not arrive through the trusted ingress');
  }

  const trustedProxyHops = Number(configuredHops);
  if (!Number.isSafeInteger(trustedProxyHops) || trustedProxyHops < 1 || trustedProxyHops > 10) {
    throw new Error('RECRUIT_TRUSTED_PROXY_HOPS must be an integer between 1 and 10');
  }

  const forwardedFor = request.headers
    .get('x-forwarded-for')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const address = forwardedFor?.at(-trustedProxyHops);
  if (!address || isIP(address) === 0) {
    throw new Error('Trusted ingress did not provide a valid client address');
  }

  return address;
}

function getVercelClientAddress(request: NextRequest) {
  const vercelForwardedFor = parseSingleClientAddress(
    request.headers.get('x-vercel-forwarded-for'),
    'x-vercel-forwarded-for',
  );
  const forwardedFor = parseSingleClientAddress(
    request.headers.get('x-forwarded-for'),
    'x-forwarded-for',
  );

  if (vercelForwardedFor && forwardedFor && vercelForwardedFor !== forwardedFor) {
    throw new Error('Vercel forwarded client address headers did not match');
  }

  const address = vercelForwardedFor ?? forwardedFor;
  if (!address) {
    throw new Error('Vercel did not provide a client address');
  }

  return address;
}

function parseSingleClientAddress(value: string | null, headerName: string) {
  if (!value) {
    return undefined;
  }

  const addresses = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (addresses.length !== 1 || isIP(addresses[0]) === 0) {
    throw new Error(`${headerName} must contain exactly one valid client address`);
  }

  return addresses[0];
}

function decodeKey(name: 'RECRUIT_PROXY_CLIENT_HMAC_KEY' | 'RECRUIT_TRUSTED_INGRESS_TOKEN') {
  const encodedKey = process.env[name];
  if (!encodedKey) {
    throw new Error(`${name} must be configured`);
  }

  const key = decodeBase64(encodedKey);
  if (key.byteLength !== KEY_BYTES) {
    throw new Error(`${name} must decode to exactly ${KEY_BYTES} bytes`);
  }
  return key;
}

function decodeBase64(value: string) {
  try {
    return Buffer.from(value, 'base64');
  } catch {
    return Buffer.alloc(0);
  }
}
