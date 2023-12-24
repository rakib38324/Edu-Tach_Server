/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Course } from '../course/course.model';
import { TReview } from './review.interface';
import { Review } from './review.model';
import AppError from '../../errors/App.Error';
import httpStatus from 'http-status';

const createReviewIntoDB = async (payload: TReview) => {
  const courseExist = await Course.findById(payload.courseId);

  if (courseExist) {
    const created = await Review.create(payload);
    const result = {
      _id: created._id,
      courseId: created.courseId,
      rating: created.rating,
      review: created.review,
    };
    return result;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Course Id: ${payload.courseId} is Invalid!!!`,
    );
  }
};

const getCourseWithReviewIntoDB = async (courseId: string) => {
  const course = await Course.findById(courseId);
  if (course) {
    const validCourseId = new mongoose.Types.ObjectId(courseId);

    const reviews = await Review.aggregate([
      { $match: { courseId: validCourseId } },
      {
        $project: {
          courseId: 1,
          rating: 1,
          review: 1,
          _id: 0,
        },
      },
    ]);

    const result = {
      course,
      reviews,
    };
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not Found!!!');
  }
};

const getBestReviewBaseCourseIntoDB = async () => {
  const bestCourseAggregate = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: { $round: ['$rating', 1] } },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 1,
    },
    {
      $set: {
        averageRating: { $round: ['$averageRating', 1] },
      },
    },
  ]);

  const bestCourseDetails = bestCourseAggregate[0];

  return bestCourseDetails;
};

export const Review_Service = {
  createReviewIntoDB,
  getCourseWithReviewIntoDB,
  getBestReviewBaseCourseIntoDB,
};
