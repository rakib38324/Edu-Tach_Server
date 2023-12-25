import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUser) => {
  const { username, password } = payload;
  const userExists = await User.findOne({ username });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists!, Duplicate username.',
    );
  }

  const currentPassword = {
    password: password,
    timestamp: new Date(),
  };
  const previousPassword_1 = {
    // previousPassword_1: '',
    timestamp: new Date(),
  };
  const previousPassword_2 = {
    // previousPassword_2: '',
    timestamp: new Date(),
  };

  const totalData = {
    username: payload.username,
    password,
    currentPassword: currentPassword,
    previousPassword_1: previousPassword_1,
    previousPassword_2: previousPassword_2,
    email: payload.email,
    role: payload.role,
  };

  const user = await User.create(totalData);

  if (user) {
    const result = await User.aggregate([
      {
        $match: { username: user?.username },
      },
      {
        $project: {
          password: 0,
          currentPassword: 0,
          previousPassword_1: 0,
          previousPassword_2: 0,
          __v: 0,
        },
      },
    ]);
    return result[0];
  }
};

export const UserServices = {
  createUserIntoDB,
};
