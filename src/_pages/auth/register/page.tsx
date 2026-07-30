import { redirect } from 'next/navigation';

import RegisterClient from './register-client';

interface AuthRegisterPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function AuthRegisterPage({ searchParams }: AuthRegisterPageProps) {
  const { token = '' } = await searchParams;

  if (token && token.length <= 512) {
    redirect(`/auth/register#token=${encodeURIComponent(token)}`);
  }

  return <RegisterClient />;
}
