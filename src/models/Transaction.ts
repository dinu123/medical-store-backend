import mongoose, { Schema, Document } from 'mongoose';
import { Transaction, TransactionItem } from '../types';

interface ITransaction extends Omit<Transaction, 'id'>, Document {}

const transactionItemSchema = new Schema({
  medicineId: { type: String, required: true },
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  batchNo: { type: String, required: true },
  expiryDate: { type: String, required: true },
}, { _id: false });

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ['sell', 'purchase'],
      required: true,
    },
    items: {
      type: [transactionItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    customerName: String,
    customerPhone: String,
    prescriptionFiles: [String],
    gstAmount: {
      type: Number,
      default: 0,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi'],
      default: 'cash',
    },
    supplierName: String,
    supplierContact: String,
    supplierGstin: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
