'use client';

import {
  sendAdminRecruitTestSms,
  updateAdminRecruitSms,
  updateInterviewResult,
  updatePaperResult,
} from '../api/client';
import { adminKeys } from './keys';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdatePaperResultMutation(recruitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, result }: { formId: string; result: 'clear' | 'fail' | 'pass' }) =>
      updatePaperResult(recruitId, formId, result),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.recruitForms(recruitId) });
    },
  });
}

export function useUpdateInterviewResultMutation(recruitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, result }: { formId: string; result: 'clear' | 'fail' | 'pass' }) =>
      updateInterviewResult(recruitId, formId, result),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.recruitForms(recruitId) });
    },
  });
}

export function useUpdateRecruitSmsMutation(recruitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateAdminRecruitSms>[1]) =>
      updateAdminRecruitSms(recruitId, data),
    onSuccess: ({ recruitSms }) => {
      queryClient.setQueryData(adminKeys.recruitSms(recruitId), { recruitSms });
    },
  });
}

export function useSendRecruitTestSmsMutation(recruitId: string) {
  return useMutation({
    mutationFn: (data: Parameters<typeof sendAdminRecruitTestSms>[1]) =>
      sendAdminRecruitTestSms(recruitId, data),
  });
}
