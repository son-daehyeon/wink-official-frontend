'use client';

import { ComponentType, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import Loading from '../../loading';
import Step0 from './_step/0';
import Step1 from './_step/1';
import Step2 from './_step/2';
import Step3 from './_step/3';
import Step4 from './_step/4';
import Step5 from './_step/5';
import Step6 from './_step/6';
import Step7 from './_step/7';
import Step8 from './_step/8';
import Step9 from './_step/9';
import Step10 from './_step/10';
import Step11 from './_step/11';
import Step12 from './_step/12';
import Step13 from './_step/13';
import Step14 from './_step/14';
import Step15 from './_step/15';
import Step16 from './_step/16';
import Step17 from './_step/17';
import Step18 from './_step/18';

import {
  RecruitFormRequest,
  RecruitFormRequestSchema,
  createRecruitFormDefaultValues,
} from '@/entities/recruit';
import { Recruit } from '@/entities/recruit';
import { useRecruitStore } from '@/features/recruit';
import { latestRecruitQueryOptions } from '@/features/recruit';
import { browserApi } from '@/shared/api/client';
import { nowDate, toDate } from '@/shared/lib/cn';
import { useApi } from '@/shared/lib/hooks/use-api';
import { Form } from '@/shared/ui/form';
import { Progress } from '@/shared/ui/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { endOfDay, startOfDay } from 'date-fns';
import { CircleChevronLeft } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface RecruitStepProps {
  go: (page: number) => void;
  form: UseFormReturn<RecruitFormRequest>;
  recruit: Recruit;
}

const STEPS: ComponentType<RecruitStepProps>[] = [
  Step0,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  Step12,
  Step13,
  Step14,
  Step15,
  Step16,
  Step17,
  Step18,
];

export default function RecruitFormClient() {
  const router = useRouter();

  const {
    recruit: storedRecruit,
    step,
    setStep,
    developer,
    setBack,
    modify,
    setRecruit: setStoredRecruit,
    clear,
  } = useRecruitStore();

  const [isMoving, startMoving] = useApi();

  const controls = useAnimationControls();

  const { data: latestRecruitData, isPending } = useQuery(latestRecruitQueryOptions(browserApi));
  const recruit = latestRecruitData?.recruit;

  const form = useForm<RecruitFormRequest>({
    resolver: zodResolver(RecruitFormRequestSchema),
    mode: 'onChange',
    defaultValues: createRecruitFormDefaultValues(),
  });

  const go = useCallback(
    (page: number) => {
      startMoving(async () => {
        await controls.start({
          opacity: 0,
          transition: {
            ease: 'easeInOut',
            duration: 0.4,
          },
        });

        setStep(page);

        await controls.start({
          opacity: 1,
          transition: {
            delay: 0.4,
            ease: 'easeInOut',
            duration: 0.4,
          },
        });
      });
    },
    [controls, setStep, startMoving],
  );

  const StepComponent = useMemo(() => STEPS[step], [step]);

  useLayoutEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!recruit) return;

    if (
      nowDate() < startOfDay(toDate(recruit.recruitStartDate)) ||
      nowDate() > endOfDay(toDate(recruit.recruitEndDate))
    ) {
      toast.error('잘못된 접근입니다.');
      router.replace('/');
    }
  }, [recruit, router]);

  useEffect(() => {
    if (!recruit) return;

    if (recruit.id !== storedRecruit) {
      clear();
      setStoredRecruit(recruit.id);
    }
  }, [clear, recruit, setStoredRecruit, storedRecruit]);

  useEffect(() => {
    form.clearErrors();
  }, [form, step]);

  if (isPending || !recruit) return <Loading />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
        className="flex items-center space-x-4 w-[300px]"
      >
        <CircleChevronLeft
          className="cursor-pointer aria-disabled:opacity-50"
          aria-disabled={!!(isMoving || step <= 0 || modify)}
          onClick={() => {
            if (isMoving || step <= 0 || modify) return;

            14 <= step && step <= 17 && setBack(true);

            if (step === 17 && !developer) {
              go(10);
              return;
            }

            go(step - 1);
          }}
        />
        <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2" />
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="w-full">
          <motion.div animate={controls} className="flex flex-col items-center space-y-6 w-full">
            <StepComponent go={go} recruit={recruit} form={form} />
          </motion.div>
        </form>
      </Form>
    </>
  );
}
