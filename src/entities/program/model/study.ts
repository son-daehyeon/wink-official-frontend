import BaseSchema from '@/shared/model/base-schema';

export default interface Study extends BaseSchema {
  index: number;
  category: string;
  title: string;
  author: string;
  content: string;
  image?: string;
}
