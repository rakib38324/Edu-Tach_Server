import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utility/catchAsync';
import config from '../config/config';
import UnauthrizedError from '../errors/unauthorizedError';

const Auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(
    async (req: Request, response: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      if (!token) {
        throw new UnauthrizedError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
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
        throw new UnauthrizedError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }

      if (
        isUserExists?.currentPassword.timestamp &&
        User.isJWTIssuedBeforePasswordChanged(
          isUserExists?.currentPassword.timestamp,
          iat as number,
        )
      ) {
        throw new UnauthrizedError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }

      if (requiredRole && !requiredRole.includes(role)) {
        throw new UnauthrizedError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }

      req.user = decoded;

      next();
    },
  );
};

export default Auth;
