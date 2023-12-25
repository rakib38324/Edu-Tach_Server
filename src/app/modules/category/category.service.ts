/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { User } from '../user/user.model';
import UnauthrizedError from '../../errors/unauthorizedError';

const createCategoryIntoDB = async (payload: TCategory) => {
  const existsCategory = await Category.findOne({
    name: { $regex: new RegExp(payload.name, 'i') },
  });

  const isExistsCreatedPerson = await User.findById(payload.createdBy);

  if (!isExistsCreatedPerson) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `CreatedBy, User ID: ${payload.createdBy} is not Valid ID! Please ensure the valid CreatedBy ID.`,
    );
  }

  if (isExistsCreatedPerson.role !== 'admin') {
    throw new UnauthrizedError(
      httpStatus.UNAUTHORIZED,
      'You do not have the necessary permissions to access this resource.',
    );
  }

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
  const result = await Category.find().populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};

export const Category_Service = {
  createCategoryIntoDB,
  getAllCategoriesIntoDB,
};
