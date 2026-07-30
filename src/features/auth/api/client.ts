'use client';

import {
  CheckRegisterRequest,
  CheckRegisterResponse,
  CheckResetPasswordRequest,
  CheckResetPasswordResponse,
  LoginRequest,
  RegisterRequest,
  RequestResetPasswordRequest,
  ResetPasswordRequest,
} from '../model/contracts';

import { browserApi } from '@/shared/api/client';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';

export function login(data: LoginRequest) {
  return browserApi.POST('/auth/login', { body: data }).then(unwrapOpenApiVoid);
}

export function logout() {
  return browserApi.POST('/auth/logout').then(unwrapOpenApiVoid);
}

export function register(data: RegisterRequest) {
  return browserApi.POST('/auth/register', { body: data }).then(unwrapOpenApiVoid);
}

export function checkRegister(data: CheckRegisterRequest) {
  return browserApi
    .POST('/auth/register/check', { body: data })
    .then(unwrapOpenApiContent<CheckRegisterResponse>);
}

export function requestResetPassword(data: RequestResetPasswordRequest) {
  return browserApi.POST('/auth/reset-password/request', { body: data }).then(unwrapOpenApiVoid);
}

export function checkResetPassword(data: CheckResetPasswordRequest) {
  return browserApi
    .POST('/auth/reset-password/check', { body: data })
    .then(unwrapOpenApiContent<CheckResetPasswordResponse>);
}

export function resetPassword(data: ResetPasswordRequest) {
  return browserApi.POST('/auth/reset-password', { body: data }).then(unwrapOpenApiVoid);
}
