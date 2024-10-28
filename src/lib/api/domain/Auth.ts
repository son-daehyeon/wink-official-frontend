import { WinkApiRequest } from '@/lib/api/WinkApiRequest';
import {
  CheckVerifyCodeRequest,
  CheckVerifyCodeResponse,
  ConfirmResetPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RegisterRequest,
  RequestResetPasswordRequest,
  SendVerifyCodeRequest,
  UserResponse,
  VerifyResetPasswordRequest,
  VerifyResetPasswordResponse,
} from '@/lib/api/types';

export class Auth {
  constructor(private readonly request: WinkApiRequest) {}

  public async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request.post('/auth/login', data);
  }

  public async register(data: RegisterRequest): Promise<void> {
    return this.request.post('/auth/register', data);
  }

  public async sendVerifyCode(data: SendVerifyCodeRequest): Promise<void> {
    return this.request.post('/auth/verify-code/send', data);
  }

  public async checkVerifyCode(data: CheckVerifyCodeRequest): Promise<CheckVerifyCodeResponse> {
    return this.request.post('/auth/verify-code/check', data);
  }

  public async refresh(data: RefreshRequest): Promise<LoginResponse> {
    return this.request.post('/auth/refresh-token', data);
  }

  public async requestResetPassword(data: RequestResetPasswordRequest): Promise<void> {
    return this.request.post('/auth/reset-password/request', data);
  }

  public async verifyResetPassword(
    data: VerifyResetPasswordRequest,
  ): Promise<VerifyResetPasswordResponse> {
    return this.request.post('/auth/reset-password/verify', data);
  }

  public async confirmResetPassword(data: ConfirmResetPasswordRequest): Promise<void> {
    return this.request.post('/auth/reset-password', data);
  }

  public async me(): Promise<UserResponse> {
    return this.request.get('/auth/me');
  }
}
