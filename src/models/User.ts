import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types';

interface IUser extends Omit<User, 'id'>, Document {}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gstin: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    loginProvider: {
      type: String,
      enum: ['email', 'google', 'facebook', 'phone'],
      default: 'email',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
