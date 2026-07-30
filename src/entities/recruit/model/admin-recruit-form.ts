import {
  BackendTechStack,
  DesignTechStack,
  DevOpsTechStack,
  FrontendTechStack,
} from './recruit-form';

export interface RecruitFormSummary {
  id: string;
  name: string;
  studentId: string;
  department: string;
  paperPass: boolean | null;
  interviewPass: boolean | null;
  createdAt: string | null;
}

export interface RecruitFormDetail extends RecruitFormSummary {
  email: string;
  phoneNumber: string;
  jiwonDonggi: string;
  selfIntroduce: string;
  outings: string[];
  interviewDates: string[];
  whyCannotInterview: string | null;
  github: string | null;
  frontendTechStacks: FrontendTechStack[];
  backendTechStacks: BackendTechStack[];
  devOpsTechStacks: DevOpsTechStack[];
  designTechStacks: DesignTechStack[];
  favoriteProject: string | null;
}

export interface GetRecruitFormDetailResponse {
  form: RecruitFormDetail;
}
