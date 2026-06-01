import express from 'express';
import {
  createMedicine,
  getMedicines,
  getMedicineById,
  searchMedicines,
  updateMedicine,
  deleteMedicine,
  getInventory,
  getExpiringMedicines,
  exportInventory,
  bulkUploadMedicines,
} from '../controllers/medicineController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createMedicine);
router.get('/', authMiddleware, getMedicines);
router.get('/search', authMiddleware, searchMedicines);
router.get('/inventory', authMiddleware, getInventory);
router.get('/inventory/export', authMiddleware, exportInventory);
router.get('/expiring', authMiddleware, getExpiringMedicines);
router.post('/bulk-upload', authMiddleware, bulkUploadMedicines);
router.get('/:id', authMiddleware, getMedicineById);
router.put('/:id', authMiddleware, updateMedicine);
router.delete('/:id', authMiddleware, deleteMedicine);

export default router;
