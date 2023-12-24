import express from 'express';
import { Category_Controller } from './category.controller';
import { create_Category_Validation_Schema } from './category.validation';
import ValidateRequest from '../../middlwares/validateRequest';

const router = express.Router();

router.get('/categories', Category_Controller.getAllCategories);

router.post(
  '/categories',
  ValidateRequest(create_Category_Validation_Schema),
  Category_Controller.createCategory,
);

export const Category_router = router;
