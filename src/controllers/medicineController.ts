import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MedicineModel } from '../models/Medicine';
import { HTTP_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';
import { calculateDaysToExpiry } from '../utils/helpers';
import { Medicine, InventoryItem, ExpiringMedicine } from '../types';

export const createMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicineData = req.body;

    const medicine = await MedicineModel.create({
      ...medicineData,
      fifoLots: medicineData.fifoLots || [],
    });

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: medicine,
      message: SUCCESS_MESSAGES.MEDICINE_CREATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicines = await MedicineModel.find();

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getMedicineById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const medicine = await MedicineModel.findById(id);

    if (!medicine) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.MEDICINE_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const searchMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    const medicines = await MedicineModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { manufacturer: { $regex: query, $options: 'i' } },
        { batchNo: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const updateMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const medicine = await MedicineModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!medicine) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.MEDICINE_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: medicine,
      message: SUCCESS_MESSAGES.MEDICINE_UPDATED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const deleteMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const medicine = await MedicineModel.findByIdAndDelete(id);

    if (!medicine) {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.MEDICINE_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.MEDICINE_DELETED,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicines = await MedicineModel.find();

    const inventory: InventoryItem[] = medicines.map((medicine) => ({
      medicineId: medicine._id.toString(),
      medicine,
      quantity: medicine.stockQuantity,
      isLowStock: medicine.stockQuantity <= medicine.minStockLevel,
      daysToExpiry: calculateDaysToExpiry(medicine.expiryDate),
      purchasePrice: medicine.price,
      mrp: medicine.mrp,
    }));

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const getExpiringMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysNumber = parseInt(days as string) || 30;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysNumber);

    const medicines = await MedicineModel.find({
      expiryDate: {
        $lte: cutoffDate.toISOString().split('T')[0],
        $gt: new Date().toISOString().split('T')[0],
      },
    });

    const expiringMedicines: ExpiringMedicine[] = medicines.map((med) => ({
      id: med._id.toString(),
      name: med.name,
      expiryDate: med.expiryDate,
      batchNo: med.batchNo,
      supplier: med.supplier,
      quantity: med.stockQuantity,
      daysToExpiry: calculateDaysToExpiry(med.expiryDate),
      price: med.price,
      mrp: med.mrp,
      gstRate: med.gstRate,
    }));

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: expiringMedicines,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const exportInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicines = await MedicineModel.find();

    const headers = ['Medicine Name', 'Category', 'Manufacturer', 'Batch Number', 'Expiry Date', 'Current Stock', 'Min Stock Level', 'Stock Status', 'Purchase Price', 'MRP', 'Total Value', 'GST Rate'];

    const rows = medicines.map(med => [
      med.name,
      med.category,
      med.manufacturer,
      med.batchNo,
      med.expiryDate,
      med.stockQuantity,
      med.minStockLevel,
      med.stockQuantity <= med.minStockLevel ? 'LOW STOCK' : med.stockQuantity === 0 ? 'OUT OF STOCK' : 'ADEQUATE',
      med.price.toFixed(2),
      med.mrp.toFixed(2),
      (med.stockQuantity * med.price).toFixed(2),
      `${med.gstRate}%`,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const filename = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HTTP_CODES.OK).send(csvContent);
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};

export const bulkUploadMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { medicines } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Invalid medicines data',
      });
      return;
    }

    const createdMedicines = await MedicineModel.insertMany(medicines);

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: createdMedicines,
      message: `${createdMedicines.length} medicines added successfully`,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: (error as Error).message,
    });
  }
};
