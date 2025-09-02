import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/CategoriesController.js';

import { auth, authorize } from '../middelwear/auth.js';
import {uploadImage} from '../middelwear/multer.js';

const router = express.Router();

router.post('/', auth, authorize('admin'), uploadImage.single('image'),  createCategory);
router.put('/:id', auth, authorize('admin'), uploadImage.single('image'),  updateCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.delete('/:id', auth, authorize('admin'), deleteCategory);

export default router;
