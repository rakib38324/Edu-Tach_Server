import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';

import { TLoginUser } from './auth.interface';
import config from '../../config/config';
import { TjwtPayload, createToken } from './auth.utilis';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByUserName(payload.username);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  ///====> checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.currentPassword?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TjwtPayload = {
    _id: isUserExists?._id,
    username: isUserExists?.username,
    role: isUserExists?.role,
    email: isUserExists?.email,
  };

  //===========> create token and sent to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiress_in as string,
  );

  return { user: jwtPayload, token: accessToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByUserName(userData.username);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const currentPassword = payload?.currentPassword;
  const hashpassword = isUserExists?.currentPassword?.password;

  ///====> checking if the given password and exists password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    currentPassword,
    hashpassword,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  //=======> check new password are same as previous 1 password
  const previous_1 = isUserExists?.previousPassword_1?.previousPassword_1;
  const previous_2 = isUserExists?.previousPassword_2?.previousPassword_2;
  const current_password = isUserExists?.currentPassword?.password;
  
  const currentPasswordDate = isUserExists?.currentPassword?.timestamp;

  if (currentPasswordDate) {
    const formattedDate = `${currentPasswordDate.getFullYear()}-${(
      currentPasswordDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentPasswordDate
      .getDate()
      .toString()
      .padStart(2, '0')} at ${
      currentPasswordDate.getHours() % 12 || 12
    }:${currentPasswordDate.getMinutes().toString().padStart(2, '0')} ${
      currentPasswordDate.getHours() >= 12 ? 'PM' : 'AM'
    }`;

    if (current_password) {
      //=========> if new password and current password same, it is not possbile to change
      const isPasswordMatch = await User.isPasswordMatched(
        payload.newPassword,
        current_password,
      );
      if (isPasswordMatch) {
        return {
          message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedDate}).`,
        };
      }
    }

    if (previous_1) {
      //====> if new password and previous_1 password same, it is not possbile to change
      const isPasswordMatchwithPreviousPassword_1 =
        await User.isPasswordMatched(payload.newPassword, previous_1);
      if (isPasswordMatchwithPreviousPassword_1) {
        return {
          message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedDate}).`,
        };
      }
    }

    if (previous_2) {
      //=========> if new password and previous_2 same, it is not possbile to change
      const isPasswordMatchwithPreviousPassword_2 =
        await User.isPasswordMatched(payload.newPassword, previous_2);
      if (isPasswordMatchwithPreviousPassword_2) {
        return {
          message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedDate}).`,
        };
      }
    }
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const updatedData = {
    password: newHasedPassword,
    currentPassword: {
      password: newHasedPassword,
      timestamp: new Date(),
    },
    previousPassword_1: {
      previousPassword_1: isUserExists?.currentPassword?.password,
      timestamp: isUserExists?.currentPassword?.timestamp,
    },
    previousPassword_2: {
      previousPassword_2: previous_1,
      timestamp: isUserExists?.previousPassword_1?.timestamp,
    },
  };

  await User.findOneAndUpdate(
    {
      username: userData.username,
    },
    updatedData,
  );

  if (isUserExists) {
    const result = await User.aggregate([
      {
        $match: { username: isUserExists?.username },
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

export const AuthServices = {
  loginUser,
  changePassword,
};
