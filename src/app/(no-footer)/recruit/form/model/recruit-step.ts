import type { Recruit, RecruitFormRequest } from '@/entities/recruit';
import type { UseFormReturn } from 'react-hook-form';

export interface RecruitStepProps {
  go: (page: number) => void;
  form: UseFormReturn<RecruitFormRequest>;
  recruit: Recruit;
}
