import type BaseUser from './base-user';

export default interface PreUser extends BaseUser {
  token: string;
  test: boolean;
}
