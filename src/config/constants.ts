export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  MEDICINE_NOT_FOUND: 'Medicine not found',
  SUPPLIER_NOT_FOUND: 'Supplier not found',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  INVALID_INPUT: 'Invalid input provided',
  INTERNAL_ERROR: 'Internal server error',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  MEDICINE_CREATED: 'Medicine added successfully',
  MEDICINE_UPDATED: 'Medicine updated successfully',
  MEDICINE_DELETED: 'Medicine deleted successfully',
  TRANSACTION_CREATED: 'Transaction recorded successfully',
  SUPPLIER_CREATED: 'Supplier added successfully',
  SUPPLIER_UPDATED: 'Supplier updated successfully',
};

export const GST_RATES = {
  FIVE: 5,
  TWELVE: 12,
  EIGHTEEN: 18,
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
};

export const TRANSACTION_TYPES = {
  SELL: 'sell',
  PURCHASE: 'purchase',
};
