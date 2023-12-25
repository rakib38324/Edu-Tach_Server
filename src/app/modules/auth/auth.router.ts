import express from 'express';
import ValidateRequest from '../../middlwares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import Auth from '../../middlwares/auth';
const router = express.Router();

router.post(
  '/login',
  ValidateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  Auth('admin', 'student'),
  ValidateRequest(AuthValidations.passwordChangedValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRouters = router;
