/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TPasswordChange, TUser } from './user.interface';
import config from '../../config/config';
import bcrypt from 'bcrypt';

const PasswordChange = new Schema<TPasswordChange>(
  {
    password: String,
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
      type: [PasswordChange],
      required: true,
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

// Hash the password before saving the user
UserSchema.pre<TUser>('save', async function (next) {
  const user = this;

  // Iterate over the password array and hash each password individually
  user.password = await Promise.all(
    user.password.map(async (passwordChange) => {
      const hashedPassword = await bcrypt.hash(
        passwordChange.password,
        Number(config.bcrypt_salt_round),
      );

      return {
        password: hashedPassword,
        timestamp: passwordChange.timestamp,
      };
    }),
  );

  next();
});

export const User = model<TUser>('User', UserSchema);
