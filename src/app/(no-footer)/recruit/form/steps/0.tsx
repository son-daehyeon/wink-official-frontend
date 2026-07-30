import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { RecruitStepProps } from '../model/recruit-step';

import { PRIVACY_POLICY_VERSION } from '@/entities/recruit';
import { useRecruitStore } from '@/features/recruit';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { motion } from 'motion/react';
import { IconMHandWithFingersSplayedDefault } from 'react-fluentui-emoji/lib/modern';

export default function Step0({ go, form }: RecruitStepProps) {
  const router = useRouter();

  const { step, editing } = useRecruitStore();

  const [clicked, setClicked] = useState(false);
  const isAgreePrivacy = form.watch('privacyConsent');

  return (
    <>
      <motion.div
        initial={{
          scale: 1.1,
          rotate: -10,
        }}
        animate={{
          scale: [1.1, 1],
          rotate: [-20, 0],
          transition: {
            delay: 0.5,
            duration: 0.4,
            repeat: 3,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
      >
        <div className="size-[48px] sm:size-[72px]">
          <IconMHandWithFingersSplayedDefault size="auto" />
        </div>
      </motion.div>

      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 2.4,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <p className="font-medium text-lg">안녕하세요!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 3.1,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <p>WINK 신입 부원 모집에 지원하시겠어요?</p>
        </motion.div>

        <motion.div
          className="mt-5 w-full max-w-xl rounded-lg border border-neutral-200 bg-neutral-50 p-4"
          initial={{ opacity: 0, y: -10, pointerEvents: 'none' }}
          animate={{
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            transition: {
              delay: 3.8,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <p className="font-medium text-sm text-neutral-800">[필수] 개인정보 수집·이용 안내</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
            <li>
              수집 항목: 이름, 학번, 학과, 이메일, 전화번호, 지원서 답변, 면접 가능일·별도 일정 조율
              필요 여부, GitHub, 기술 스택, 프로젝트, 전형 결과
            </li>
            <li>이용 목적: 지원서 접수, 모집 심사, 면접 조율 및 전형 관련 연락</li>
            <li>보유 기간: 전형 종료 후 90일 뒤 파기</li>
          </ul>
          <p className="mt-2 text-xs text-neutral-500">
            동의를 거부할 수 있으나 필수정보 처리를 거부하면 지원할 수 없습니다.
          </p>
          <div className="mt-3 flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={isAgreePrivacy}
              onCheckedChange={(value) => {
                form.setValue('privacyConsent', value === true, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue('privacyPolicyVersion', PRIVACY_POLICY_VERSION);
              }}
            />
            <Label htmlFor="privacy" className="font-normal leading-5 text-neutral-700">
              위 개인정보 수집·이용에 동의합니다.{' '}
              <Link
                href="/privacy"
                className="underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                상세 개인정보 처리방침 보기
              </Link>
            </Label>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: 1,
          pointerEvents: 'auto',
          transition: {
            delay: 4.7,
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="destructive"
          disabled={clicked}
          onClick={() => {
            setClicked(true);
            router.back();
          }}
        >
          아니요
        </Button>

        <Button
          className="transition-opacity"
          variant="wink"
          disabled={clicked || !isAgreePrivacy}
          onClick={async () => {
            if (!(await form.trigger(['privacyConsent', 'privacyPolicyVersion']))) return;

            setClicked(true);
            go(editing ? 18 : step + 1);
          }}
        >
          네
        </Button>
      </motion.div>
    </>
  );
}
