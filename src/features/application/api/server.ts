/* eslint-disable @tanstack/query/exhaustive-deps -- API transports do not define cache identity. */
import type {
  Application,
  CreateApplicationRequest,
  GetApplicationResponse,
  GetApplicationsResponse,
  OauthLoginResponse,
  UpdateApplicationLoginRequest,
  UpdateApplicationRequest,
} from '@/entities/application';
import { Scope } from '@/entities/application';
import type { UploadImageResponse } from '@/entities/program';
import type { components, paths } from '@/shared/api/generated/openapi';
import { unwrapOpenApiContent, unwrapOpenApiVoid } from '@/shared/api/openapi';
import { queryOptions } from '@tanstack/react-query';
import type { Client } from 'openapi-fetch';

type GeneratedApplication = components['schemas']['Application'];
export type ApplicationApiClient = Client<paths>;

function normalizeApplication(application: GeneratedApplication | undefined): Application {
  return {
    id: application?.id ?? '',
    createdAt: application?.createdAt ?? '',
    updatedAt: application?.updatedAt ?? '',
    name: application?.name ?? '',
    img: application?.img ?? '',
    secret: application?.secret ?? '',
    user: (application?.user as Application['user'] | undefined) ?? null,
    login: {
      enable: application?.login?.enable ?? false,
      urls: application?.login?.urls ?? [],
      scopes: (application?.login?.scopes ?? []) as Scope[],
    },
  };
}

function normalizeApplicationResponse(
  response: components['schemas']['GetApplicationResponse'],
): GetApplicationResponse {
  return {
    application: normalizeApplication(response.application),
  };
}

export const applicationQueryKeys = {
  all: ['applications'] as const,
  list: () => [...applicationQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...applicationQueryKeys.all, 'detail', id] as const,
};

export async function getApplications(api: ApplicationApiClient): Promise<GetApplicationsResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationsResponse']>(
    await api.GET('/application'),
  );

  return {
    applications: response.applications?.map(normalizeApplication) ?? [],
  };
}

export async function getApplication(
  api: ApplicationApiClient,
  id: string,
): Promise<GetApplicationResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationResponse']>(
    await api.GET('/application/{id}', {
      params: { path: { id } },
    }),
  );

  return normalizeApplicationResponse(response);
}

export async function createApplication(
  api: ApplicationApiClient,
  body: CreateApplicationRequest,
): Promise<GetApplicationResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationResponse']>(
    await api.POST('/application', {
      body,
    }),
  );

  return normalizeApplicationResponse(response);
}

export async function updateApplication(
  api: ApplicationApiClient,
  id: string,
  body: UpdateApplicationRequest,
): Promise<GetApplicationResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationResponse']>(
    await api.PUT('/application/{id}', {
      params: { path: { id } },
      body,
    }),
  );

  return normalizeApplicationResponse(response);
}

export async function updateApplicationLogin(
  api: ApplicationApiClient,
  id: string,
  body: UpdateApplicationLoginRequest,
): Promise<GetApplicationResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationResponse']>(
    await api.PUT('/application/{id}/login', {
      params: { path: { id } },
      body,
    }),
  );

  return normalizeApplicationResponse(response);
}

export async function resetApplicationSecret(
  api: ApplicationApiClient,
  id: string,
): Promise<GetApplicationResponse> {
  const response = unwrapOpenApiContent<components['schemas']['GetApplicationResponse']>(
    await api.POST('/application/{id}/secret', {
      params: { path: { id } },
    }),
  );

  return normalizeApplicationResponse(response);
}

export async function deleteApplication(api: ApplicationApiClient, id: string): Promise<void> {
  unwrapOpenApiVoid(
    await api.DELETE('/application/{id}', {
      params: { path: { id } },
    }),
  );
}

export async function createOauthLoginToken(
  api: ApplicationApiClient,
  id: string,
): Promise<OauthLoginResponse> {
  const response = unwrapOpenApiContent<components['schemas']['OauthLoginResponse']>(
    await api.POST('/application/{id}/oauth', {
      params: { path: { id } },
    }),
  );

  return {
    token: response.token ?? '',
  };
}

export async function getApplicationImageUploadUrl(
  api: ApplicationApiClient,
): Promise<UploadImageResponse> {
  const response = unwrapOpenApiContent<components['schemas']['UploadImageResponse']>(
    await api.POST('/application/img'),
  );

  return {
    url: response.url ?? '',
  };
}

export const applicationQueryOptions = {
  list: (api: ApplicationApiClient) =>
    queryOptions({
      queryKey: applicationQueryKeys.list(),
      queryFn: () => getApplications(api),
    }),
  detail: (id: string, api: ApplicationApiClient) =>
    queryOptions({
      queryKey: applicationQueryKeys.detail(id),
      queryFn: () => getApplication(api, id),
    }),
};
