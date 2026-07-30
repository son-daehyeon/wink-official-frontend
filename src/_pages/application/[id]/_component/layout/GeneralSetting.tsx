import React, { useCallback, useState } from 'react';

import { Application } from '@/entities/application';
import { useResetApplicationSecretMutation } from '@/features/application';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

interface GeneralSettingProps {
  application: Application;
}

export default function GeneralSetting({ application }: GeneralSettingProps) {
  const [isApi, startApi] = useApiWithToast();
  const resetApplicationSecret = useResetApplicationSecretMutation();

  const [clientSecretVisible, setClientSecretVisible] = useState(false);

  const resetSecret = useCallback(async () => {
    if (!application) return;

    startApi(() => resetApplicationSecret.mutateAsync(application.id), {
      loading: '애플리케이션 시크릿 값을 재발급받고 있습니다.',
      success: '애플리케이션 시크릿 값을 재발급받았습니다.',
    });
  }, [application, resetApplicationSecret, startApi]);

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-lg sm:text-2xl font-medium">일반</p>

      <div className="w-full max-w-[450px]">
        <Label htmlFor="client-id">클라이언트 아이디</Label>
        <Input
          id="client-id"
          value={application.id}
          readOnly
          onFocus={() => {
            if ('clipboard' in navigator) {
              navigator.clipboard.writeText(application.id);
              toast.info('클라이언트 아이디를 복사했습니다.');
            }
          }}
        />
      </div>

      <div className="flex space-x-2 items-end">
        <div className="w-full max-w-[450px]">
          <Label htmlFor="client-secret">클라이언트 시크릿</Label>
          <Input
            id="client-secret"
            value={application.secret}
            readOnly
            type={clientSecretVisible ? 'text' : 'password'}
            onFocus={() => {
              setClientSecretVisible(true);

              if ('clipboard' in navigator) {
                navigator.clipboard.writeText(application.secret);
                toast.info('클라이언트 시크릿을 복사했습니다.');
              }
            }}
            onBlur={() => setClientSecretVisible(false)}
          />
        </div>

        <Button disabled={isApi} onClick={resetSecret}>
          재발급
        </Button>
      </div>
    </div>
  );
}
