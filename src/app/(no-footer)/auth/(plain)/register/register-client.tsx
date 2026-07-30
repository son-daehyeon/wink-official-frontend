'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import RegisterModal from './ui/modal/register-modal';

import { authQueryOptions } from '@/features/auth';
import { browserApi } from '@/shared/api/client';
import { consumeFragmentToken } from '@/shared/lib/consume-fragment-token';
import { Button } from '@/shared/ui/button';
import { PageLoading } from '@/shared/ui/page-loading';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/shared/ui/table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function RegisterClient() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const { data, isPending } = useQuery(authQueryOptions.registerCheck(browserApi, token ?? ''));

  const user = data?.isValid ? data.user : undefined;

  useEffect(() => {
    setToken(consumeFragmentToken());
  }, []);

  useEffect(() => {
    if (token === null || (token && (isPending || !data))) return;
    if (data?.isValid) return;

    toast.error('잘못된 접근입니다.');
    router.replace('/');
  }, [data, isPending, router, token]);

  if (token === null || isPending || !user) return <PageLoading />;

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium">사용자 정보 확인</p>
          <p className="text-sm text-neutral-500">아래 정보가 올바른지 확인해주세요.</p>
        </div>

        <Table className="w-full max-w-[300px] sm:max-w-[600px]">
          <TableBody>
            <TableRow>
              <TableHead className="min-w-[85px]">이름</TableHead>
              <TableCell>{user.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="min-w-[85px]">학번</TableHead>
              <TableCell>{user.studentId}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="min-w-[85px]">학부(과)</TableHead>
              <TableCell>{user.department}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="min-w-[85px]">이메일</TableHead>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="min-w-[85px]">전화번호</TableHead>
              <TableCell>{user.phoneNumber}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex space-x-4">
          <Button
            variant="destructive"
            onClick={() => {
              toast.error('임원진에게 문의해주세요.');
              router.push('/');
            }}
          >
            수정이 필요해요
          </Button>

          <Button variant="wink" onClick={() => setRegisterModalOpen(true)}>
            다음으로
          </Button>
        </div>
      </div>

      <RegisterModal open={registerModalOpen} setOpen={setRegisterModalOpen} token={token} />
    </>
  );
}
