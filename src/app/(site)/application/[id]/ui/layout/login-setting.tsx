import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SCOPE_MAP } from '../../config/scope-map';

import { Application, Scope as ApplicationScope } from '@/entities/application';
import { useUpdateApplicationLoginMutation } from '@/features/application';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { URL_EXPRESSION } from '@/shared/lib/validation';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';
import _ from 'lodash';

interface LoginSettingProps {
  application: Application;
}

export default function LoginSetting({ application }: LoginSettingProps) {
  const [isApi, startApi] = useApiWithToast();
  const updateApplicationLogin = useUpdateApplicationLoginMutation();

  const [urls, setUrls] = useState<string[]>(() => application.login.urls);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textareaRef]);

  const onEnableChange = useCallback(
    (application: Application, enable: boolean) => {
      startApi(
        () =>
          updateApplicationLogin.mutateAsync({
            id: application.id,
            body: {
              enable,
              urls: enable ? application.login.urls : [],
              scopes: enable ? application.login.scopes : [ApplicationScope.UUID],
            },
          }),
        {
          loading: `로그인 기능을 ${enable ? '' : '비'}활성화하고 있습니다.`,
          success: `로그인 기능을 ${enable ? '' : '비'}활성화했습니다.`,
        },
      );
    },
    [startApi, updateApplicationLogin],
  );

  const onUrlsChange = useCallback(
    (application: Application) => {
      startApi(
        async () => {
          const _urls = [...new Set(urls)].filter((x) => URL_EXPRESSION.test(x));
          setUrls(_urls);

          if (_.isEqual(_urls, application.login.urls)) return;

          await updateApplicationLogin.mutateAsync({
            id: application.id,
            body: { ...application.login, urls: _urls },
          });
        },
        {
          loading: '콜백 URL을 수정하고 있습니다',
          success: '콜백 URL을 수정했습니다.',
        },
      );
    },
    [startApi, updateApplicationLogin, urls],
  );

  const onScopeChange = useCallback(
    (application: Application, scope: ApplicationScope, value: boolean) => {
      startApi(
        () =>
          updateApplicationLogin.mutateAsync({
            id: application.id,
            body: {
              ...application.login,
              scopes: value
                ? application.login.scopes.includes(scope)
                  ? application.login.scopes
                  : [...application.login.scopes, scope]
                : application.login.scopes.filter((x) => x !== scope),
            },
          }),
        {
          loading: '스코프를 수정하고 있습니다',
          success: '스코프를 수정했습니다.',
        },
      );
    },
    [startApi, updateApplicationLogin],
  );

  useEffect(() => {
    setTimeout(resizeTextarea, 0);
  }, [resizeTextarea, urls]);

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-lg sm:text-2xl font-medium">WINK로 로그인</p>

      <div className="flex items-center space-x-2">
        <Label htmlFor="enable">활성화</Label>
        <Switch
          id="enable"
          disabled={isApi}
          checked={application.login.enable}
          onCheckedChange={(v) => onEnableChange(application, v)}
        />
      </div>

      {application.login.enable && (
        <>
          <div className="flex flex-col space-y-1">
            <p className="text-base sm:text-xl font-medium">필요한 정보</p>
            <div className="flex flex-col sm:grid grid-cols-2 gap-2 max-w-[450px]">
              {SCOPE_MAP.map(({ name, value, disable }) => (
                <div key={name} className="flex items-center space-x-2">
                  <Label className="w-[75px]" htmlFor={`enable-${value}`}>
                    {name}
                  </Label>
                  <Switch
                    id={`enable-${value}`}
                    disabled={disable || isApi}
                    checked={application.login.scopes.includes(value)}
                    onCheckedChange={(v) => onScopeChange(application, value, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[450px]">
            <Label htmlFor="urls">콜백 URL ({application.login.urls.length}개)</Label>
            <Textarea
              id="urls"
              ref={textareaRef}
              disabled={isApi}
              className="resize-none overflow-y-hidden overflow-x-scroll"
              value={urls.join('\n')}
              placeholder="http://localhost:3000/callback/oauth/wink"
              onInput={resizeTextarea}
              onChange={(e) => setUrls(e.target.value.split('\n'))}
              onBlur={() => onUrlsChange(application)}
            />
            <p className="text-sm text-neutral-500">한 줄에 하나의 URL을 입력해주세요.</p>
          </div>
        </>
      )}
    </div>
  );
}
