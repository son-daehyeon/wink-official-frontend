import { ReactNode } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getServerCurrentUser } from '@/features/user/server';
import { ORIGINAL_REQUEST_TARGET_HEADER, createLoginRedirect } from '@/shared/lib/auth-redirect';

interface ApplicationLayoutProps {
  children: ReactNode;
}

export default async function ApplicationLayout({ children }: ApplicationLayoutProps) {
  const [user, requestHeaders] = await Promise.all([getServerCurrentUser(), headers()]);

  if (!user) {
    redirect(
      createLoginRedirect(requestHeaders.get(ORIGINAL_REQUEST_TARGET_HEADER), '/application'),
    );
  }

  return children;
}
