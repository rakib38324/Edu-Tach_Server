/* eslint-disable no-useless-escape */
import { z } from 'zod';

const passwordMinLength = 8;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

const createUserValidationSchema = z.object({
  username: z
    .string({ required_error: 'Username is required.' })
    .min(1)
    .max(255),
  email: z.string({ required_error: 'Email is required.' }).email(),
  password: z
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
    })
    .refine((data) => passwordRegex.test(data), {
      message: 'Password must meet all the specified criteria.',
    }),
  role: z.enum(['admin', 'user']).default('user'),
});

const updateUserValidationSchema = z.object({
  username: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  password: z
    .string()
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
    })
    .refine((data) => passwordRegex.test(data), {
      message: 'Password must meet all the specified criteria.',
    })
    .optional(),
  role: z.enum(['admin', 'user']).default('user').optional(),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
