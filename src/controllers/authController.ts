import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/helpers';
import { generateToken } from '../utils/jwt';
import { HTTP_CODES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants';
import { User } from '../types';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, phone, shopName, address, contactNumber, ownerName, gstin } = req.body;

    // Validate required fields
    if (!email && !phone) {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Email or phone number is required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { phone },
      ],
    });

    if (existingUser) {
      res.status(HTTP_CODES.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
      return;
    }

    // Create new user
    const userData: any = {
      shopName: shopName || 'My Store',
      address,
      contactNumber: contactNumber || phone,
      ownerName: ownerName || 'Owner',
      gstin,
    };

    if (email) {
      userData.email = email.toLowerCase();
      userData.loginProvider = 'email';
      if (password) {
        userData.password = await hashPassword(password);
      }
    }

    if (phone) {
      userData.phone = phone;
    }

    const user = await UserModel.create(userData);

    const token = generateToken(user as User);

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        contactNumber: user.contactNumber,
        ownerName: user.ownerName,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, phone } = req.body;

    // Find user by email or phone
    const user = await UserModel.findOne(
      email ? { email: email.toLowerCase() } : { phone }
    ).select('+password');

    if (!user) {
      res.status(HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Check password if provided
    if (password && user.password) {
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(HTTP_CODES.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
    }

    const token = generateToken(user as User);

    res.status(HTTP_CODES.OK).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        address: user.address,
        contactNumber: user.contactNumber,
        ownerName: user.ownerName,
        gstin: user.gstin,
      },
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const socialLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, phone, provider, shopName, ownerName } = req.body;

    let user = await UserModel.findOne(
      email ? { email: email.toLowerCase() } : { phone }
    );

    // If user doesn't exist, create new user
    if (!user) {
      user = await UserModel.create({
        email: email?.toLowerCase(),
        phone,
        shopName: shopName || 'My Store',
        ownerName: ownerName || 'Owner',
        contactNumber: phone,
        loginProvider: provider,
      });
    }

    const token = generateToken(user as User);

    res.status(HTTP_CODES.OK).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        contactNumber: user.contactNumber,
        ownerName: user.ownerName,
      },
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        address: user.address,
        contactNumber: user.contactNumber,
        ownerName: user.ownerName,
        gstin: user.gstin,
      },
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopName, address, contactNumber, ownerName, gstin } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        shopName,
        address,
        contactNumber,
        ownerName,
        gstin,
      },
      { new: true }
    );

    if (!user) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        address: user.address,
        contactNumber: user.contactNumber,
        ownerName: user.ownerName,
        gstin: user.gstin,
      },
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};
