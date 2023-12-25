/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import {
  TCurrentPassword,
  TUser,
  TpreviousPassword_1,
  TpreviousPassword_2,
  UserModel,
} from './user.interface';
import config from '../../config/config';
import bcrypt from 'bcrypt';

const CurentPassword = new Schema<TCurrentPassword>(
  {
    password: String,
    timestamp: Date,
  },
  {
    _id: false,
  },
);

const previousPassword_1 = new Schema<TpreviousPassword_1>(
  {
    previousPassword_1: String,
    timestamp: Date,
  },
  {
    _id: false,
  },
);

const previousPassword_2 = new Schema<TpreviousPassword_2>(
  {
    previousPassword_1: String,
    timestamp: Date,
  },
  {
    _id: false,
  },
);

const UserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentPassword: {
      type: CurentPassword,
      required: true,
    },
    previousPassword_1: {
      type: previousPassword_1,
    },
    previousPassword_2: {
      type: previousPassword_2,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

//========> hash password

UserSchema.pre('save', async function (next) {
  const user = this;

  //==========> Hash the current password if it exists
  if (user.password && typeof user.password === 'string') {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round),
    );
  }

  //==========> Hash the current password if it exists
  if (
    user.currentPassword &&
    typeof user.currentPassword.password === 'string'
  ) {
    user.currentPassword.password = await bcrypt.hash(
      user.currentPassword.password,
      Number(config.bcrypt_salt_round),
    );
  }

  //=========> Hash previousPassword_1 if it exists
  if (
    user.previousPassword_1 &&
    typeof user.previousPassword_1.previousPassword_1 === 'string'
  ) {
    user.previousPassword_1.previousPassword_1 = await bcrypt.hash(
      user.previousPassword_1.previousPassword_1,
      Number(config.bcrypt_salt_round),
    );
  }

  //===========> Hash previousPassword_2 if it exists
  if (
    user.previousPassword_2 &&
    typeof user.previousPassword_2.previousPassword_1 === 'string'
  ) {
    user.previousPassword_2.previousPassword_1 = await bcrypt.hash(
      user.previousPassword_2.previousPassword_1,
      Number(config.bcrypt_salt_round),
    );
  }

  // Move on to the next middleware or the save operation
  next();
});

UserSchema.statics.isUserExistsByUserName = async function (username: string) {
  return await User.findOne({ username });
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hasPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hasPassword);
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};
export const User = model<TUser, UserModel>('User', UserSchema);
