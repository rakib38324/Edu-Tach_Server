import { Types } from 'mongoose';

export type TReview = {
  rating: number;
  review: string;
  courseId: Types.ObjectId;
  createdBy: Types.ObjectId;
};
