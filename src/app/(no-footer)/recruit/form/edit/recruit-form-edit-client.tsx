'use client';

import {
  ComponentType,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { RecruitStepProps } from '../model/recruit-step';
import Step0 from '../steps/0';
import Step1 from '../steps/1';
import Step2 from '../steps/2';
import Step3 from '../steps/3';
import Step4 from '../steps/4';
import Step5 from '../steps/5';
import Step6 from '../steps/6';
import Step7 from '../steps/7';
import Step8 from '../steps/8';
import Step9 from '../steps/9';
import Step10 from '../steps/10';
import Step11 from '../steps/11';
import Step12 from '../steps/12';
import Step13 from '../steps/13';
import Step14 from '../steps/14';
import Step15 from '../steps/15';
import Step16 from '../steps/16';
import Step17 from '../steps/17';
import Step18 from '../steps/18';
import { Stack } from '../ui/stack-button';

import {
  ALTERNATE_INTERVIEW_REQUIRED,
  PRIVACY_POLICY_VERSION,
  RecruitFormRequestSchema,
  createRecruitFormDefaultValues,
} from '@/entities/recruit';
import { RecruitFormRequest } from '@/entities/recruit';
import { useRecruitStore } from '@/features/recruit';
import { exchangeRecruitEditSession } from '@/features/recruit';
import { recruitKeys } from '@/features/recruit';
import { editFormQueryOptions } from '@/features/recruit';
import { useApi } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { PageLoading } from '@/shared/ui/page-loading';
import { Progress } from '@/shared/ui/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CircleChevronLeft } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import { useForm } from 'react-hook-form';

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

export default function RecruitFormEditClient() {
  const { step, setStep, developer, setDeveloper, setStack, setBack, modify, setEditing, clear } =
    useRecruitStore();

  const queryClient = useQueryClient();
  const exchangeStarted = useRef(false);
  const componentMounted = useRef(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const [isMoving, startMoving] = useApi();

  const controls = useAnimationControls();

  const editFormQuery = useQuery(editFormQueryOptions(sessionReady));
  const storedForm = editFormQuery.data?.form;
  const recruit = storedForm?.recruit;

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
    componentMounted.current = true;

    if (exchangeStarted.current) {
      return () => {
        componentMounted.current = false;
        queryClient.removeQueries({ queryKey: recruitKeys.editForm(), exact: true });
      };
    }

    exchangeStarted.current = true;
    clear();
    queryClient.removeQueries({ queryKey: recruitKeys.editForm(), exact: true });

    const currentUrl = new URL(window.location.href);
    const token = new URLSearchParams(currentUrl.hash.slice(1)).get('token')?.trim();
    currentUrl.hash = '';
    currentUrl.searchParams.delete('token');
    window.history.replaceState(
      window.history.state,
      '',
      `${currentUrl.pathname}${currentUrl.search}`,
    );

    void (async () => {
      try {
        if (token) {
          const editForm = await exchangeRecruitEditSession(token);
          if (!componentMounted.current) return;

          queryClient.setQueryData(recruitKeys.editForm(), editForm);
        }

        if (!componentMounted.current) return;
        setSessionReady(true);
      } catch {
        if (!componentMounted.current) return;
        setSessionError(true);
      }
    })();

    return () => {
      componentMounted.current = false;
      queryClient.removeQueries({ queryKey: recruitKeys.editForm(), exact: true });
    };
  }, [clear, queryClient]);

  useEffect(() => {
    if (!storedForm) return;

    const hasCurrentPrivacyConsent =
      storedForm.privacyConsent === true &&
      storedForm.privacyPolicyVersion === PRIVACY_POLICY_VERSION;

    form.reset({
      name: storedForm.name,
      studentId: storedForm.studentId,
      department: storedForm.department,
      email: storedForm.email,
      phoneNumber: storedForm.phoneNumber,
      jiwonDonggi: storedForm.jiwonDonggi,
      selfIntroduce: storedForm.selfIntroduce,
      outings: storedForm.outings,
      interviewDates: storedForm.interviewDates,
      favoriteProject: storedForm.favoriteProject ?? '',
      github: storedForm.github ?? '',
      whyCannotInterview: storedForm.interviewDates.includes('0001-01-01')
        ? ALTERNATE_INTERVIEW_REQUIRED
        : '',
      frontendTechStacks: storedForm.frontendTechStacks,
      backendTechStacks: storedForm.backendTechStacks,
      devOpsTechStacks: storedForm.devOpsTechStacks,
      designTechStacks: storedForm.designTechStacks,
      privacyConsent: hasCurrentPrivacyConsent,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    });
    setDeveloper(
      !!(
        storedForm.github ||
        storedForm.favoriteProject ||
        storedForm.frontendTechStacks.length > 0 ||
        storedForm.backendTechStacks.length > 0 ||
        storedForm.devOpsTechStacks.length > 0 ||
        storedForm.designTechStacks.length > 0
      ),
    );
    setStack([
      ...(storedForm.frontendTechStacks.length > 0 ? ['frontend'] : []),
      ...(storedForm.backendTechStacks.length > 0 ? ['backend'] : []),
      ...(storedForm.devOpsTechStacks.length > 0 ? ['devops'] : []),
      ...(storedForm.designTechStacks.length > 0 ? ['design'] : []),
    ] as Stack[]);
    setEditing(true);
    setStep(hasCurrentPrivacyConsent ? 18 : 0);
    setFormInitialized(true);
  }, [form, setDeveloper, setEditing, setStack, setStep, storedForm]);

  useEffect(() => {
    form.clearErrors();
  }, [form, step]);

  if (sessionError || editFormQuery.isError) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-medium">지원서 수정 링크가 만료되었거나 올바르지 않습니다.</p>
        <p className="text-sm text-neutral-500">이메일에서 수정 링크를 다시 열어주세요.</p>
        <Button variant="outline" onClick={() => window.location.assign('/recruit')}>
          모집 페이지로 돌아가기
        </Button>
      </div>
    );
  }

  if (!sessionReady || editFormQuery.isPending || !formInitialized || !recruit)
    return <PageLoading />;

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
