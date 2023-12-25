import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const Category_Schema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<TCategory>('Categorie', Category_Schema);
