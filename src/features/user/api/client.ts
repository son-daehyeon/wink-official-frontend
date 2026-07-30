'use client';

import { UploadImageResponse } from '@/entities/program';
import { UpdateMyInfoRequest, UpdateMyPasswordRequest, UserResponse } from '@/entities/user';
import type { User } from '@/entities/user';
import { browserApi } from '@/shared/api/client';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';
import { ApiError } from '@/shared/api/shared';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { user } = await browserApi.GET('/auth/me').then(unwrapOpenApiContent<UserResponse>);
    return user;
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      return null;
    }

    throw error;
  }
}

export function updateMyInfo(data: UpdateMyInfoRequest) {
  return browserApi.PUT('/user/info', { body: data }).then(unwrapOpenApiContent<UserResponse>);
}

export function uploadMyAvatar() {
  return browserApi.POST('/user/avatar').then(unwrapOpenApiContent<UploadImageResponse>);
}

export function deleteMyAvatar() {
  return browserApi.DELETE('/user/avatar').then(unwrapOpenApiContent<UserResponse>);
}

export function updateMyPassword(data: UpdateMyPasswordRequest) {
  return browserApi.PUT('/user/password', { body: data }).then(unwrapOpenApiVoid);
}
