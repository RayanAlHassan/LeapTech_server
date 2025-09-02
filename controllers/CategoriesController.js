// import CategoryModel from '../models/CategoryModel.js';

// // Create category
// export const createCategory = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const category = await CategoryModel.create({ title, description });
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating category', error: error.message });
//   }
// };

// // Get all categories
// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await CategoryModel.find().sort({ createdAt: -1 });
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching categories', error: error.message });
//   }
// };

// // Get one category by ID
// export const getCategoryById = async (req, res) => {
//   try {
//     const category = await CategoryModel.findById(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching category', error: error.message });
//   }
// };

// // Update category
// export const updateCategory = async (req, res) => {
//   try {
//     const updated = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Category not found' });
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating category', error: error.message });
//   }
// };

// // Delete category
// export const deleteCategory = async (req, res) => {
//   try {
//     const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Category not found' });
//     res.json({ message: 'Category deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting category', error: error.message });
//   }
// };
// category with image 
import CategoryModel from "../models/CategoryModel.js";
import fs from "fs";

// Create category with image
export const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path); // remove uploaded file if validation fails
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Upload an image" });
    }

    const image = req.file.filename;

    const category = await CategoryModel.create({
      title,
      description,
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Get one category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

// Update category with image replacement
export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body || {};

    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(404).json({ message: "Category not found" });
    }

    // Update only provided fields
    if (title !== undefined) existingCategory.title = title;
    if (description !== undefined) existingCategory.description = description;

    if (req.file) {
      const oldImagePath = `uploads/images/${existingCategory.image}`;

      existingCategory.image = req.file.filename;

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await existingCategory.save();

    res.json(existingCategory);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// Delete category with image deletion
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const imagePath = `uploads/images/${category.image}`;
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.error("Error deleting category image:", err);
      return res.status(500).json({ message: "Error deleting category image" });
    }

    await CategoryModel.deleteOne({ _id: req.params.id });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};
