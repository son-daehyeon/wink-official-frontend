'use client';

import { useEffect, useMemo } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BackgroundImage from '@/public/recruit/background.webp';

import { domains } from './config/domain';
import { qnas } from './config/qna';
import DomainCard from './ui/domain-card';
import InfoCard, { Info } from './ui/info-card';
import Items from './ui/items';
import RecruitTitle from './ui/recruit-title';
import Rocket from './ui/rocket';
import ScrollDown from './ui/scroll-down';

import { useLogoutMutation } from '@/features/auth';
import { useRecruitStore } from '@/features/recruit';
import { latestRecruitQueryOptions } from '@/features/recruit';
import { useUserStore } from '@/features/user';
import { browserApi } from '@/shared/api/client';
import { formatDate, nowDate, toDate } from '@/shared/lib/cn';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';
import { PageLoading } from '@/shared/ui/page-loading';
import { useQuery } from '@tanstack/react-query';
import { endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import Confetti from 'react-confetti';
import { IconMRocket } from 'react-fluentui-emoji/lib/modern';
import { toast } from 'sonner';

export default function RecruitPageClient() {
  const router = useRouter();

  const { user } = useUserStore();
  const { confetti, setConfetti } = useRecruitStore();
  const logout = useLogoutMutation();

  const { data, isPending } = useQuery(latestRecruitQueryOptions(browserApi));
  const recruit = data?.recruit;

  const infos = useMemo<Info[]>(() => {
    if (!recruit) return [];

    return [
      {
        title: '지원 기간',
        content: `${formatDate(recruit.recruitStartDate, true)} ~\n${formatDate(recruit.recruitEndDate, true)}`,
      },
      {
        title: '면접 일정',
        content: `${formatDate(recruit.interviewStartDate, true)} ~\n${formatDate(recruit.interviewEndDate, true)}`,
      },
    ];
  }, [recruit]);

  useEffect(() => {
    if (!confetti) return;
    setConfetti(false);
  }, [confetti, setConfetti]);

  if (isPending) return <PageLoading />;

  return (
    <>
      <div className="relative w-[100vw] h-[calc(100dvh-56px)] bg-black">
        <Image
          src={BackgroundImage}
          alt="background"
          width={1920}
          height={1080}
          quality={100}
          placeholder="blur"
          className="w-full h-full object-cover"
        />

        <Rocket />
        <RecruitTitle year={recruit?.year ?? new Date().getFullYear()} />
        <ScrollDown />
      </div>

      <div className="flex flex-col space-y-10 sm:space-y-24 pt-20 sm:pt-28">
        <Items
          title="모집 개요"
          description={`${recruit?.year ?? new Date().getFullYear()}년도 ${recruit?.semester ?? 1}학기 WINK 신입 부원 모집 개요`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infos.map((info) => (
              <InfoCard key={info.title} {...info} />
            ))}
          </div>
        </Items>

        <Items title="모집 분야" description="함께 활동을 적극적으로 할 수 있는 누구나 환영합니다">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <DomainCard key={domain.tag} {...domain} />
            ))}
          </div>
        </Items>
      </div>

      {recruit && (
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 space-y-10 sm:space-y-14">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="size-[48px] sm:size-[72px]">
              <IconMRocket size="auto" />
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {recruit.year}년도 {recruit.semester}학기 WINK 신규 부원
            </p>
          </div>

          {isBefore(startOfDay(nowDate()), startOfDay(toDate(recruit.recruitStartDate))) ? (
            <p className="text-neutral-500">
              {formatDate(startOfDay(toDate(recruit.recruitStartDate)), true)}부터 지원할 수
              있습니다.
            </p>
          ) : isAfter(startOfDay(nowDate()), endOfDay(toDate(recruit.recruitEndDate))) ? (
            <p className="text-neutral-500">지원이 종료되었습니다.</p>
          ) : !user ? (
            <Button variant="wink" onClick={() => router.push(`/recruit/form`)}>
              지원하기
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={logout.isPending}
              onClick={async () => {
                try {
                  await logout.mutateAsync();
                  toast.success('로그아웃되었습니다.');
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : '로그아웃에 실패했습니다.');
                }
              }}
            >
              로그아웃
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col items-center py-20 sm:py-28 bg-wink-50">
        <Items title="자주 묻는 질문">
          <Accordion
            type="single"
            collapsible
            className="w-[300px] sm:w-[608px] bg-white rounded-3xl px-6"
          >
            {qnas.map(({ question, answer }, index) => (
              <AccordionItem key={index} value={index.toString()}>
                <AccordionTrigger className="text-sm sm:text-base text-start">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-base ">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Items>
      </div>

      {confetti && <Confetti recycle={false} />}
    </>
  );
}
