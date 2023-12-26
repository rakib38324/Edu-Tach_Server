import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import { Category_Service } from './category.service';
import httpStatus from 'http-status';

const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await Category_Service.createCategoryIntoDB(
    categoryData,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await Category_Service.getAllCategoriesIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});
export const Category_Controller = {
  createCategory,
  getAllCategories,
};
