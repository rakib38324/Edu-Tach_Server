import z from 'zod';

export const create_Category_Validation_Schema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .max(100, { message: 'Name can not more than 100 characters' }),
  createdBy: z.string({ required_error: 'createdBy is required.' }),
});

export const Category_Validation = {
  create_Category_Validation_Schema,
};
