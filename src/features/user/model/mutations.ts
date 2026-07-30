'use client';

import { deleteMyAvatar, updateMyInfo, updateMyPassword, uploadMyAvatar } from '../api/client';

import { userKeys } from '@/entities/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateMyInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(userKeys.me(), user);
    },
  });
}

export function useUploadMyAvatarMutation() {
  return useMutation({
    mutationFn: uploadMyAvatar,
  });
}

export function useDeleteMyAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAvatar,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(userKeys.me(), user);
    },
  });
}

export function useUpdateMyPasswordMutation() {
  return useMutation({
    mutationFn: updateMyPassword,
  });
}
