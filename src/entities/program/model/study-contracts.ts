import type Study from './study';

import Page from '@/shared/model/page';
import { z } from 'zod';

export const GetCategoriesResponseSchema = z.object({
  categories: z.array(z.string()),
});

export const GetStudiesResponseSchema = z.object({
  studies: z.custom<Page<Study>>(),
});

export type GetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
export type GetStudiesResponse = z.infer<typeof GetStudiesResponseSchema>;
