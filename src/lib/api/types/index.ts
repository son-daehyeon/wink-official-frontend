export interface CheckVerifyCodeRequest {
  email: string;
  verifyCode: string;
}

export interface ConfirmResetPasswordRequest {
  passwordResetToken: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  token: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  studentId: string;
  password: string;
  verifyCode: string;
}

export interface RequestResetPasswordRequest {
  email: string;
}

export interface SendVerifyCodeRequest {
  email: string;
}

export interface VerifyResetPasswordRequest {
  passwordResetToken: string;
}

export interface CheckVerifyCodeResponse {
  isVerified: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyResetPasswordResponse {
  isVerified: boolean;
}

export interface AdminChangeInfoRequest {
  email: string;
  name: string;
  studentId: string;
  description: string;
  github: string;
  instagram: string;
  blog: string;
}

export interface ChangeInfoRequest {
  description: string;
  github: string;
  instagram: string;
  blog: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}

export interface UserListResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface User {
  email: string;
  password: string;
  name: string;
  studentId: string;
  avatar: string;
  description: string;
  social: Social;
  role: Role;
  fee: boolean;
  approved: boolean;
}

export interface Social {
  github?: string;
  instagram?: string;
  blog?: string;
}

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  PLANNING_ASSISTANT = 'PLANNING_ASSISTANT',
  PLANNING_HEAD = 'PLANNING_HEAD',
  PUBLIC_RELATIONS_ASSISTANT = 'PUBLIC_RELATIONS_ASSISTANT',
  PUBLIC_RELATIONS_HEAD = 'PUBLIC_RELATIONS_HEAD',
  TREASURY_ASSISTANT = 'TREASURY_ASSISTANT',
  TREASURY_HEAD = 'TREASURY_HEAD',
  VICE_PRESIDENT = 'VICE_PRESIDENT',
  PRESIDENT = 'PRESIDENT',
}
