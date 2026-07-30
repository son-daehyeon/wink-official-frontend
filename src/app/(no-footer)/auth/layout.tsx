import { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { getServerCurrentUser } from '@/features/user/server';

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  if (await getServerCurrentUser()) {
    redirect('/');
  }

  return children;
}
