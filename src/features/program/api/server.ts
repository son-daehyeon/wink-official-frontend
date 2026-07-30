/* eslint-disable @tanstack/query/exhaustive-deps -- API transports do not define cache identity. */
import { GetActivitiesResponse } from '@/entities/program';
import { CreateHistoryRequest, GetHistoriesResponse, GetHistoryResponse } from '@/entities/program';
import {
  CreateProjectRequest,
  GetProjectResponse,
  GetProjectsPageableResponse,
} from '@/entities/program';
import { GetCategoriesResponse, GetStudiesResponse } from '@/entities/program';
import { UploadImageResponse } from '@/entities/program';
import { UsersResponse } from '@/entities/user';
import { PublicUser, Role } from '@/entities/user';
import type { components, paths } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';
import { queryOptions } from '@tanstack/react-query';
import type { Client } from 'openapi-fetch';

export type ProgramApiClient = Client<paths>;

export const programQueryKeys = {
  all: ['program'] as const,
  activities: () => [...programQueryKeys.all, 'activities'] as const,
  histories: () => [...programQueryKeys.all, 'histories'] as const,
  projects: (page: number, query = '') =>
    [...programQueryKeys.all, 'projects', { page, query }] as const,
  studies: (category: string, page: number, query = '') =>
    [...programQueryKeys.all, 'studies', { category, page, query }] as const,
  studyCategories: () => [...programQueryKeys.all, 'study-categories'] as const,
  users: () => ['users'] as const,
};

export async function getActivities(api: ProgramApiClient) {
  return unwrapOpenApiContent<GetActivitiesResponse>(await api.GET('/program/activity'));
}

export async function getHistories(api: ProgramApiClient) {
  return unwrapOpenApiContent<GetHistoriesResponse>(await api.GET('/program/history'));
}

export async function getProjects(api: ProgramApiClient, page = 0, query = '') {
  return unwrapOpenApiContent<GetProjectsPageableResponse>(
    await api.GET('/program/project', {
      params: { query: { page, query } },
    }),
  );
}

export async function createProject(api: ProgramApiClient, body: CreateProjectRequest) {
  return unwrapOpenApiContent<GetProjectResponse>(
    await api.POST('/program/project', {
      body: body as components['schemas']['CreateProjectRequest'],
    }),
  );
}

export async function updateProject(
  api: ProgramApiClient,
  id: string,
  body: CreateProjectRequest,
  isAdmin: boolean,
) {
  const path = isAdmin ? '/admin/program/project/{id}' : '/program/project/{id}';

  return unwrapOpenApiContent<GetProjectResponse>(
    await api.PUT(path, {
      params: { path: { id } },
      body: body as components['schemas']['CreateProjectRequest'],
    }),
  );
}

export async function deleteProject(api: ProgramApiClient, id: string, isAdmin: boolean) {
  const path = isAdmin ? '/admin/program/project/{id}' : '/program/project/{id}';

  unwrapOpenApiVoid(
    await api.DELETE(path, {
      params: { path: { id } },
    }),
  );
}

export async function getStudies(api: ProgramApiClient, category = '전체', page = 0, query = '') {
  if (category === '전체') {
    return unwrapOpenApiContent<GetStudiesResponse>(
      await api.GET('/program/study', {
        params: { query: { page, query } },
      }),
    );
  }

  return unwrapOpenApiContent<GetStudiesResponse>(
    await api.GET('/program/study/{category}', {
      params: { path: { category }, query: { page, query } },
    }),
  );
}

export async function getStudyCategories(api: ProgramApiClient) {
  return unwrapOpenApiContent<GetCategoriesResponse>(await api.GET('/program/study/category'));
}

export async function createHistory(api: ProgramApiClient, body: CreateHistoryRequest) {
  return unwrapOpenApiContent<GetHistoryResponse>(
    await api.POST('/admin/program/history', {
      body: body as components['schemas']['CreateHistoryRequest'],
    }),
  );
}

export async function updateHistory(api: ProgramApiClient, id: string, body: CreateHistoryRequest) {
  return unwrapOpenApiContent<GetHistoryResponse>(
    await api.PUT('/admin/program/history/{id}', {
      params: { path: { id } },
      body: body as components['schemas']['CreateHistoryRequest'],
    }),
  );
}

export async function deleteHistory(api: ProgramApiClient, id: string) {
  unwrapOpenApiVoid(
    await api.DELETE('/admin/program/history/{id}', {
      params: { path: { id } },
    }),
  );
}

export async function uploadProgramImage(api: ProgramApiClient) {
  return unwrapOpenApiContent<UploadImageResponse>(await api.POST('/program/upload/image'));
}

export async function getUsers(api: ProgramApiClient) {
  const response = unwrapOpenApiContent<components['schemas']['UsersResponse']>(
    await api.GET('/user'),
  );

  return {
    users: (response.users ?? []).map((user): PublicUser => ({
      id: user.id ?? '',
      name: user.name ?? '',
      avatar: user.avatar ?? '',
      description: user.description ?? '',
      social: {
        github: user.social?.github ?? '',
        instagram: user.social?.instagram ?? '',
        blog: user.social?.blog ?? '',
      },
      role: (user.role as Role | null | undefined) ?? Role.MEMBER,
    })),
  } satisfies UsersResponse;
}

export const programQueryOptions = {
  activities: (api: ProgramApiClient) =>
    queryOptions({
      queryKey: programQueryKeys.activities(),
      queryFn: () => getActivities(api),
    }),
  histories: (api: ProgramApiClient) =>
    queryOptions({
      queryKey: programQueryKeys.histories(),
      queryFn: () => getHistories(api),
    }),
  projects: (api: ProgramApiClient, page = 0, query = '') =>
    queryOptions({
      queryKey: programQueryKeys.projects(page, query),
      queryFn: () => getProjects(api, page, query),
    }),
  studies: (api: ProgramApiClient, category = '전체', page = 0, query = '') =>
    queryOptions({
      queryKey: programQueryKeys.studies(category, page, query),
      queryFn: () => getStudies(api, category, page, query),
    }),
  studyCategories: (api: ProgramApiClient) =>
    queryOptions({
      queryKey: programQueryKeys.studyCategories(),
      queryFn: () => getStudyCategories(api),
    }),
  users: (api: ProgramApiClient) =>
    queryOptions({
      queryKey: programQueryKeys.users(),
      queryFn: () => getUsers(api),
    }),
};
