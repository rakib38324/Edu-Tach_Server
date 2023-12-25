/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import {
  TPassword,
  TUser,
  TpreviousPassword_1,
  TpreviousPassword_2,
} from './user.interface';
import config from '../../config/config';
import bcrypt from 'bcrypt';

const Password = new Schema<TPassword>(
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
      type: Password,
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

UserSchema.pre('save', async function (next) {
  const user = this;

  //==========> Hash the current password if it exists
  if (user.password && typeof user.password.password === 'string') {
    user.password.password = await bcrypt.hash(
      user.password.password,
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

export const User = model<TUser>('User', UserSchema);
