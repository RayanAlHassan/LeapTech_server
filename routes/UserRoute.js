import express from 'express';
import {
  login,
  logout,
  getProfile,
  getAll,
  deleteUser,
  register,
  getUserById,
} from '../controllers/UserController.js';
import { auth, authorize } from '../middelwear/auth.js';

const UserRouter = express.Router();

// Public routes
UserRouter.post('/register', register); // Signup and auto-login with token cookie
UserRouter.post('/login', login);       // Login and set token cookie

// Protected routes
UserRouter.post('/logout', auth, logout);            // Logout by clearing token
UserRouter.get('/profile', auth, getProfile);        // Get logged-in user's data


// Admin-only route to get user by ID
UserRouter.get('/getone/:id', auth, authorize('admin'), getUserById);

// Admin-only routes
UserRouter.get('/', auth, authorize('admin'), getAll);        // Get all users
UserRouter.delete('/:id', auth, authorize('admin'), deleteUser); // Delete user by ID
UserRouter.post('/logout', auth, logout);

export default UserRouter;
