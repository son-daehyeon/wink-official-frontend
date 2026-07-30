import type Project from './project';

import {
  GITHUB_PROJECT_URL_EXPRESSION,
  GITHUB_PROJECT_URL_MESSAGE,
  URL_EXPRESSION,
  URL_MESSAGE,
} from '@/shared/lib/validation';
import Page from '@/shared/model/page';
import { z } from 'zod';

export const CreateProjectRequestSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(1, '설명을 입력해주세요.'),
  image: z.string().regex(URL_EXPRESSION, URL_MESSAGE),
  link: z.string().regex(GITHUB_PROJECT_URL_EXPRESSION, GITHUB_PROJECT_URL_MESSAGE),
});

export const GetProjectResponseSchema = z.object({
  project: z.custom<Project>(),
});

export const GetProjectsPageableResponseSchema = z.object({
  projects: z.custom<Page<Project>>(),
});

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;
export type GetProjectsPageableResponse = z.infer<typeof GetProjectsPageableResponseSchema>;
