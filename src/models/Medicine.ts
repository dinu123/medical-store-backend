import mongoose, { Schema, Document } from 'mongoose';
import { Medicine, MedicineLot } from '../types';

interface IMedicine extends Omit<Medicine, 'id'>, Document {}

const medicineLotSchema = new Schema({
  batchNo: { type: String, required: true },
  expiryDate: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: String, required: true },
  supplierId: { type: String },
  supplierName: { type: String },
  gstRate: { type: Number, default: 5 },
}, { _id: false });

const medicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    batchNo: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    isScheduleH: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    gstRate: {
      type: Number,
      default: 5,
      enum: [5, 12, 18],
    },
    fifoLots: {
      type: [medicineLotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', category: 'text', manufacturer: 'text' });

export const MedicineModel = mongoose.model<IMedicine>('Medicine', medicineSchema);
