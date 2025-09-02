// --- controllers/userController.js ---
import UserSchema from "../models/UserModel.js"

import { generateToken } from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (await UserSchema.findOne({ email }))
      return res.status(400).json({ message: 'Email already in use' });

    const user = await UserSchema.create({ email, password, name, phone });

    const token = generateToken(user);

    res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({
      user: { id: user._id, email: user.email, role: user.role, name: user.name ,phone:user.phone}
    });
  
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserSchema.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Email not found' });
  
      const match = await user.comparePassword(password);
      if (!match) return res.status(401).json({ message: 'Incorrect Password' });
  
      const token = generateToken(user);
  
      // Send token in HTTP-only cookie
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({ message: "Login successful",token ,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            phone:user.phone
          }
        });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  //logout fct

  export const logout = (req, res) => {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
      .status(200)
      .json({ message: 'Logged out successfully' });
  };
  

// Fetch all users
export const getAll = async (req, res) => {
  try {
    const allUsers = await UserSchema.find().select('-password'); // exclude passwords for security
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch users" });
  }
};

// Get logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'no loged in user' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get one user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserSchema.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await UserSchema.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete user" });
  }
};
