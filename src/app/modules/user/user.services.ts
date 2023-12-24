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

  const newPassword = [
    {
      password: password,
      timestamp: new Date().toISOString(),
    },
  ];

  const totalData = {
    username: payload.username,
    password: newPassword,
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
        },
      },
    ]);
    return result[0];
  }
};

export const UserServices = {
  createUserIntoDB,
};
