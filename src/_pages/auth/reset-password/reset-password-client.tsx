'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Loading from '../../loading';

import { ResetPasswordRequest, ResetPasswordRequestSchema } from '@/features/auth';
import { useResetPasswordMutation } from '@/features/auth';
import { authQueryOptions } from '@/features/auth';
import { browserApi } from '@/shared/api/client';
import { consumeFragmentToken } from '@/shared/lib/consume-fragment-token';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ResetPasswordClient() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [isApi2, startApi2] = useApiWithToast();
  const resetPassword = useResetPasswordMutation();

  const { data, isPending } = useQuery(
    authQueryOptions.resetPasswordCheck(browserApi, token ?? ''),
  );

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    mode: 'onChange',
    defaultValues: {
      token: '',
      newPassword: '',
    },
  });

  const onSubmit = useCallback(
    (values: ResetPasswordRequest) => {
      startApi2(
        async () => {
          await resetPassword.mutateAsync(values);
          router.push('/auth/login');
        },
        {
          loading: '비밀번호를 변경하고 있습니다',
          success: '비밀번호를 변경했습니다.',
        },
      );
    },
    [resetPassword, router, startApi2],
  );

  useEffect(() => {
    setToken(consumeFragmentToken());
  }, []);

  useEffect(() => {
    form.setValue('token', token ?? '');
  }, [form, token]);

  useEffect(() => {
    if (token === null || (token && (isPending || !data))) return;
    if (data?.isValid) return;

    toast.error('잘못된 접근입니다.');
    router.replace('/');
  }, [data, isPending, router, token]);

  if (token === null || isPending) return <Loading />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-[300px] space-y-4 items-center justify-center"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>새로운 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="새로운 비밀번호를 입력해주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="wink" type="submit" disabled={isApi2} className="w-full">
          비밀번호 변경
        </Button>
      </form>
    </Form>
  );
}
