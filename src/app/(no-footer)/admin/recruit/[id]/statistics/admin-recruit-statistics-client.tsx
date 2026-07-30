'use client';

import { useMemo } from 'react';

import InterviewChart from './ui/interview';
import PaperChart from './ui/paper';
import StudentIdInterviewFailChart from './ui/student-id-interview-fail';
import StudentIdInterviewPassChart from './ui/student-id-interview-pass';
import StudentIdInterviewTotalChart from './ui/student-id-interview-total';
import StudentIdPaperFailChart from './ui/student-id-paper-fail';
import StudentIdPaperPassChart from './ui/student-id-paper-pass';
import StudentIdPaperTotalChart from './ui/student-id-paper-total';

import { adminQueryOptions } from '@/features/admin';
import { browserApi } from '@/shared/api/client';
import { PageLoading } from '@/shared/ui/page-loading';
import { useQuery } from '@tanstack/react-query';

interface AdminRecruitStatisticsClientProps {
  recruitId: string;
}

export default function AdminRecruitStatisticsClient({
  recruitId,
}: AdminRecruitStatisticsClientProps) {
  const recruitQuery = useQuery(adminQueryOptions.recruit(browserApi, recruitId));
  const formsQuery = useQuery(adminQueryOptions.recruitForms(browserApi, recruitId));
  const recruit = recruitQuery.data?.recruit;
  const forms = useMemo(() => formsQuery.data?.forms ?? [], [formsQuery.data?.forms]);

  const sortedByStudentId = useMemo(
    () => [...forms].sort((a, b) => b.studentId.localeCompare(a.studentId)),
    [forms],
  );

  if (!recruit) return <PageLoading />;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">전체 통계</h1>
        <div className="flex flex-wrap gap-4">
          <PaperChart forms={forms} />
          <InterviewChart forms={forms} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">서류 학번별 통계</h1>
        <div className="flex flex-wrap gap-4">
          <StudentIdPaperTotalChart forms={sortedByStudentId} />
          <StudentIdPaperPassChart forms={sortedByStudentId} />
          <StudentIdPaperFailChart forms={sortedByStudentId} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">면접 학번별 통계</h1>
        <div className="flex flex-wrap gap-4">
          <StudentIdInterviewTotalChart forms={sortedByStudentId} />
          <StudentIdInterviewPassChart forms={sortedByStudentId} />
          <StudentIdInterviewFailChart forms={sortedByStudentId} />
        </div>
      </section>
    </div>
  );
}
