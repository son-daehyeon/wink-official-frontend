'use client';

import { useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { SCOPE_MAP } from '../config/scope-map';

import { useApplicationQuery, useOauthLoginMutation } from '@/features/application';
import { useUserStore } from '@/features/user';
import { useApi } from '@/shared/lib/hooks/use-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PageLoading } from '@/shared/ui/page-loading';
import { Separator } from '@/shared/ui/separator';
import { parseAsString, useQueryState } from 'nuqs';
import { toast } from 'sonner';

interface OauthLoginClientProps {
  id: string;
}

export default function OauthLoginClient({ id }: OauthLoginClientProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const [callback] = useQueryState('callback', parseAsString.withDefault(''));
  const [isApi, startApi] = useApi();
  const { data, isPending } = useApplicationQuery(id);
  const oauthLogin = useOauthLoginMutation();
  const application = data?.application;

  const onLogin = useCallback(() => {
    if (!application) return;

    startApi(async () => {
      const { token } = await oauthLogin.mutateAsync(application.id);
      const redirectUrl = new URL(callback);
      redirectUrl.searchParams.set('token', token);
      window.location.assign(redirectUrl.toString());
    });
  }, [application, callback, oauthLogin, startApi]);

  useEffect(() => {
    if (!application) return;

    if (!application.login.enable) {
      toast.error('이 애플리케이션은 로그인 기능을 지원하지 않습니다.');
      router.replace('/');
      return;
    }

    if (!callback || !application.login.urls.includes(callback)) {
      toast.error('잘못된 콜백 URL입니다.');
      router.replace('/');
    }
  }, [application, callback, router]);

  if (isPending || !application || !user) return <PageLoading />;

  return (
    <div className="flex flex-col items-center px-6 pt-20 sm:pt-28 space-y-10">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 rounded">
          <AvatarImage src={application.img} alt={application.name} />
          <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <p className="text-2xl sm:text-3xl font-bold">{application.name}</p>
      </div>

      <Separator className="sm:max-w-[500px]" />

      <div className="flex flex-col items-center space-y-2">
        <p className="sm:text-lg font-semibold">현재 로그인된 계정</p>
        <p className="flex gap-0.5 items-center">
          {user.name}
          <span className="text-sm text-neutral-500 italic">({user.studentId})</span>
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <p className="sm:text-lg font-semibold">제공하는 정보</p>

        <div className="flex flex-col items-center space-y-2">
          {application.login.scopes
            .map((scope) => SCOPE_MAP.find((item) => item.value === scope))
            .filter((scope) => scope !== undefined)
            .map((scope) => {
              const Icon = scope.icon;

              return (
                <div key={scope.name} className="flex space-x-2">
                  <Icon size={20} />
                  <p>{scope.name}</p>
                </div>
              );
            })}
        </div>
      </div>

      <Separator className="sm:max-w-[500px]" />

      <Button variant="wink" disabled={isApi} onClick={onLogin}>
        계속하기
      </Button>
    </div>
  );
}
