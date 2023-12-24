import { Schema, model } from 'mongoose';
import { CourseModel, TCourse, Ttags } from './course.interface';

const Tags = new Schema<Ttags>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Categories',
  },
  price: { type: Number, required: true },
  tags: {
    type: [Tags],
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number },
  details: {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    description: { type: String, required: true },
  },
});

//=======================> creating a custom static method <======================
courseSchema.statics.isCourseExists = async function (title: string) {
  const existingCourse = await Course.findOne({ title });

  return existingCourse;
};

export const Course = model<TCourse, CourseModel>('Course', courseSchema);
