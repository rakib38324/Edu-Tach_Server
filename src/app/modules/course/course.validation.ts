import z from 'zod';

const createTagSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

export const createCourseValidationSchema = z.object({
  title: z.string({ required_error: 'Title is required.' }).min(1),
  instructor: z.string({ required_error: 'Instructor is required.' }).min(1),
  categoryId: z.string({ required_error: 'Category Id is required.' }).min(1),
  price: z.number().min(1),
  tags: z.array(createTagSchema),
  startDate: z.string({ required_error: 'Start Date is required.' }).min(1),
  endDate: z.string({ required_error: 'End Date is required.' }).min(1),
  language: z.string({ required_error: 'Language is required.' }).min(1),
  provider: z.string({ required_error: 'Provider is required.' }).min(1),
  details: z.object({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    description: z
      .string({ required_error: 'Description is required.' })
      .min(1),
  }),
});

const updateTagSchema = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updateCourseValidationSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().min(1).optional(),
  tags: z.array(updateTagSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  details: z
    .object({
      level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export const courseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
