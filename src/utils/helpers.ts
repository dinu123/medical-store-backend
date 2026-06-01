import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const calculateGST = (amount: number, gstRate: number): number => {
  return (amount * gstRate) / 100;
};

export const calculateNetAmount = (amount: number, gstRate: number): number => {
  return amount + calculateGST(amount, gstRate);
};

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `INV-${timestamp}-${random}`;
};

export const calculateDaysToExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
