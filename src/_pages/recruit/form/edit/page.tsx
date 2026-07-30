import { redirect } from 'next/navigation';

import RecruitFormEditClient from './recruit-form-edit-client';

interface RecruitApplicationEditPageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

export default async function RecruitApplicationEditPage({
  searchParams,
}: RecruitApplicationEditPageProps) {
  const { token: rawToken } = await searchParams;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  if (token) {
    redirect(`/recruit/form/edit#token=${encodeURIComponent(token)}`);
  }

  return <RecruitFormEditClient />;
}
