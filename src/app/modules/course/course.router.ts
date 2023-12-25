import express from 'express';
import ValidateRequest from '../../middlwares/validateRequest';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './course.validation';
import { Course_Controller } from './course.controller';
import Auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/courses',
  Auth('admin'),
  ValidateRequest(createCourseValidationSchema),
  Course_Controller.createCourse,
);
router.put(
  '/courses/:courseId',
  Auth('admin'),
  ValidateRequest(updateCourseValidationSchema),
  Course_Controller.updateCourse,
);
router.get('/courses', Course_Controller.getAllCourses);

export const Course_router = router;
