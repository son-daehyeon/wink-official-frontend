'use client';

import {
  applicationQueryKeys,
  applicationQueryOptions,
  createApplication,
  createOauthLoginToken,
  deleteApplication,
  getApplicationImageUploadUrl,
  resetApplicationSecret,
  updateApplication,
  updateApplicationLogin,
} from '../api/server';

import type {
  CreateApplicationRequest,
  GetApplicationResponse,
  UpdateApplicationLoginRequest,
  UpdateApplicationRequest,
} from '@/entities/application';
import { browserApi } from '@/shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function updateApplicationCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  response: GetApplicationResponse,
) {
  queryClient.setQueryData(applicationQueryKeys.detail(response.application.id), response);
  void queryClient.invalidateQueries({ queryKey: applicationQueryKeys.list() });
}

export function useApplicationsQuery() {
  return useQuery(applicationQueryOptions.list(browserApi));
}

export function useApplicationQuery(id: string) {
  return useQuery(applicationQueryOptions.detail(id, browserApi));
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateApplicationRequest) => createApplication(browserApi, body),
    onSuccess: (response) => updateApplicationCaches(queryClient, response),
  });
}

export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateApplicationRequest }) =>
      updateApplication(browserApi, id, body),
    onSuccess: (response) => updateApplicationCaches(queryClient, response),
  });
}

export function useUpdateApplicationLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateApplicationLoginRequest }) =>
      updateApplicationLogin(browserApi, id, body),
    onSuccess: (response) => updateApplicationCaches(queryClient, response),
  });
}

export function useResetApplicationSecretMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resetApplicationSecret(browserApi, id),
    onSuccess: (response) => updateApplicationCaches(queryClient, response),
  });
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApplication(browserApi, id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: applicationQueryKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: applicationQueryKeys.list() });
    },
  });
}

export function useOauthLoginMutation() {
  return useMutation({
    mutationFn: (id: string) => createOauthLoginToken(browserApi, id),
  });
}

export function requestApplicationImageUploadUrl() {
  return getApplicationImageUploadUrl(browserApi);
}
