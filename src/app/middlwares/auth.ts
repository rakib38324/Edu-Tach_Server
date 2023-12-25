import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utility/catchAsync';
import AppError from '../errors/App.Error';
import config from '../config/config';

const Auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(
    async (req: Request, response: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
      }

      // invalid token - synchronous
      // ===> check the if the token valid

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, username, iat } = decoded;

      //===>check if the user is exists

      const isUserExists = await User.isUserExistsByUserName(username);

      if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
      }

      if (
        isUserExists?.currentPassword.timestamp &&
        User.isJWTIssuedBeforePasswordChanged(
          isUserExists?.currentPassword.timestamp,
          iat as number,
        )
      ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
      }

      if (requiredRole && !requiredRole.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
      }

      req.user = decoded;

      next();
    },
  );
};

export default Auth;
