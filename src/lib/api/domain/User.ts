import { WinkApiRequest } from '@/lib/api/WinkApiRequest';
import {
  AdminChangeInfoRequest,
  ChangeInfoRequest,
  ChangePasswordRequest,
  UserListResponse,
} from '@/lib/api/types';

export class User {
  constructor(private readonly request: WinkApiRequest) {}

  public async getUsers(): Promise<UserListResponse> {
    return this.request.get('/user');
  }

  public async changeInfo(data: ChangeInfoRequest): Promise<void> {
    return this.request.put('/user/my/info', data);
  }

  public async changePassword(data: ChangePasswordRequest): Promise<void> {
    return this.request.put('/user/my/password', data);
  }

  public async changeAvatar(avatar: File): Promise<void> {
    const data = new FormData();
    data.append('avatar', avatar);

    return this.request.put('/user/my/avatar', data);
  }

  public async deleteAvatar(): Promise<void> {
    return this.request.delete('/user/my/avatar');
  }
}

export class UserAdmin {
  constructor(private readonly request: WinkApiRequest) {}

  public async getWaitingMembers(): Promise<UserListResponse> {
    return this.request.get('/user/admin/waiting');
  }

  public async approveWaitingMember(userId: string): Promise<void> {
    return this.request.post(`/user/admin/waiting/approve/${userId}`);
  }

  public async rejectWaitingMember(userId: string): Promise<void> {
    return this.request.put(`/user/admin/waiting/reject/${userId}`);
  }

  public async changeInfo(userId: string, data: AdminChangeInfoRequest): Promise<void> {
    return this.request.put(`/user/admin/info/${userId}`, data);
  }

  public async deleteAvatar(userId: string): Promise<void> {
    return this.request.delete(`/user/admin/avatar/${userId}`);
  }

  public async deleteUser(userId: string): Promise<void> {
    return this.request.delete(`/user/admin/${userId}`);
  }
}
