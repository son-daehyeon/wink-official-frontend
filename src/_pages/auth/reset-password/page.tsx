import { redirect } from 'next/navigation';

import ResetPasswordClient from './reset-password-client';

interface AuthResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function AuthResetPasswordPage({ searchParams }: AuthResetPasswordPageProps) {
  const { token = '' } = await searchParams;

  if (token && token.length <= 512) {
    redirect(`/auth/reset-password#token=${encodeURIComponent(token)}`);
  }

  return <ResetPasswordClient />;
}
