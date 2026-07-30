import { GetActivitiesPageableResponse } from '@/entities/program';
import {
  GetFormsResponse,
  GetRecruitResponse,
  GetRecruitSmsResponse,
  GetRecruitsResponse,
} from '@/entities/recruit';
import { AdminPreUsersResponse, AdminUsersResponse } from '@/entities/user';
import type { paths } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent } from '@/shared/api/openapi';
import type { Client } from 'openapi-fetch';

export type AdminApiClient = Client<paths>;

export async function getAdminRecruits(api: AdminApiClient) {
  return unwrapOpenApiContent<GetRecruitsResponse>(await api.GET('/admin/recruit'));
}

export async function getAdminRecruit(api: AdminApiClient, recruitId: string) {
  return unwrapOpenApiContent<GetRecruitResponse>(
    await api.GET('/admin/recruit/{recruitId}', { params: { path: { recruitId } } }),
  );
}

export async function getAdminRecruitForms(api: AdminApiClient, recruitId: string) {
  return unwrapOpenApiContent<GetFormsResponse>(
    await api.GET('/admin/recruit/{recruitId}/form', { params: { path: { recruitId } } }),
  );
}

export async function getAdminRecruitSms(api: AdminApiClient, recruitId: string) {
  return unwrapOpenApiContent<GetRecruitSmsResponse>(
    await api.GET('/admin/recruit/{recruitId}/sms', { params: { path: { recruitId } } }),
  );
}

export async function getAdminUsers(api: AdminApiClient, page = 0, query = '') {
  return unwrapOpenApiContent<AdminUsersResponse>(
    await api.GET('/admin/user', { params: { query: { page, query } } }),
  );
}

export async function getAdminPreUsers(api: AdminApiClient, page = 0, query = '') {
  return unwrapOpenApiContent<AdminPreUsersResponse>(
    await api.GET('/admin/user/pre-user', { params: { query: { page, query } } }),
  );
}

export async function getAdminActivities(api: AdminApiClient, page = 0, query = '') {
  return unwrapOpenApiContent<GetActivitiesPageableResponse>(
    await api.GET('/admin/program/activity', { params: { query: { page, query } } }),
  );
}
