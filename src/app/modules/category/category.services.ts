/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: TCategory) => {
  const existsCategory = await Category.findOne({
    name: { $regex: new RegExp(payload.name, 'i') },
  });

  if (existsCategory) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Category Already Exists!!!',
    );
  } else {
    const created = await Category.create(payload);
    const result = {
      _id: created._id,
      name: created.name,
      createdBy: created.createdBy,
    };
    return result;
  }
};

const getAllCategoriesIntoDB = async () => {
  const result = await Category.find().populate('createdBy');
  return result;
};

export const Category_Service = {
  createCategoryIntoDB,
  getAllCategoriesIntoDB,
};
