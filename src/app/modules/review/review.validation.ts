import z from 'zod';

export const createReviewValidationSchema = z.object({
  courseId: z.string({ required_error: 'courseId is required.' }),
  rating: z.number().min(1).max(5),
  review: z.string({ required_error: 'review is required.' }).min(1),
});

export const courseValidation = {
  createReviewValidationSchema,
};
