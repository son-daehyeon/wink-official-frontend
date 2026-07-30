import { ForwardRefExoticComponent, RefAttributes } from 'react';

import { Scope as ApplicationScope } from '@/entities/application';
import {
  BadgeCheck,
  CaseSensitive,
  CircleDollarSign,
  GraduationCap,
  IdCard,
  Image,
  LucideProps,
  Mail,
  Phone,
  RadioTower,
  Shapes,
  User,
} from 'lucide-react';

export interface ScopeMapType {
  name: string;
  value: ApplicationScope;
  disable: boolean;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export const SCOPE_MAP: ScopeMapType[] = [
  {
    name: 'UUID',
    value: ApplicationScope.UUID,
    disable: true,
    icon: IdCard,
  },
  {
    name: '이메일',
    value: ApplicationScope.EMAIL,
    disable: false,
    icon: Mail,
  },
  {
    name: '이름',
    value: ApplicationScope.NAME,
    disable: false,
    icon: User,
  },
  {
    name: '학번',
    value: ApplicationScope.STUDENT_ID,
    disable: false,
    icon: BadgeCheck,
  },
  {
    name: '학부(과)',
    value: ApplicationScope.DEPARTMENT,
    disable: false,
    icon: GraduationCap,
  },
  {
    name: '전화번호',
    value: ApplicationScope.PHONE_NUMBER,
    disable: false,
    icon: Phone,
  },
  {
    name: '프로필 사진',
    value: ApplicationScope.AVATAR,
    disable: false,
    icon: Image,
  },
  {
    name: '한 줄 소개',
    value: ApplicationScope.DESCRIPTION,
    disable: false,
    icon: CaseSensitive,
  },
  {
    name: '소셜 정보',
    value: ApplicationScope.SOCIAL,
    disable: false,
    icon: RadioTower,
  },
  {
    name: '역할',
    value: ApplicationScope.ROLE,
    disable: false,
    icon: Shapes,
  },
  {
    name: '회비 납부',
    value: ApplicationScope.FEE,
    disable: false,
    icon: CircleDollarSign,
  },
];
