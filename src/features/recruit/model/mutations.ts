'use client';

import {
  checkEmail,
  checkPhoneNumber,
  checkStudentId,
  editRecruitForm,
  submitRecruitForm,
} from '../api/client';
import { recruitKeys } from './keys';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubmitRecruitFormMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recruitId,
      data,
    }: Parameters<typeof submitRecruitForm> extends [infer RecruitId, infer Data]
      ? { recruitId: RecruitId; data: Data }
      : never) => submitRecruitForm(recruitId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recruitKeys.latest() });
    },
  });
}

export function useEditRecruitFormMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof editRecruitForm>[0]) => editRecruitForm(data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: recruitKeys.editForm(), exact: true });
    },
  });
}

export function useCheckStudentIdMutation() {
  return useMutation({
    mutationFn: ({
      recruitId,
      data,
    }: Parameters<typeof checkStudentId> extends [infer RecruitId, infer Data]
      ? { recruitId: RecruitId; data: Data }
      : never) => checkStudentId(recruitId, data),
  });
}

export function useCheckEmailMutation() {
  return useMutation({
    mutationFn: ({
      recruitId,
      data,
    }: Parameters<typeof checkEmail> extends [infer RecruitId, infer Data]
      ? { recruitId: RecruitId; data: Data }
      : never) => checkEmail(recruitId, data),
  });
}

export function useCheckPhoneNumberMutation() {
  return useMutation({
    mutationFn: ({
      recruitId,
      data,
    }: Parameters<typeof checkPhoneNumber> extends [infer RecruitId, infer Data]
      ? { recruitId: RecruitId; data: Data }
      : never) => checkPhoneNumber(recruitId, data),
  });
}
