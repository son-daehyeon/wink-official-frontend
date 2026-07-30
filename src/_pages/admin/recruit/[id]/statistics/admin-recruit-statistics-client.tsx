'use client';

import { useMemo } from 'react';

import Loading from '../../../../loading';
import InterviewChart from './_component/interview';
import PaperChart from './_component/paper';
import StudentIdInterviewFailChart from './_component/student-id-interview-fail';
import StudentIdInterviewPassChart from './_component/student-id-interview-pass';
import StudentIdInterviewTotalChart from './_component/student-id-interview-total';
import StudentIdPaperFailChart from './_component/student-id-paper-fail';
import StudentIdPaperPassChart from './_component/student-id-paper-pass';
import StudentIdPaperTotalChart from './_component/student-id-paper-total';

import { adminQueryOptions } from '@/features/admin';
import { browserApi } from '@/shared/api/client';
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

  if (!recruit) return <Loading />;

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
