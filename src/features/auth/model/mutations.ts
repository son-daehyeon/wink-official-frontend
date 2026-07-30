'use client';

import { login, logout, register, requestResetPassword, resetPassword } from '../api/client';

import { userKeys } from '@/entities/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData(userKeys.me(), null);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  });
}

export function useRequestResetPasswordMutation() {
  return useMutation({
    mutationFn: requestResetPassword,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
