import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../types';

export const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || 'medical_store_secret_key';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  const payload = {
    id: user.id,
    email: user.email,
    shopName: user.shopName,
  };

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): any => {
  try {
    const secret = process.env.JWT_SECRET || 'medical_store_secret_key';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
