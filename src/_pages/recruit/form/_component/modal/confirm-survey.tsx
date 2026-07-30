import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { RecruitFormRequest } from '@/entities/recruit';
import { Recruit } from '@/entities/recruit';
import { useRecruitStore } from '@/features/recruit';
import { useEditRecruitFormMutation, useSubmitRecruitFormMutation } from '@/features/recruit';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface ConfirmSurveyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recruit: Recruit;
  form: UseFormReturn<RecruitFormRequest>;
}

export default function ConfirmSurveyModal({
  open,
  setOpen,
  recruit,
  form,
}: ConfirmSurveyModalProps) {
  const router = useRouter();

  const { clear, editing } = useRecruitStore();

  const [clicked, setClicked] = useState(false);
  const submitRecruitFormMutation = useSubmitRecruitFormMutation();
  const editRecruitFormMutation = useEditRecruitFormMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지원서 {editing ? '수정' : '제출'}하기</DialogTitle>
          {!editing && (
            <DialogDescription>
              지원서를 제출하신 후에는 이메일로 전송된 링크를 통해 수정하실 수 있습니다.
            </DialogDescription>
          )}
        </DialogHeader>

        <Button
          variant="wink"
          disabled={
            clicked || submitRecruitFormMutation.isPending || editRecruitFormMutation.isPending
          }
          onClick={() => {
            setClicked(true);

            toast.promise(
              async () => {
                const data = {
                  ...form.getValues(),
                  whyCannotInterview: form.getValues('whyCannotInterview') || undefined,
                  github: form.getValues('github') || undefined,
                };

                if (editing) {
                  await editRecruitFormMutation.mutateAsync(data);
                } else {
                  await submitRecruitFormMutation.mutateAsync({
                    recruitId: recruit.id,
                    data,
                  });
                }

                router.push('/recruit');
                setTimeout(clear, 500);
              },
              {
                loading: `지원서를 ${editing ? '수정' : '제출'}하고 있습니다.`,
                success: (
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium">지원서를 {editing ? '수정' : '제출'}했습니다.</p>
                    <p className="text-neutral-500">면접 대상자는 추후 문자로 안내될 예정입니다.</p>
                  </div>
                ),
                error: (e) => e.message,
                duration: 1000 * 60 * 3,
                finally: () => setClicked(false),
              },
            );
          }}
        >
          {editing ? '수정' : '제출'}하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
