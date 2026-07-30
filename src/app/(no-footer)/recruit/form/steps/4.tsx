import { useState } from 'react';

import { useRouter } from 'next/navigation';

import type { RecruitStepProps } from '../model/recruit-step';

import { useRecruitStore } from '@/features/recruit';
import { useCheckEmailMutation } from '@/features/recruit';
import { Button } from '@/shared/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { motion } from 'motion/react';
import { IconMEnvelope } from 'react-fluentui-emoji/lib/modern';
import { toast } from 'sonner';

export default function Step4({ go, recruit, form }: RecruitStepProps) {
  const router = useRouter();

  const { step, modify, setModify, clear } = useRecruitStore();

  const [clicked, setClicked] = useState(false);
  const checkEmailMutation = useCheckEmailMutation();

  return (
    <>
      <div className="size-[48px] sm:size-[72px]">
        <IconMEnvelope size="auto" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 1.2,
            duration: 0.4,
          },
        }}
      >
        <p className="font-medium text-lg">이메일을 입력해주세요!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: 1,
          pointerEvents: 'auto',
          transition: {
            delay: 2.2,
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
        className="w-full max-w-[300px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="이메일을 입력해주세요." {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>국민대학교 메일만 사용 가능합니다.</FormDescription>
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: 1,
          pointerEvents: 'auto',
          transition: {
            delay: 3.1,
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
      >
        <Button
          variant="wink"
          disabled={clicked || checkEmailMutation.isPending}
          onClick={async () => {
            setClicked(true);

            try {
              if (await form.trigger('email')) {
                const { duplicated } = await checkEmailMutation.mutateAsync({
                  recruitId: recruit.id,
                  data: {
                    email: form.getValues('email'),
                  },
                });

                if (duplicated) {
                  setTimeout(clear, 500);
                  toast.error('이미 윙크 부원이거나, 이번 모집에 지원하셨습니다.');
                  router.replace('/recruit');
                  return;
                }

                go(modify || step + 1);
                modify && setTimeout(() => setModify(undefined), 400);
              } else {
                toast.error(form.formState.errors.email!.message);
                setClicked(false);
              }
            } catch (error) {
              toast.error(error instanceof Error ? error.message : '중복 확인에 실패했습니다.');
              setClicked(false);
            }
          }}
        >
          {modify ? '수정 완료' : '다음으로'}
        </Button>
      </motion.div>
    </>
  );
}
