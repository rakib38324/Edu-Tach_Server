import z from 'zod';

export const create_Category_Validation_Schema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .max(100, { message: 'Name can not more than 100 characters' }),
});

export const Category_Validation = {
  create_Category_Validation_Schema,
};
