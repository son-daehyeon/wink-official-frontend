'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import CreateRecruitModal from './ui/modal/create-recruit';
import DeleteRecruitModal from './ui/modal/delete-recruit';

import { Recruit } from '@/entities/recruit';
import { adminQueryOptions } from '@/features/admin';
import { browserApi } from '@/shared/api/client';
import { formatDate } from '@/shared/lib/cn';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';

export default function AdminRecruitPage() {
  const router = useRouter();

  const recruitsQuery = useQuery(adminQueryOptions.recruits(browserApi));

  const [recruitsOverride, setRecruitsOverride] = useState<Recruit[]>();
  const recruits = useMemo(
    () => recruitsOverride ?? recruitsQuery.data?.recruits ?? [],
    [recruitsOverride, recruitsQuery.data?.recruits],
  );
  const [selected, setSelected] = useState<Recruit>();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onCreateRecruit = useCallback(
    (recruit: Recruit) => {
      setRecruitsOverride((prev) => [recruit, ...(prev ?? recruits)]);
      router.push(`/admin/recruit/${recruit.id}/sms`);
    },
    [recruits, router],
  );

  const onDeleteRecruit = useCallback(
    (id: string) => {
      setRecruitsOverride((prev) => (prev ?? recruits).filter((r) => r.id !== id));
    },
    [recruits],
  );

  return (
    <>
      <div className="flex space-x-1 items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <div className="pl-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>관리자 페이지</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>모집</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>모집 목록</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button variant="wink" className="w-fit self-end" onClick={() => setCreateModalOpen(true)}>
          모집 생성
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[60px]">년도</TableHead>
              <TableHead className="min-w-[60px]">학기</TableHead>
              <TableHead className="min-w-[350px]">모집 기간</TableHead>
              <TableHead className="min-w-[350px]">면접 기간</TableHead>
              <TableHead className="w-[75px]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruitsQuery.isPending ? (
              Array.from({ length: 10 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="w-[60px] h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[60px] h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[350px] h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[350px] h-4" />
                  </TableCell>
                </TableRow>
              ))
            ) : recruits.length > 0 ? (
              recruits!.map((recruit) => (
                <TableRow
                  key={recruit.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/recruit/${recruit.id}`)}
                >
                  <TableCell>{recruit.year}</TableCell>
                  <TableCell>{recruit.semester}</TableCell>
                  <TableCell>
                    {formatDate(recruit.recruitStartDate, true)} ~{' '}
                    {formatDate(recruit.recruitEndDate, true)}
                  </TableCell>
                  <TableCell>
                    {formatDate(recruit.interviewStartDate, true)} ~{' '}
                    {formatDate(recruit.interviewEndDate, true)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-8 h-8">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();

                            router.push(`/admin/recruit/${recruit.id}/sms`);
                          }}
                        >
                          안내 문자 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelected(recruit);
                            setDeleteModalOpen(true);
                          }}
                        >
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-neutral-500">
                  모집이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateRecruitModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        callback={onCreateRecruit}
      />

      <DeleteRecruitModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        recruit={selected}
        callback={onDeleteRecruit}
      />
    </>
  );
}
