'use client';

import { CreateActivityRequest, GetActivityResponse } from '@/entities/program';
import { UploadImageResponse } from '@/entities/program';
import {
  CreateRecruitRequest,
  GetRecruitResponse,
  GetRecruitSmsResponse,
  SendTestSmsRequest,
  UpdateRecruitSmsRequest,
} from '@/entities/recruit';
import { AdminPreUserResponse, InviteRequest, UpdateRequest, UserResponse } from '@/entities/user';
import { browserApi } from '@/shared/api/client';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';

export function createAdminRecruit(data: CreateRecruitRequest) {
  return browserApi
    .POST('/admin/recruit', { body: data })
    .then(unwrapOpenApiContent<GetRecruitResponse>);
}

export function deleteAdminRecruit(recruitId: string) {
  return browserApi
    .DELETE('/admin/recruit/{recruitId}', { params: { path: { recruitId } } })
    .then(unwrapOpenApiContent<GetRecruitResponse>);
}

export function updatePaperResult(
  recruitId: string,
  formId: string,
  result: 'clear' | 'fail' | 'pass',
) {
  return browserApi
    .POST(`/admin/recruit/{recruitId}/form/{formId}/paper/${result}`, {
      params: { path: { recruitId, formId } },
    })
    .then(unwrapOpenApiVoid);
}

export function updateInterviewResult(
  recruitId: string,
  formId: string,
  result: 'clear' | 'fail' | 'pass',
) {
  return browserApi
    .POST(`/admin/recruit/{recruitId}/form/{formId}/interview/${result}`, {
      params: { path: { recruitId, formId } },
    })
    .then(unwrapOpenApiVoid);
}

export function finalizePaper(recruitId: string) {
  return browserApi
    .POST('/admin/recruit/{recruitId}/form/paper/finalize', {
      params: { path: { recruitId } },
    })
    .then(unwrapOpenApiVoid);
}

export function finalizeInterview(recruitId: string) {
  return browserApi
    .POST('/admin/recruit/{recruitId}/form/interview/finalize', {
      params: { path: { recruitId } },
    })
    .then(unwrapOpenApiVoid);
}

export function updateAdminRecruitSms(recruitId: string, data: UpdateRecruitSmsRequest) {
  return browserApi
    .POST('/admin/recruit/{recruitId}/sms', {
      params: { path: { recruitId } },
      body: data,
    })
    .then(unwrapOpenApiContent<GetRecruitSmsResponse>);
}

export function sendAdminRecruitTestSms(recruitId: string, data: SendTestSmsRequest) {
  return browserApi
    .POST('/admin/recruit/{recruitId}/sms/test', {
      params: { path: { recruitId } },
      body: data,
    })
    .then(unwrapOpenApiVoid);
}

export function inviteAdminUser(data: InviteRequest) {
  return browserApi
    .POST('/admin/user', { body: data })
    .then(unwrapOpenApiContent<AdminPreUserResponse>);
}

export function removeAdminPreUser(id: string) {
  return browserApi
    .DELETE('/admin/user/pre-user/{id}', { params: { path: { id } } })
    .then(unwrapOpenApiVoid);
}

export function updateAdminUser(id: string, data: UpdateRequest) {
  return browserApi
    .PUT('/admin/user/{id}', { params: { path: { id } }, body: data })
    .then(unwrapOpenApiContent<UserResponse>);
}

export function createAdminActivity(data: CreateActivityRequest) {
  return browserApi
    .POST('/admin/program/activity', { body: data })
    .then(unwrapOpenApiContent<GetActivityResponse>);
}

export function updateAdminActivity(id: string, data: CreateActivityRequest) {
  return browserApi
    .PUT('/admin/program/activity/{id}', { params: { path: { id } }, body: data })
    .then(unwrapOpenApiContent<GetActivityResponse>);
}

export function deleteAdminActivity(id: string) {
  return browserApi
    .DELETE('/admin/program/activity/{id}', { params: { path: { id } } })
    .then(unwrapOpenApiVoid);
}

export function pinAdminActivity(id: string) {
  return browserApi
    .PATCH('/admin/program/activity/{id}/pin', { params: { path: { id } } })
    .then(unwrapOpenApiContent<GetActivityResponse>);
}

export function unpinAdminActivity(id: string) {
  return browserApi
    .DELETE('/admin/program/activity/{id}/pin', { params: { path: { id } } })
    .then(unwrapOpenApiContent<GetActivityResponse>);
}

export function uploadAdminProgramImage() {
  return browserApi.POST('/program/upload/image').then(unwrapOpenApiContent<UploadImageResponse>);
}
