/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { Category } from '../category/category.model';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { User } from '../user/user.model';
import UnauthrizedError from '../../errors/unauthorizedError';

const calculateWeek = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const timeDifference = end - start;
  const Weeks = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7));
  return Weeks;
};

const createCourseIntoDB = async (payload: TCourse) => {
  const courseExists = await Course.isCourseExists(payload.title);
  const categoryExists = await Category.findById({ _id: payload.categoryId });
  const isUserExists = await User.findById(payload.createdBy);

  if (!isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `CreatedBy, User ID: ${payload.createdBy} is not Valid ID! Please ensure the valid CreatedBy ID.`,
    );
  }
  if (isUserExists.role !== 'admin') {
    throw new UnauthrizedError(
      httpStatus.UNAUTHORIZED,
      'You do not have the necessary permissions to access this resource.',
    );
  }

  if (courseExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Course already exists!, Duplicate Title.',
    );
  }

  if (categoryExists) {
    if ((payload?.startDate, payload?.endDate)) {
      const durationInWeeks = calculateWeek(
        payload?.startDate,
        payload?.endDate,
      );
      const updatedData = { ...payload, durationInWeeks };
      const created = await Course.create(updatedData);

      return created;
    } else {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'Course not created!, start date and end date is required.',
      );
    }
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `CategoryId: ${payload.categoryId} is  not Valid!!! Please ensure the valid Category ID.`,
    );
  }
};

const getAllCoursesIntoDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  const allData = Course.find();

  // Filtering
  const excludeFields = [
    'level',
    'durationInWeeks',
    'language',
    'maxPrice',
    'minPrice',
    'sortOrder',
    'sortBy',
    'limit',
    'tags',
    'startDate',
    'endDate',
    'page',
  ];

  excludeFields.forEach((el) => delete queryObj[el]);

  //<============================================> pagination <===========================================>
  let page = 1;
  let limit = 10;
  let skip = 0;

  if (query.limit) {
    limit = Number(query.limit);
  }

  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginateQuery = allData.skip(skip);
  const limitQuery = paginateQuery.limit(limit);

  //===========================================> sorting and filtering <===========================================>
  const sortBy =
    query.sortBy === 'duration'
      ? 'durationInWeeks'
      : query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const sort: any = { [sortBy as any]: sortOrder };

  const filterQuery = limitQuery.find(queryObj).sort(sort);

  //==================================================> min max query <===============================================
  const minPrice = query.minPrice
    ? parseFloat(query.minPrice as string)
    : undefined;
  const maxPrice = query.maxPrice
    ? parseFloat(query.maxPrice as string)
    : undefined;

  const filter: any = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
  }

  if (minPrice !== undefined) {
    filter.price.$gte = minPrice;
  }

  if (maxPrice !== undefined) {
    filter.price.$lte = maxPrice;
  }

  const MinMaxQuery = filterQuery.find({ ...filter });

  //==================================> tags query <=====================================
  const tagName = query.tags;

  const baseQuery: any = {};

  if (tagName !== undefined) {
    baseQuery['tags.name'] = tagName;
    baseQuery['tags.isDeleted'] = false;
  }

  const tagQuery = MinMaxQuery.find(baseQuery);

  //=======================================> date filtering <====================================
  const DateFilter: any = {};

  const startDate = query.startDate;
  const endDate = query.endDate;

  if (startDate !== undefined || endDate !== undefined) {
    if (startDate !== undefined) {
      DateFilter.startDate = { $gte: startDate };
    }

    if (endDate !== undefined) {
      DateFilter.endDate = { $lte: endDate };
    }
  }

  const DateFiltering = tagQuery.find({ ...DateFilter });

  //===================================> filter with language <===============================
  const language: any = query.language;

  let languageFilter: any = {};

  if (language !== undefined) {
    languageFilter = { language: language };
  }

  const languageQuery = DateFiltering.find({ ...languageFilter });

  //===================================> filter with Provider <===============================
  const provider: any = query.provider;
  let providerFilter: any = {};
  if (provider !== undefined) {
    providerFilter = { provider: provider };
  }

  const providerQuery = languageQuery.find({ ...providerFilter });

  //===================================> filter with Duration of week <===============================
  const weekHourFilter: any = {};
  const weekHour: any = query.durationInWeeks;
  if (weekHour !== undefined) {
    weekHourFilter.durationInWeeks = parseFloat(weekHour);
  }

  const weekHourQuery = providerQuery.find({ ...weekHourFilter });

  //=======================================> filter with level <==============================================
  const levelFilter: any = {};
  const level: any = query.level;

  if (level !== undefined) {
    levelFilter['details.level'] = level;
  }

  const levelQuery = await weekHourQuery
    .find(levelFilter)
    .populate({ path: 'createdBy', select: '_id username email role' });

  return { levelQuery, page, limit };
};

const updateCourseIntoDB = async (_id: string, payload: Partial<TCourse>) => {
  const courseExists = await Course.findOne({ _id });

  if (courseExists) {
    const { tags, details, ...remainingCourseData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingCourseData,
    };

    if (payload?.durationInWeeks) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Weeks Duration can not Editable! If you want to modify the Week duration pease provide the course start and end date',
      );
    } else {
      if (details && Object.keys(details).length) {
        for (const [key, value] of Object.entries(details)) {
          modifiedUpdatedData[`details.${key}`] = value;
        }
      }

      //=================================== array of tags update ============================
      if (tags && tags.length > 0) {
        const filterDeletedTags = tags
          .filter((tag) => tag.name && tag.isDeleted)
          .map((el) => el.name);

        await Course.findByIdAndUpdate(_id, {
          $pull: {
            tags: {
              name: {
                $in: filterDeletedTags.map((tag) => new RegExp(tag, 'i')),
              },
            },
          },
        });

        //filter the new course tag
        const newTags = tags?.filter((tag) => tag.name && !tag.isDeleted);

        await Course.findByIdAndUpdate(_id, {
          $addToSet: { tags: { $each: newTags } },
        });
      }

      //============================ varify the category id ============================
      if (payload?.categoryId) {
        const categoryExists = await Category.findById({
          _id: payload?.categoryId,
        });

        if (categoryExists) {
          await Course.findByIdAndUpdate(_id, modifiedUpdatedData, {
            new: true,
            runValidators: true,
          });
        } else {
          throw new AppError(httpStatus.NOT_FOUND, 'Category ID is not Valid!');
        }
      }

      //=============== not alive and not start_date and end_date ====================

      if (!payload.startDate && !payload.endDate) {
        await Course.findByIdAndUpdate(_id, modifiedUpdatedData, {
          new: true,
          runValidators: true,
        });
      }

      //=================================START AND END DATE ALIVE ============================

      if (payload.startDate && payload.endDate) {
        //week calculation
        const durationInWeeks = calculateWeek(
          payload?.startDate,
          payload?.endDate,
        );

        const updatedData = { ...modifiedUpdatedData, durationInWeeks };
        await Course.findByIdAndUpdate(_id, updatedData, {
          new: true,
          runValidators: true,
        });
      }

      //=================================START AND END DATE ALIVE One ============================
      if (payload.startDate || payload.endDate) {
        const updatedData = { ...modifiedUpdatedData, payload };
        const update = await Course.findByIdAndUpdate(_id, updatedData, {
          new: true,
          runValidators: true,
        });

        //week calculation
        if (update?.startDate && update?.endDate) {
          const startDate: string = update.startDate;
          const endDate: string = update.endDate;

          const updateWeek = calculateWeek(startDate, endDate);

          const reUpdate = { durationInWeeks: updateWeek };
          await Course.findByIdAndUpdate(_id, reUpdate, {
            new: true,
          });
        }
      }

      //====================== fetch update data =================
      const result = await Course.findById({ _id }).populate({
        path: 'createdBy',
        select: '_id username email role',
      });

      return result;
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found!');
  }
};

export const Course_Service = {
  createCourseIntoDB,
  updateCourseIntoDB,
  getAllCoursesIntoDB,
};
