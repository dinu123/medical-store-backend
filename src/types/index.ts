// Types for the application

export interface Medicine {
  id?: string;
  name: string;
  expiryDate: string;
  batchNo: string;
  supplier: string;
  isScheduleH: boolean;
  price: number;
  mrp: number;
  stockQuantity: number;
  minStockLevel: number;
  category: string;
  manufacturer: string;
  gstRate: number;
  fifoLots?: MedicineLot[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MedicineLot {
  id?: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  supplierId: string;
  supplierName: string;
  gstRate: number;
}

export interface Supplier {
  id?: string;
  name: string;
  address: string;
  contactNumber: string;
  gstinNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  batchNo: string;
  expiryDate: string;
}

export interface Transaction {
  id?: string;
  type: 'sell' | 'purchase';
  items: TransactionItem[];
  totalAmount: number;
  date: string;
  customerName?: string;
  customerPhone?: string;
  prescriptionFiles?: string[];
  gstAmount: number;
  invoiceNumber: string;
  paymentMethod: 'cash' | 'card' | 'upi';
  supplierName?: string;
  supplierContact?: string;
  supplierGstin?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryItem {
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  isLowStock: boolean;
  daysToExpiry: number;
  purchasePrice: number;
  mrp: number;
}

export interface TaxData {
  totalSales: number;
  totalPurchases: number;
  gstCollected: number;
  gstPaid: number;
  netProfit: number;
  transactions: Transaction[];
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ExpiringMedicine {
  id: string;
  name: string;
  expiryDate: string;
  batchNo: string;
  supplier: string;
  quantity: number;
  daysToExpiry: number;
  price?: number;
  mrp?: number;
  gstRate?: number;
}

export interface User {
  id?: string;
  email: string;
  password?: string;
  phone?: string;
  shopName: string;
  address: string;
  gstin: string;
  contactNumber: string;
  ownerName: string;
  loginProvider?: 'email' | 'google' | 'facebook' | 'phone';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
