import { Course } from '../course/course.model';
import { TReview } from './review.interface';
import { Review } from './review.model';
import AppError from '../../errors/App.Error';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import UnauthrizedError from '../../errors/unauthorizedError';
import { JwtPayload } from 'jsonwebtoken';

const createReviewIntoDB = async (payload: TReview, userData: JwtPayload) => {
  const courseExist = await Course.findById(payload.courseId);
  const { _id } = userData;
  const isExistsCreatedPerson = await User.findById(_id);

  if (!isExistsCreatedPerson) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `CreatedBy, User ID: ${_id} is not Valid ID! Please ensure the valid CreatedBy ID.`,
    );
  }
  if (isExistsCreatedPerson.role !== 'user') {
    throw new UnauthrizedError(
      httpStatus.UNAUTHORIZED,
      'You do not have the necessary permissions to access this resource.',
    );
  }

  if (!courseExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Course Id: ${payload.courseId} is Invalid!!!`,
    );
  }

  const updateData = {
    rating: payload.rating,
    review: payload.review,
    courseId: payload.courseId,
    createdBy: _id,
  };

  const result = (await Review.create(updateData)).populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};

const getCourseWithReviewIntoDB = async (courseId: string) => {
  const course = await Course.findById(courseId).populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  if (course) {
    const reviews = await Review.find({ courseId }).populate({
      path: 'createdBy',
      select: '_id username email role',
    });

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
      $lookup: {
        from: 'users',
        localField: 'course.createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    {
      $unwind: '$createdBy',
    },
    {
      $project: {
        'createdBy.username': 1,
        'createdBy._id': 1,
        'createdBy.role': 1,
        'createdBy.email': 1,
        'course._id': 1,
        'course.title': 1,
        'course.instructor': 1,
        'course.categoryId': 1,
        'course.price': 1,
        'course.tags': 1,
        'course.startDate': 1,
        'course.endDate': 1,
        'course.language': 1,
        'course.provider': 1,
        'course.durationInWeeks': 1,
        'course.details.level': 1,
        'course.details.description': 1,

        _id: 0,
        averageRating: { $round: ['$averageRating', 1] },
        reviewCount: 1,
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 1,
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
