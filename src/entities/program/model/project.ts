import type { User } from '@/entities/user/@x/program';
import BaseSchema from '@/shared/model/base-schema';

export default interface Project extends BaseSchema {
  author: User;
  title: string;
  description: string;
  image: string;
  link: string;
}
