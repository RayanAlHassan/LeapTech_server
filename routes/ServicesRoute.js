// import express from 'express';
// import {
//   createService,
//   getAllServices,
//   getServiceById,
//   updateService,
//   deleteService
// } from '../controllers/ServicesController.js';

// import { auth, authorize } from '../middelwear/auth.js';

// const router = express.Router();

// router.post('/', auth, authorize('admin'), createService);
// router.get('/', getAllServices);
// router.get('/:id', getServiceById);
// router.put('/:id', auth, authorize('admin'), updateService);
// router.delete('/:id', auth, authorize('admin'), deleteService);

// export default router;
import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory
} from '../controllers/ServicesController.js';

import { auth, authorize } from '../middelwear/auth.js';
import {uploadImage} from '../middelwear/multer.js';

const router = express.Router();
// ✅ Apply `upload.single('image')`
router.post('/', auth, authorize('admin'), uploadImage.single('image'), createService);
router.put('/:id', auth, authorize('admin'), uploadImage.single('image'), updateService);
router.get('/', getAllServices);
router.get('/category/:categoryTitle', getServicesByCategory);
router.get('/:id', getServiceById);
router.delete('/:id', auth, authorize('admin'), deleteService);

export default router;
