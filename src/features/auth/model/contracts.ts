import type { PreUser } from '@/entities/user';
import {
  KOOKMIN_EMAIL_EXPRESSION,
  KOOKMIN_EMAIL_MESSAGE,
  PASSWORD_EXPRESSION,
  PASSWORD_MESSAGE,
} from '@/shared/lib/validation';
import { z } from 'zod';

export const CheckRegisterRequestSchema = z.object({
  token: z.string().min(1, '토큰을 입력해주세요.'),
});

export const CheckResetPasswordRequestSchema = z.object({
  token: z.string().min(1, '토큰을 입력해주세요.'),
});

export const LoginRequestSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호는 비어있을 수 없습니다.'),
});

export const RegisterRequestSchema = z.object({
  token: z.string().min(1, '토큰을 입력해주세요.'),
  password: z.string().regex(PASSWORD_EXPRESSION, PASSWORD_MESSAGE),
});

export const RequestResetPasswordRequestSchema = z.object({
  email: z.string().regex(KOOKMIN_EMAIL_EXPRESSION, KOOKMIN_EMAIL_MESSAGE),
});

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, '토큰을 입력해주세요.'),
  newPassword: z.string().regex(PASSWORD_EXPRESSION, PASSWORD_MESSAGE),
});

export const CheckRegisterResponseSchema = z.object({
  isValid: z.boolean(),
  user: z.custom<PreUser>(),
});

export const CheckResetPasswordResponseSchema = z.object({
  isValid: z.boolean(),
});

export type CheckRegisterRequest = z.infer<typeof CheckRegisterRequestSchema>;
export type CheckResetPasswordRequest = z.infer<typeof CheckResetPasswordRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RequestResetPasswordRequest = z.infer<typeof RequestResetPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type CheckRegisterResponse = z.infer<typeof CheckRegisterResponseSchema>;
export type CheckResetPasswordResponse = z.infer<typeof CheckResetPasswordResponseSchema>;
