import BaseSchema from '@/shared/model/base-schema';

export default interface Activity extends BaseSchema {
  title: string;
  description: string;
  images: string[];
  pinned: boolean;
}
