'use client';

import { useCallback, useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/features/auth';
import { LoginRequest, LoginRequestSchema } from '@/features/auth';
import { useLoginMutation } from '@/features/auth';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsString, useQueryState } from 'nuqs';
import Confetti from 'react-confetti';
import { useForm } from 'react-hook-form';

export default function AuthLoginPage() {
  const router = useRouter();

  const { confetti, setConfetti } = useRegisterStore();

  const [isApi, startApi] = useApiWithToast();
  const login = useLoginMutation();

  const [next] = useQueryState('next', parseAsString.withDefault('/'));

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const safeNext = useMemo(() => {
    if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
      return '/';
    }

    return next;
  }, [next]);

  const onSubmit = useCallback(
    (values: LoginRequest) => {
      startApi(
        async () => {
          await login.mutateAsync(values);
          router.replace(safeNext);
        },
        {
          loading: '로그인 중입니다...',
          success: '로그인 완료!',
        },
      );
    },
    [login, router, safeNext, startApi],
  );

  useEffect(() => {
    if (confetti) return;
    setConfetti(false);
  }, [confetti, setConfetti]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full max-w-[300px] space-y-4 items-center justify-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="이메일을 입력해주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호를 입력해주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="wink" type="submit" disabled={isApi} className="w-full">
            로그인
          </Button>

          <Separator />

          <div className="flex space-x-1 text-xs sm:text-sm text-neutral-600">
            <p>비밀번호를 잊으셨나요?</p>
            <Link
              href="/auth/reset-password/request"
              className="underline underline-offset-4 hover:text-neutral-600/90"
            >
              비밀번호 찾기
            </Link>
          </div>
        </form>
      </Form>

      {confetti && <Confetti recycle={false} />}
    </>
  );
}
