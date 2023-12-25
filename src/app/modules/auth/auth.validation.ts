/* eslint-disable no-useless-escape */
import { z } from 'zod';

const loginValidationSchema = z.object({
  username: z.string({ required_error: 'username is required.' }),
  password: z.string({ required_error: 'Password is required.' }),
});
const passwordMinLength = 8;
const passwordChangedValidationSchema = z.object({
  currentPassword: z.string({
    required_error: 'Current Password is required.',
  }),
  newPassword: z
    .string({ required_error: 'Password is required.' })
    .refine((data) => data.length >= passwordMinLength, {
      message: `Password must be at least ${passwordMinLength} characters long.`,
    })
    .refine((data) => /[a-z]/.test(data), {
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((data) => /[A-Z]/.test(data), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((data) => /\d/.test(data), {
      message: 'Password must contain at least one number.',
    })
    .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data), {
      message: 'Password must contain at least one special character.',
    }),
});

export const AuthValidations = {
  loginValidationSchema,
  passwordChangedValidationSchema,
};
