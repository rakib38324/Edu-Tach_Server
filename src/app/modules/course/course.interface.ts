/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type Ttags = { name: string; isDeleted: boolean };

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: [Ttags];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
  };
};

//-======================== for creating static ==========================
export interface CourseModel extends Model<TCourse> {
  isCourseExists(title: string): Promise<TCourse | null>;
}
