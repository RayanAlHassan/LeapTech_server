// import ServiceModel from '../models/ServicesModel.js';
// import CategoryModel from '../models/CategoryModel.js';

// // Create Service
// export const createService = async (req, res) => {
//   try {
//     const { categoryId, title, description } = req.body;
//     const category = await CategoryModel.findById(categoryId);
//     if (!category) return res.status(404).json({ message: 'Category not found' });

//     const service = await ServiceModel.create({ category: categoryId, title, description });
//     res.status(201).json(service);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating service', error: error.message });
//   }
// };

// // Get all services (with category info)
// export const getAllServices = async (req, res) => {
//   try {
//     const services = await ServiceModel.find().populate('category','title').sort({ createdAt: -1 });
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching services', error: error.message });
//   }
// };

// // Get services by category
// export const getServicesByCategory = async (req, res) => {
//   try {
//     const { categoryTitle } = req.params;

//     // Find category by title (not name)
//     const category = await CategoryModel.findOne({ title: categoryTitle });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     // Find services with this category _id
//     const services = await ServiceModel.find({ category: category._id });

//     // Return array of services (or you can also send category info if you want)
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching services by category', error: error.message });
//   }
// };

// // Get single service
// export const getServiceById = async (req, res) => {
//   try {
//     const service = await ServiceModel.findById(req.params.id).populate('category');
//     if (!service) return res.status(404).json({ message: 'Service not found' });
//     res.json(service);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching service', error: error.message });
//   }
// };

// // Update service
// export const updateService = async (req, res) => {
//   try {
//     const updated = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Service not found' });
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating service', error: error.message });
//   }
// };

// // Delete service
// export const deleteService = async (req, res) => {
//   try {
//     const deleted = await ServiceModel.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Service not found' });
//     res.json({ message: 'Service deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting service', error: error.message });
//   }
// };
import ServiceModel from "../models/ServicesModel.js";
import CategoryModel from "../models/CategoryModel.js";
import fs from "fs";

// Create Service with image handling
export const createService = async (req, res) => {
  try {
    const categoryId = req.body?.categoryId;
    const title = req.body?.title;
    const description = req.body?.description;

    if (!categoryId || !title || !description) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(400).json("All fields are required");
    }

    if (!req.file) {
      return res.status(400).json("Upload an image");
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(404).json({ message: "Category not found" });
    }

    const image = req.file.filename;

    const service = await ServiceModel.create({
      category: categoryId,
      title,
      description,
      image,
    });

    res.status(201).json(service);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

// Get all services (with category info)
export const getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find()
      .populate("category", "title description")
      .sort({ createdAt: 1 });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryTitle } = req.params;
    const category = await CategoryModel.findOne({ title: categoryTitle });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const services = await ServiceModel.find({ category: category._id });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching services by category",
        error: error.message,
      });
  }
};

// Get single service
export const getServiceById = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id).populate(
      "category"
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

// Update service with image replacement & old image deletion

export const updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const { categoryId, title, description } = req.body || {}; // safely destructure

    const existingService = await ServiceModel.findById(id);
    if (!existingService) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(404).json({ message: "Service not found" });
    }

    // Update only provided fields
    if (categoryId !== undefined) existingService.category = categoryId;
    if (title !== undefined) existingService.title = title;
    if (description !== undefined) existingService.description = description;

    if (req.file) {
      const oldImagePath = `uploads/images/${existingService.image}`;

      existingService.image = req.file.filename;

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await existingService.save();

    res.json(existingService);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

// Delete service with image deletion
export const deleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const imagePath = `uploads/images/${service.image}`;
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.error("Error deleting service image:", err);
      return res.status(500).json({ message: "Error deleting service image" });
    }

    await ServiceModel.deleteOne({ _id: req.params.id });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
