import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SupplierModel } from '../models/Supplier';
import { HTTP_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';

export const createSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, address, contactNumber, gstinNumber } = req.body;

    const supplier = await SupplierModel.create({
      name,
      address,
      contactNumber,
      gstinNumber,
    });

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: supplier,
      message: SUCCESS_MESSAGES.SUPPLIER_CREATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getSuppliers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const suppliers = await SupplierModel.find();

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getSupplierById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findById(id);

    if (!supplier) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.SUPPLIER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const supplier = await SupplierModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!supplier) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.SUPPLIER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: supplier,
      message: SUCCESS_MESSAGES.SUPPLIER_UPDATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const deleteSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findByIdAndDelete(id);

    if (!supplier) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.SUPPLIER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};
