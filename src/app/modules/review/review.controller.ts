import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import { Review_Service } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await Review_Service.createReviewIntoDB(categoryData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getCourseWithReview = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await Review_Service.getCourseWithReviewIntoDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});

const getBestCourseWithAvg_Review = catchAsync(async (req, res) => {
  const result = await Review_Service.getBestReviewBaseCourseIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

export const Review_Controller = {
  createReview,
  getCourseWithReview,
  getBestCourseWithAvg_Review,
};
