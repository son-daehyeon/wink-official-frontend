import BaseSchema from '@/shared/model/base-schema';

export default interface Recruit extends BaseSchema {
  year: number;
  semester: number;
  recruitStartDate: string;
  recruitEndDate: string;
  interviewStartDate: string;
  interviewEndDate: string;
  step: Step;
}

export enum Step {
  PRE = 'PRE',
  PAPER_END = 'PAPER_END',
  INTERVIEW_END = 'INTERVIEW_END',
}
