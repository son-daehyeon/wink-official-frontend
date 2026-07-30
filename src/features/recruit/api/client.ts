import {
  DuplicationCheckResponse,
  EmailCheckRequest,
  GetFormResponse,
  GetRecruitResponse,
  PhoneNumberCheckRequest,
  RecruitFormRequest,
  StudentIdCheckRequest,
} from '@/entities/recruit';
import { browserApi } from '@/shared/api/client';
import type { components } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';
import { ApiError } from '@/shared/api/shared';

interface ApiEnvelope<T = unknown> {
  success?: boolean;
  content?: T | null;
  error?: string | null;
}

const EDIT_SESSION_PATH = '/api/recruit/edit-session';

export function getLatestRecruit() {
  return browserApi
    .GET('/recruit/latest')
    .then(unwrapOpenApiContent) as Promise<GetRecruitResponse>;
}

function getEnvelopeError(payload: unknown, fallback: string) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    return payload.error;
  }

  return fallback;
}

async function readEditSessionForm(response: Response) {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<GetFormResponse> | null;

  if (
    !response.ok ||
    !payload ||
    payload.success === false ||
    payload.content === null ||
    payload.content === undefined
  ) {
    throw new ApiError(
      getEnvelopeError(payload, '지원서 수정 정보를 불러오지 못했습니다.'),
      response.status,
      null,
    );
  }

  return payload.content;
}

async function requireEditSessionSuccess(response: Response) {
  if (response.ok) return;

  const payload = (await response.json().catch(() => null)) as ApiEnvelope | null;
  throw new ApiError(
    getEnvelopeError(payload, '지원서 수정 요청을 처리하지 못했습니다.'),
    response.status,
    null,
  );
}

export function getEditForm() {
  return fetch(EDIT_SESSION_PATH, {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  }).then(readEditSessionForm);
}

export function exchangeRecruitEditSession(token: string) {
  return fetch(EDIT_SESSION_PATH, {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  }).then(readEditSessionForm);
}

export function submitRecruitForm(recruitId: string, data: RecruitFormRequest) {
  return browserApi
    .POST('/recruit/{recruitId}', {
      params: { path: { recruitId } },
      body: data as components['schemas']['RecruitFormRequest'],
    })
    .then(unwrapOpenApiVoid);
}

export async function clearRecruitEditSession() {
  const response = await fetch(EDIT_SESSION_PATH, {
    method: 'DELETE',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  await requireEditSessionSuccess(response);
}

export async function editRecruitForm(data: RecruitFormRequest) {
  const response = await fetch(EDIT_SESSION_PATH, {
    method: 'PUT',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await requireEditSessionSuccess(response);
  await clearRecruitEditSession();
}

export function checkStudentId(recruitId: string, data: StudentIdCheckRequest) {
  return browserApi
    .POST('/recruit/{recruitId}/check/studentId', {
      params: { path: { recruitId } },
      body: data,
    })
    .then(unwrapOpenApiContent) as Promise<DuplicationCheckResponse>;
}

export function checkEmail(recruitId: string, data: EmailCheckRequest) {
  return browserApi
    .POST('/recruit/{recruitId}/check/email', {
      params: { path: { recruitId } },
      body: data,
    })
    .then(unwrapOpenApiContent) as Promise<DuplicationCheckResponse>;
}

export function checkPhoneNumber(recruitId: string, data: PhoneNumberCheckRequest) {
  return browserApi
    .POST('/recruit/{recruitId}/check/phoneNumber', {
      params: { path: { recruitId } },
      body: data,
    })
    .then(unwrapOpenApiContent) as Promise<DuplicationCheckResponse>;
}
