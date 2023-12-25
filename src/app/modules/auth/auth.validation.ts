import { z } from 'zod';

const loginValidationSchema = z.object({
  username: z.string({ required_error: 'username is required.' }),
  password: z.string({ required_error: 'Password is required.' }),
});

const passwordChangedValidationSchema = z.object({
  currentPassword: z.string({
    required_error: 'Current Password is required.',
  }),
  newPassword: z.string({ required_error: 'New Password is required.' }),
});

export const AuthValidations = {
  loginValidationSchema,
  passwordChangedValidationSchema,
};
