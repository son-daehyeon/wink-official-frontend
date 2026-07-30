'use client';

import {
  createHistory,
  createProject,
  deleteHistory,
  deleteProject,
  programQueryKeys,
  programQueryOptions,
  updateHistory,
  updateProject,
  uploadProgramImage,
} from '../api/server';

import { CreateHistoryRequest } from '@/entities/program';
import { CreateProjectRequest } from '@/entities/program';
import { browserApi } from '@/shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useActivitiesQuery() {
  return useQuery(programQueryOptions.activities(browserApi));
}

export function useHistoriesQuery() {
  return useQuery(programQueryOptions.histories(browserApi));
}

export function useProjectsQuery(page = 0, query = '') {
  return useQuery(programQueryOptions.projects(browserApi, page, query));
}

export function useStudiesQuery(category = '전체', page = 0, query = '') {
  return useQuery(programQueryOptions.studies(browserApi, category, page, query));
}

export function useStudyCategoriesQuery() {
  return useQuery(programQueryOptions.studyCategories(browserApi));
}

export function useUsersQuery() {
  return useQuery(programQueryOptions.users(browserApi));
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateProjectRequest) => createProject(browserApi, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.all }),
  });
}

export function useUpdateProjectMutation(isAdmin: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateProjectRequest }) =>
      updateProject(browserApi, id, body, isAdmin),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.all }),
  });
}

export function useDeleteProjectMutation(isAdmin: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(browserApi, id, isAdmin),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.all }),
  });
}

export function useCreateHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateHistoryRequest) => createHistory(browserApi, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.histories() }),
  });
}

export function useUpdateHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateHistoryRequest }) =>
      updateHistory(browserApi, id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.histories() }),
  });
}

export function useDeleteHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHistory(browserApi, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programQueryKeys.histories() }),
  });
}

export function getProgramUploadUrl() {
  return uploadProgramImage(browserApi);
}
