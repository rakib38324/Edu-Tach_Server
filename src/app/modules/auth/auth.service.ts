import httpStatus from 'http-status';
import AppError from '../../errors/App.Error';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config/config';
import { TjwtPayload, createToken } from './auth.utilis';

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

export const AuthServices = {
  loginUser,
};
