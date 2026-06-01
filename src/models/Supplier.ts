import mongoose, { Schema, Document } from 'mongoose';
import { Supplier } from '../types';

interface ISupplier extends Omit<Supplier, 'id'>, Document {}

const supplierSchema = new Schema<ISupplier>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    gstinNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

export const SupplierModel = mongoose.model<ISupplier>('Supplier', supplierSchema);
