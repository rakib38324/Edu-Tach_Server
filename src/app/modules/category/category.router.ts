import express from 'express';
import { Category_Controller } from './category.controller';
import { create_Category_Validation_Schema } from './category.validation';
import ValidateRequest from '../../middlwares/validateRequest';
import Auth from '../../middlwares/auth';

const router = express.Router();

router.get('/categories', Category_Controller.getAllCategories);

router.post(
  '/categories',
  Auth('admin'),
  ValidateRequest(create_Category_Validation_Schema),
  Category_Controller.createCategory,
);

export const Category_router = router;
