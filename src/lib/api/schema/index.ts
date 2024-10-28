import { z } from 'zod';

export const checkVerifyCodeSchema = z.object({
  email: z.string().min(1),
  verifyCode: z.string().min(1),
});

export const confirmResetPasswordSchema = z.object({
  passwordResetToken: z.string().min(1),
  newPassword: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)\S{8,}$/),
});

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  token: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@kookmin\.ac\.kr$/),
  name: z.string().regex(/^[가-힣]{2,4}$/),
  studentId: z.string().regex(/^[0-9]{8}$/),
  password: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)\S{8,}$/),
  verifyCode: z.string().regex(/^[A-Z0-9]{6}$/),
});

export const requestResetPasswordSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@kookmin\.ac\.kr$/),
});

export const sendVerifyCodeSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@kookmin\.ac\.kr$/),
});

export const verifyResetPasswordSchema = z.object({
  passwordResetToken: z.string().min(1),
});

export const adminChangeInfoSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@kookmin\.ac\.kr$/),
  name: z.string().regex(/^[가-힣]{2,4}$/),
  studentId: z.string().regex(/^[0-9]{8}$/),
  description: z.string().min(1).max(20),
  github: z.string().regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/),
  instagram: z.string().regex(/^(?!.*\.\.)(?!.*\.$)\w[\w.]{0,29}$/),
  blog: z
    .string()
    .regex(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
    ),
});

export const changeInfoSchema = z.object({
  description: z.string().min(1).max(20),
  github: z.string().regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/),
  instagram: z.string().regex(/^(?!.*\.\.)(?!.*\.$)\w[\w.]{0,29}$/),
  blog: z
    .string()
    .regex(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
    ),
});

export const changePasswordSchema = z.object({
  password: z.string().min(1),
  newPassword: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)\S{8,}$/),
});
