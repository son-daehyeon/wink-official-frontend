import BaseSchema from '@/shared/model/base-schema';

export default interface History extends BaseSchema {
  title: string;
  image: string;
  date: string;
}
