'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import Loading from '../../../loading';
import FinalizeInterviewModal from './_component/modal/finalize-interview';
import FinalizePaperModal from './_component/modal/finalize-paper';

import { RecruitFormSummary } from '@/entities/recruit';
import { Step } from '@/entities/recruit';
import {
  BackendTechStack,
  DesignTechStack,
  DevOpsTechStack,
  FrontendTechStack,
} from '@/entities/recruit';
import { adminClientQueryOptions } from '@/features/admin';
import { adminKeys } from '@/features/admin';
import { useUpdateInterviewResultMutation, useUpdatePaperResultMutation } from '@/features/admin';
import { adminQueryOptions } from '@/features/admin';
import { browserApi } from '@/shared/api/client';
import { cn, formatDate } from '@/shared/lib/cn';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger, useSidebar } from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/shared/ui/table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileUser, Speech } from 'lucide-react';

interface AdminRecruitDetailClientProps {
  recruitId: string;
}

export default function AdminRecruitDetailClient({ recruitId }: AdminRecruitDetailClientProps) {
  const queryClient = useQueryClient();
  const recruitQuery = useQuery(adminQueryOptions.recruit(browserApi, recruitId));
  const formsQuery = useQuery(adminQueryOptions.recruitForms(browserApi, recruitId));
  const paperMutation = useUpdatePaperResultMutation(recruitId);
  const interviewMutation = useUpdateInterviewResultMutation(recruitId);
  const isApi = recruitQuery.isPending || formsQuery.isPending;

  const { state } = useSidebar();

  const [query, setQuery] = useState('');

  const recruit = recruitQuery.data?.recruit;
  const forms = useMemo(() => formsQuery.data?.forms ?? [], [formsQuery.data?.forms]);
  const [selectedFormId, setSelectedFormId] = useState<string>();
  const selectedSummary = useMemo(
    () => forms.find((form) => form.id === selectedFormId) ?? forms[0],
    [forms, selectedFormId],
  );
  const selectedFormQuery = useQuery(
    adminClientQueryOptions.recruitForm(recruitId, selectedSummary?.id ?? ''),
  );
  const selectedForm = selectedFormQuery.data?.form;

  const [finalizePaperModalOpen, setFinalizePaperModalOpen] = useState(false);
  const [finalizeInterviewModalOpen, setFinalizeInterviewModalOpen] = useState(false);

  const updatePaper = useCallback(
    async (form: RecruitFormSummary, result: 'clear' | 'fail' | 'pass') => {
      setSelectedFormId(form.id);
      await paperMutation.mutateAsync({ formId: form.id, result });
    },
    [paperMutation],
  );

  const updateInterview = useCallback(
    async (form: RecruitFormSummary, result: 'clear' | 'fail' | 'pass') => {
      setSelectedFormId(form.id);
      await interviewMutation.mutateAsync({ formId: form.id, result });
    },
    [interviewMutation],
  );

  useEffect(() => {
    if (forms.length <= 0) return;
    if (!selectedFormId || !forms.some((form) => form.id === selectedFormId)) {
      setSelectedFormId(forms[0].id);
    }
  }, [forms, selectedFormId]);

  const queriedForms = useMemo(
    () =>
      forms
        .filter(
          (form) =>
            form.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
            form.studentId.includes(query) ||
            form.department.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )
        .sort((a, b) => {
          const rank = (form: RecruitFormSummary) => {
            if (form.paperPass && form.interviewPass === null) return 1;
            if (form.paperPass && form.interviewPass === true) return 2;
            if (form.paperPass && form.interviewPass === false) return 3;
            if (form.interviewPass === null && form.paperPass === null) return 4;
            if (form.interviewPass === null && form.paperPass === true) return 5;
            if (form.interviewPass === null && form.paperPass === false) return 6;
            return 7;
          };

          const rankDiff = rank(a) - rank(b);
          return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
        }),
    [forms, query],
  );

  if (!recruit) return <Loading />;

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
                <BreadcrumbPage>
                  {recruit.year}년 {recruit.semester}학기
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row gap-2">
          <Link href={`/admin/recruit/${recruit.id}/statistics`}>
            <Button variant="outline" className="w-full">
              통계
            </Button>
          </Link>

          <Input
            placeholder="검색어를 입력해주세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {recruit.step === Step.PRE && (
            <>
              {selectedSummary && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="w-full md:w-fit"
                    onClick={() =>
                      selectedSummary.paperPass !== false
                        ? updatePaper(selectedSummary, 'fail')
                        : updatePaper(selectedSummary, 'clear')
                    }
                  >
                    {selectedSummary.paperPass !== false ? '불합격' : '초기화'}
                  </Button>
                  <Button
                    variant="wink"
                    className="w-full md:w-fit"
                    onClick={() =>
                      selectedSummary.paperPass !== true
                        ? updatePaper(selectedSummary, 'pass')
                        : updatePaper(selectedSummary, 'clear')
                    }
                  >
                    {selectedSummary.paperPass !== true ? '합격' : '초기화'}
                  </Button>
                </div>
              )}
              {!(forms?.some((x) => x.paperPass === null) || forms.length === 0) && (
                <Button variant="outline" onClick={() => setFinalizePaperModalOpen(true)}>
                  확정
                </Button>
              )}
            </>
          )}

          {recruit.step === Step.PAPER_END && (
            <>
              {selectedSummary && selectedSummary.paperPass && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="w-full md:w-fit"
                    onClick={() =>
                      selectedSummary.interviewPass !== false
                        ? updateInterview(selectedSummary, 'fail')
                        : updateInterview(selectedSummary, 'clear')
                    }
                  >
                    {selectedSummary.interviewPass !== false ? '불합격' : '초기화'}
                  </Button>
                  <Button
                    variant="wink"
                    className="w-full md:w-fit"
                    onClick={() =>
                      selectedSummary.interviewPass !== true
                        ? updateInterview(selectedSummary, 'pass')
                        : updateInterview(selectedSummary, 'clear')
                    }
                  >
                    {selectedSummary.interviewPass !== true ? '합격' : '초기화'}
                  </Button>
                </div>
              )}
              {!forms?.some((x) => x.paperPass && x.interviewPass === null) && (
                <Button variant="outline" onClick={() => setFinalizeInterviewModalOpen(true)}>
                  확정
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <ScrollArea className={state === 'expanded' ? 'md:w-[calc(100dvw-315px)]' : 'md:w-screen'}>
        <div className="flex space-x-3">
          {isApi ? (
            Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="w-[150px] h-[70px] rounded-md " />
            ))
          ) : queriedForms && queriedForms.length > 0 ? (
            queriedForms?.map((form) => (
              <div
                key={form.id}
                className={cn(
                  'w-[150px] border rounded-md px-5 py-3 shadow cursor-pointer hover:bg-neutral-50',
                  form.id === selectedSummary?.id ? 'bg-neutral-50 hover:bg-neutral-100/75' : '',
                )}
                onClick={() => setSelectedFormId(form.id)}
              >
                <div className="flex justify-between">
                  <p className="font-medium">{form.name}</p>

                  <div className="flex space-x-1">
                    {form.paperPass === null ? (
                      <FileUser className="w-[18px] h-[18px] text-neutral-600" />
                    ) : form.paperPass ? (
                      <FileUser className="w-[18px] h-[18px] text-green-600" />
                    ) : (
                      <FileUser className="w-[18px] h-[18px] text-red-600" />
                    )}

                    {recruit?.step !== Step.PRE &&
                      form.paperPass &&
                      (form.interviewPass === null ? (
                        <Speech className="w-[18px] h-[18px] text-neutral-600" />
                      ) : form.interviewPass ? (
                        <Speech className="w-[18px] h-[18px] text-green-600" />
                      ) : (
                        <Speech className="w-[18px] h-[18px] text-red-600" />
                      ))}
                  </div>
                </div>
                <p className="text-neutral-500 text-sm">{form.studentId}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">검색 결과가 없습니다.</p>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedSummary && selectedFormQuery.isPending && (
        <Skeleton className="h-[520px] w-full rounded-md" />
      )}

      {selectedSummary && selectedFormQuery.isError && (
        <p className="py-10 text-center text-sm text-neutral-500">
          지원서 상세 정보를 불러오지 못했습니다.
        </p>
      )}

      {selectedForm && (
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableHead className="w-[180px]">이름</TableHead>
              <TableCell>{selectedForm.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">학번</TableHead>
              <TableCell>{selectedForm.studentId}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">학과</TableHead>
              <TableCell>{selectedForm.department}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">이메일</TableHead>
              <TableCell>{selectedForm.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">전화번호</TableHead>
              <TableCell>{selectedForm.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">
                지원동기
                <br />
                <span className="text-xs font-light">({selectedForm.jiwonDonggi.length}자)</span>
              </TableHead>
              <TableCell className="whitespace-pre-line break-all">
                {selectedForm.jiwonDonggi}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">
                자기소개
                <br />
                <span className="text-xs font-light">({selectedForm.selfIntroduce.length}자)</span>
              </TableHead>
              <TableCell className="whitespace-pre-line break-all">
                {selectedForm.selfIntroduce}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">외부활동</TableHead>
              <TableCell className="whitespace-pre-line">
                {selectedForm.outings.join('\n')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">면접 날짜</TableHead>
              <TableCell className="whitespace-pre-line">
                {selectedForm.whyCannotInterview
                  ? selectedForm.whyCannotInterview
                  : selectedForm.interviewDates.map((date) => formatDate(date, true)).join('\n')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">Github</TableHead>
              <TableCell>
                {selectedForm.github ? (
                  <Link
                    href={`https://github.com/${selectedForm.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-600/90"
                  >
                    {selectedForm.github}
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">프론트엔드 기술</TableHead>
              <TableCell>
                {selectedForm.frontendTechStacks.length > 0
                  ? selectedForm.frontendTechStacks
                      .map((s) => s as unknown as keyof typeof FrontendTechStack)
                      .map((s) => FrontendTechStack[s])
                      .join(', ')
                  : '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">백엔드 기술</TableHead>
              <TableCell>
                {selectedForm.backendTechStacks.length > 0
                  ? selectedForm.backendTechStacks
                      .map((s) => s as unknown as keyof typeof BackendTechStack)
                      .map((s) => BackendTechStack[s])
                      .join(', ')
                  : '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">데브옵스 기술</TableHead>
              <TableCell>
                {selectedForm.devOpsTechStacks.length > 0
                  ? selectedForm.devOpsTechStacks
                      .map((s) => s as unknown as keyof typeof DevOpsTechStack)
                      .map((s) => DevOpsTechStack[s])
                      .join(', ')
                  : '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">디자인 기술</TableHead>
              <TableCell>
                {selectedForm.designTechStacks.length > 0
                  ? selectedForm.designTechStacks
                      .map((s) => s as unknown as keyof typeof DesignTechStack)
                      .map((s) => DesignTechStack[s])
                      .join(', ')
                  : '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px]">
                스스로 공부하거나 기억에 남는 프로젝트
                {selectedForm.favoriteProject && (
                  <>
                    <br />
                    <span className="text-xs font-light">
                      ({selectedForm.favoriteProject.length}자)
                    </span>
                  </>
                )}
              </TableHead>
              <TableCell className="whitespace-pre-line break-all">
                {selectedForm.favoriteProject || '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <FinalizePaperModal
        open={finalizePaperModalOpen}
        setOpen={setFinalizePaperModalOpen}
        recruit={recruit}
        callback={() =>
          void queryClient.invalidateQueries({ queryKey: adminKeys.recruit(recruitId) })
        }
      />

      <FinalizeInterviewModal
        open={finalizeInterviewModalOpen}
        setOpen={setFinalizeInterviewModalOpen}
        recruit={recruit}
        callback={() =>
          void queryClient.invalidateQueries({ queryKey: adminKeys.recruit(recruitId) })
        }
      />
    </>
  );
}
