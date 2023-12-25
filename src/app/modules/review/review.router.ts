import express from 'express';
import ValidateRequest from '../../middlwares/validateRequest';
import { createReviewValidationSchema } from './review.validation';
import { Review_Controller } from './review.controller';
import Auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/reviews',
  Auth('user'),
  ValidateRequest(createReviewValidationSchema),
  Review_Controller.createReview,
);
router.get('/courses/:courseId/reviews', Review_Controller.getCourseWithReview);
router.get('/course/best', Review_Controller.getBestCourseWithAvg_Review);

export const Review_router = router;
