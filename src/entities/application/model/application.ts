import type { User } from '@/entities/user/@x/application';
import BaseSchema from '@/shared/model/base-schema';

export default interface Application extends BaseSchema {
  name: string;
  img: string;
  secret: string;
  user: User | null;
  login: Login;
}

export interface Login {
  enable: boolean;
  urls: string[];
  scopes: Scope[];
}

export enum Scope {
  UUID = 'UUID',
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  STUDENT_ID = 'STUDENT_ID',
  DEPARTMENT = 'DEPARTMENT',
  PHONE_NUMBER = 'PHONE_NUMBER',
  AVATAR = 'AVATAR',
  DESCRIPTION = 'DESCRIPTION',
  SOCIAL = 'SOCIAL',
  ROLE = 'ROLE',
  FEE = 'FEE',
}
