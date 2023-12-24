import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import { Course_Service } from './course.services';

const createCourse = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await Course_Service.createCourseIntoDB(categoryData);

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
      total: result.levelQuery.length,
    },
    data: result.levelQuery,
  });
});

export const Course_Controller = {
  createCourse,
  updateCourse,
  getAllCourses,
};
