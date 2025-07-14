// --- middlewares/authorize.js ---

import { verifyToken } from '../utils/token.js';
import userSchema from "../models/UserModel.js"
export const auth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = verifyToken(token);
    const user = await userSchema.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.isActive) return res.status(403).json({ message: 'User is inactive' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


export const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }
      next();
    };
  };
  

