/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { User } from '../user/user.model';
import UnauthrizedError from '../../errors/unauthorizedError';
import { JwtPayload } from 'jsonwebtoken';

const createCategoryIntoDB = async (
  payload: TCategory,
  userData: JwtPayload,
) => {
  const existsCategory = await Category.findOne({
    name: { $regex: new RegExp(payload.name, 'i') },
  });

  const { _id } = userData;

  const isExistsCreatedPerson = await User.findById(_id);

  if (!isExistsCreatedPerson) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `CreatedBy, User ID: ${_id} is not Valid ID! Please ensure the valid CreatedBy ID.`,
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
  }
  const updateData = {
    name: payload.name,
    createdBy: _id,
  };

  const result = await Category.create(updateData);

  return result;
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
