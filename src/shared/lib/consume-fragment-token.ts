'use client';

const MAX_TOKEN_LENGTH = 512;

export function consumeFragmentToken(): string {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  const token = fragment.get('token') ?? query.get('token') ?? '';

  window.history.replaceState(window.history.state, '', window.location.pathname);

  return token.length <= MAX_TOKEN_LENGTH ? token : '';
}
