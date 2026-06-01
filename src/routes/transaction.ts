import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTaxData,
  getDashboardStats,
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/tax-data', authMiddleware, getTaxData);
router.get('/dashboard-stats', authMiddleware, getDashboardStats);
router.get('/:id', authMiddleware, getTransactionById);

export default router;
