import express from 'express';
import ValidateRequest from '../../middlwares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/register',
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const UserRouters = router;
