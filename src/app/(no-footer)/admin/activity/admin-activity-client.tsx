'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import CreateActivityModal from './ui/modal/create-activity';
import DeleteActivityModal from './ui/modal/delete-activity';
import UpdateActivityModal from './ui/modal/update-activity';

import { Activity } from '@/entities/program';
import { pinAdminActivity, unpinAdminActivity } from '@/features/admin';
import { adminQueryOptions } from '@/features/admin';
import { browserApi } from '@/shared/api/client';
import { formatDate } from '@/shared/lib/cn';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import Page from '@/shared/model/page';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export default function AdminActivityPage() {
  const [isPinApi, startPinApi] = useApiWithToast();

  const [query, setQuery] = useQueryState('query', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));

  const activitiesQuery = useQuery(adminQueryOptions.activities(browserApi, page, query));
  const [activitiesOverride, setActivitiesOverride] = useState<Page<Activity>>();
  const activities = activitiesOverride ?? activitiesQuery.data?.activities;
  const [selected, setSelected] = useState<Activity>();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const pin = useCallback(
    async (activity: Activity) =>
      startPinApi(
        async () => {
          const { activity: _activity } = await pinAdminActivity(activity.id);
          setActivitiesOverride((prev) => {
            const current = prev ?? activities;
            if (!current) return undefined;
            return {
              ...current,
              content: current.content.map((a) => (a.id === _activity.id ? _activity : a)),
            };
          });
        },
        {
          loading: '활동을 고정하고 있습니다.',
          success: '활동을 고정했습니다.',
        },
      ),
    [activities, startPinApi],
  );

  const unpin = useCallback(
    async (activity: Activity) =>
      startPinApi(
        async () => {
          const { activity: _activity } = await unpinAdminActivity(activity.id);
          setActivitiesOverride((prev) => {
            const current = prev ?? activities;
            if (!current) return undefined;
            return {
              ...current,
              content: current.content.map((a) => (a.id === _activity.id ? _activity : a)),
            };
          });
        },
        {
          loading: '활동 고정을 풀고있습니다.',
          success: '활동 고정을 풀었습니다.',
        },
      ),
    [activities, startPinApi],
  );

  const onCreateActivity = useCallback(
    (activity: Activity) => {
      setActivitiesOverride((prev) => {
        const current = prev ?? activities;
        if (!current) return undefined;
        return { ...current, content: [activity, ...current.content] };
      });
    },
    [activities],
  );

  const onUpdateActivity = useCallback(
    (activity: Activity) => {
      setActivitiesOverride((prev) => {
        const current = prev ?? activities;
        if (!current) return undefined;
        return {
          ...current,
          content: current.content.map((a) => (a.id === activity.id ? activity : a)),
        };
      });
    },
    [activities],
  );

  const onDeleteActivity = useCallback(
    (id: string) => {
      setActivitiesOverride((prev) => {
        const current = prev ?? activities;
        if (!current) return undefined;
        return {
          ...current,
          content: current.content.filter((a) => a.id !== id),
        };
      });
    },
    [activities],
  );

  const pageIndex = useMemo(() => {
    if (!activities) return [];

    if (activities.page.totalPages <= 5) {
      return Array.from({ length: activities.page.totalPages }, (_, index) => index);
    }

    const start =
      page === 0 || page === 1
        ? 0
        : page === activities.page.totalPages - 1 || page === activities.page.totalPages - 2
          ? activities.page.totalPages - 5
          : page - 2;

    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [page, activities]);

  useEffect(() => {
    setActivitiesOverride(undefined);
  }, [page, query]);

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
                <BreadcrumbLink>활동</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>활동 목록</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2">
          <Input
            placeholder="검색어를 입력해주세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />

          <Button variant="wink" onClick={() => setCreateModalOpen(true)}>
            활동 생성
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">핀</TableHead>
              <TableHead className="min-w-[220px]">제목</TableHead>
              <TableHead className="min-w-[220px]">생성 날짜</TableHead>
              <TableHead className="w-[75px]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesQuery.isPending ? (
              Array.from({ length: 10 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell />
                  <TableCell>
                    <Skeleton className="w-[220px] h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-[220px] h-4" />
                  </TableCell>
                </TableRow>
              ))
            ) : activities && activities.content.length > 0 ? (
              activities!.content.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Checkbox
                      checked={activity.pinned}
                      disabled={isPinApi}
                      onCheckedChange={() => (activity.pinned ? unpin(activity) : pin(activity))}
                    />
                  </TableCell>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>{formatDate(activity.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-8 h-8">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(activity);
                            setUpdateModalOpen(true);
                          }}
                        >
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(activity);
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
                <TableCell colSpan={4} className="text-center text-neutral-500">
                  활동이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!activitiesQuery.isPending && activities && activities.page.totalPages > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={activities.page.number > 0 ? 'cursor-pointer' : 'cursor-default'}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                />
              </PaginationItem>

              {pageIndex.map((index) => {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className={
                        index === activities.page.number ? 'cursor-default' : 'cursor-pointer'
                      }
                      onClick={() => setPage(index)}
                      isActive={index === activities.page.number}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  className={
                    activities.page.number < activities.page.totalPages - 1
                      ? 'cursor-pointer'
                      : 'cursor-default'
                  }
                  onClick={() =>
                    setPage((prev) => Math.min(activities.page.totalPages - 1, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <CreateActivityModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        callback={onCreateActivity}
      />

      <UpdateActivityModal
        open={updateModalOpen}
        setOpen={setUpdateModalOpen}
        activity={selected}
        callback={onUpdateActivity}
      />

      <DeleteActivityModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        activity={selected}
        callback={onDeleteActivity}
      />
    </>
  );
}
