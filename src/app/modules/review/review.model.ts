import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const Review_Schema = new Schema<TReview>(
  {
    rating: {
      type: Number,
      required: [true, 'Number is required.'],
    },
    review: {
      type: String,
      required: [true, 'Review is required.'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Courses',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const Review = model<TReview>('Review', Review_Schema);
