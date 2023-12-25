/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TCurrentPassword = {
  password: string;
  timestamp?: Date;
};
export type TpreviousPassword_1 = {
  previousPassword_1: string;
  timestamp?: Date;
};
export type TpreviousPassword_2 = {
  previousPassword_1: string;
  timestamp?: Date;
};

export type TUser = {
  username: string;
  email: string;
  password: string;
  currentPassword: TCurrentPassword;
  previousPassword_1: TpreviousPassword_1;
  previousPassword_2: TpreviousPassword_2;
  role: 'user' | 'admin';
  _id: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByUserName(username: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hasPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
