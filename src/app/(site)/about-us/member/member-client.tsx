'use client';

import { useMemo } from 'react';

import Cloud from './ui/cloud';
import UserList from './ui/user-list';

import { PublicUser, Role } from '@/entities/user';
import { useUsersQuery } from '@/features/program';
import { useUserStore } from '@/features/user';
import { Separator } from '@/shared/ui/separator';

export default function AboutUsMemberClient() {
  const { user } = useUserStore();
  const { data, isLoading } = useUsersQuery();

  const users = useMemo(
    () => (data?.users ?? []).map((u) => (u.id === user?.id ? { ...u, ...user } : u)),
    [data?.users, user],
  );

  const leaders: PublicUser[] = useMemo(
    () => users.filter((user) => user.role === Role.PRESIDENT || user.role === Role.VICE_PRESIDENT),
    [users],
  );

  const treasuries: PublicUser[] = useMemo(
    () =>
      users.filter(
        (user) => user.role === Role.TREASURY_HEAD || user.role === Role.TREASURY_ASSISTANT,
      ),
    [users],
  );

  const publicRelations: PublicUser[] = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === Role.PUBLIC_RELATIONS_HEAD || user.role === Role.PUBLIC_RELATIONS_ASSISTANT,
      ),
    [users],
  );

  const plannings: PublicUser[] = useMemo(
    () =>
      users.filter(
        (user) => user.role === Role.PLANNING_HEAD || user.role === Role.PLANNING_ASSISTANT,
      ),
    [users],
  );

  const techs: PublicUser[] = useMemo(
    () => users.filter((user) => user.role === Role.TECH_HEAD || user.role === Role.TECH_ASSISTANT),
    [users],
  );

  const members: PublicUser[] = useMemo(
    () => users.filter((user) => user.role === Role.MEMBER),
    [users],
  );

  return (
    <div className="flex flex-col items-center px-6 pt-20 sm:pt-28 space-y-10">
      <Cloud className="flex flex-col items-center">
        <p className="text-4xl sm:text-7xl font-bold font-roboto text-center text-wink-200">
          NEW WAVE IN US
        </p>

        <p className="sm:text-3xl italic font-thin font-roboto text-center text-wink-500">
          Introduction of WINK team members
        </p>
      </Cloud>

      <div className="hidden md:block">
        <UserList
          role="회장단"
          description="전체 동아리 운영 기획 및 각 부서 업무 참여"
          users={leaders}
          direction="row"
          skeleton={2}
          loading={isLoading}
        />
      </div>

      <div className="block md:hidden">
        <UserList
          role="회장단"
          description="전체 동아리 운영 기획 및 각 부서 업무 참여"
          users={leaders}
          direction="col"
          skeleton={2}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 items-start">
        <UserList
          role="총무부"
          description="비품 및 회의 관리, 도서 신청 및 대출 관리"
          users={treasuries}
          direction="col"
          skeleton={2}
          loading={isLoading}
        />

        <UserList
          role="학술부"
          description="동아리 학술 담당"
          users={techs}
          direction="col"
          skeleton={2}
          loading={isLoading}
        />

        <UserList
          role="홍보부"
          description="동아리 홍보 및 홍보물 제작, SNS 관리"
          users={publicRelations}
          direction="col"
          skeleton={2}
          loading={isLoading}
        />

        <UserList
          role="기획부"
          description="동아리 활동 기획 및 활동 정리"
          users={plannings}
          direction="col"
          skeleton={2}
          loading={isLoading}
        />
      </div>

      <Separator />

      <UserList users={members} direction="row" skeleton={8} loading={isLoading} />
    </div>
  );
}
