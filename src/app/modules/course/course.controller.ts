import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import { Course_Service } from './course.service';
import UnauthrizedError from '../../errors/unauthorizedError';

const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const tokenId = req.user._id;

  if (tokenId !== courseData.createdBy) {
    throw new UnauthrizedError(
      httpStatus.UNAUTHORIZED,
      'You do not have the necessary permissions to access this resource.',
    );
  }

  const result = await Course_Service.createCourseIntoDB(courseData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const categoryData = req.body;
  const result = await Course_Service.updateCourseIntoDB(
    courseId,
    categoryData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await Course_Service.getAllCoursesIntoDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.totalQuery,
    },
    data: result.limitQuery,
  });
});

export const Course_Controller = {
  createCourse,
  updateCourse,
  getAllCourses,
};
