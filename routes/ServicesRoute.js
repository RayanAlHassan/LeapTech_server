import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/ServicesController.js';

import { auth, authorize } from '../middelwear/auth.js';

const router = express.Router();

router.post('/', auth, authorize('admin'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', auth, authorize('admin'), updateService);
router.delete('/:id', auth, authorize('admin'), deleteService);

export default router;
