export const ORIGINAL_REQUEST_TARGET_HEADER = 'x-wink-original-request-target';

export function createLoginRedirect(target: string | null, fallback: string) {
  const safeTarget = sanitizeInternalTarget(target, fallback);
  const searchParams = new URLSearchParams({ next: safeTarget });

  return `/auth/login?${searchParams.toString()}`;
}

function sanitizeInternalTarget(target: string | null, fallback: string) {
  if (!target?.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback;
  }

  try {
    const base = new URL('https://wink.internal');
    const resolved = new URL(target, base);

    if (resolved.origin !== base.origin) {
      return fallback;
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
