import express from 'express';
import ValidateRequest from '../../middlwares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import Auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/register',
  Auth('admin'),
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const UserRouters = router;
