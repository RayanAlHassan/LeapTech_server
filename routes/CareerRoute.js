// routes/careerRoutes.js
import express from 'express';

import {
  createCareer,
  getAllCareers,
  getCareerById,
  apply,
  getApplications,
  getApplicationById,
} from '../controllers/CareerController.js';
import { auth, authorize } from '../middelwear/auth.js';
import { uploadCV } from '../middelwear/multer.js';

const CareerRoute = express.Router();

CareerRoute.get('/', getAllCareers);

// Apply route with multer middleware to handle file upload from form field 'cv'
CareerRoute.post('/apply', uploadCV.single('cvUrl'), apply);

// Admin routes
CareerRoute.post('/', auth, authorize('admin'), createCareer);

CareerRoute.get('/applications', auth, authorize('admin'), getApplications);
CareerRoute.get('/applications/:id', auth, authorize('admin'), getApplicationById);
CareerRoute.get('/:id', getCareerById);

export default CareerRoute;
