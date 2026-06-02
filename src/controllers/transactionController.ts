import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TransactionModel } from '../models/Transaction';
import { MedicineModel } from '../models/Medicine';
import { HTTP_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';
import { generateInvoiceNumber } from '../utils/helpers';
import { Transaction, TaxData } from '../types';

export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactionData = req.body;

    // Always auto-generate invoice number to avoid duplicates
    transactionData.invoiceNumber = generateInvoiceNumber();

    transactionData.userId = req.userId;

    // Update medicine stock for sell transactions
    if (transactionData.type === 'sell') {
      for (const item of transactionData.items) {
        if (!item.medicineId || item.medicineId === '') continue;
        try {
          const medicine = await MedicineModel.findById(item.medicineId);
          if (!medicine) {
            res.status(HTTP_CODES.NOT_FOUND).json({
              success: false,
              message: `Medicine ${item.medicineId} not found`,
            });
            return;
          }
          if (medicine.stockQuantity < item.quantity) {
            res.status(HTTP_CODES.BAD_REQUEST).json({
              success: false,
              message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
            });
            return;
          }
          medicine.stockQuantity -= item.quantity;
          await medicine.save();
        } catch {
          // Skip invalid medicineId
        }
      }
    } else if (transactionData.type === 'purchase') {
      // Update medicine stock for purchase transactions
      for (const item of transactionData.items) {
        if (!item.medicineId || item.medicineId === '') continue;
        try {
          const medicine = await MedicineModel.findById(item.medicineId);
          if (medicine) {
            medicine.stockQuantity += item.quantity;
            await medicine.save();
          }
        } catch {
          // Skip invalid medicineId
        }
      }
    }

    const transaction = await TransactionModel.create(transactionData);

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: transaction,
      message: SUCCESS_MESSAGES.TRANSACTION_CREATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, startDate, endDate } = req.query;

    const query: any = { userId: req.userId };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await TransactionModel.find(query).sort({ date: -1 });

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await TransactionModel.findById(id);

    if (!transaction) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getTaxData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = { userId: req.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await TransactionModel.find(query);

    let totalSales = 0;
    let totalPurchases = 0;
    let totalGstCollected = 0;
    let totalGstPaid = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'sell') {
        totalSales += transaction.totalAmount;
        totalGstCollected += transaction.gstAmount || 0;
      } else {
        totalPurchases += transaction.totalAmount;
        totalGstPaid += transaction.gstAmount || 0;
      }
    });

    const netProfit = totalSales - totalPurchases;
    const netGst = totalGstCollected - totalGstPaid;

    const taxData: TaxData = {
      totalSales,
      totalPurchases,
      gstCollected: totalGstCollected,
      gstPaid: totalGstPaid,
      netProfit,
      transactions,
      period: {
        startDate: (startDate as string) || new Date().toISOString().split('T')[0],
        endDate: (endDate as string) || new Date().toISOString().split('T')[0],
      },
    };

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: taxData,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await TransactionModel.find({ userId: req.userId });
    const medicines = await MedicineModel.find();

    let totalRevenue = 0;
    let totalTransactions = 0;
    let totalGst = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'sell') {
        totalRevenue += transaction.totalAmount;
        totalGst += transaction.gstAmount || 0;
      }
      totalTransactions += 1;
    });

    const lowStockMedicines = medicines.filter(
      (med) => med.stockQuantity <= med.minStockLevel
    ).length;

    const expiringSoon = medicines.filter((med) => {
      const daysToExpiry = Math.ceil(
        (new Date(med.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length;

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        totalGst,
        lowStockMedicines,
        expiringSoon,
        totalMedicines: medicines.length,
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
