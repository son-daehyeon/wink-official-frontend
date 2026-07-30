import type Recruit from './recruit';

import BaseSchema from '@/shared/model/base-schema';

export default interface RecruitSms extends BaseSchema {
  recruit: Recruit;
  paperFail: string;
  paperPass: string;
  finalFail: string;
  finalPass: string;
}
