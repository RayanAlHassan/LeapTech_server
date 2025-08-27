// controllers/projectController.js
import ProjectModel from "../models/ProjectModel.js";
import fs from "fs";
import CategoryModel from "../models/CategoryModel.js";

// Create Project with image handling
export const createProject = async (req, res) => {
  try {
    const { categoryId, title, description, url } = req.body;

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

    // Ensure category exists
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(404).json({ message: "category not found" });
    }

    const image = req.file.filename;

    const project = await ProjectModel.create({
      category: categoryId,
      title,
      description,
      url,
      image,
    });

    res.status(201).json(project);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Get projects by category
// Get projects by category title
export const getProjectsByCategoryTitle = async (req, res) => {
  try {
    const { categoryTitle } = req.params;

    // Find the category by title
    const category = await CategoryModel.findOne({ title: categoryTitle });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch projects under that category
    const projects = await ProjectModel.find({ category: category._id })
      .populate("category", "title description")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};


// Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id).populate(
      "category"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Update Project with image replacement
export const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const { categoryId, title, description, url } = req.body;

    const existingProject = await ProjectModel.findById(id);
    if (!existingProject) {
      if (req.file) {
        const path = `uploads/images/${req.file.filename}`;
        fs.unlinkSync(path);
      }
      return res.status(404).json({ message: "Project not found" });
    }

    // Update only provided fields
    if (categoryId !== undefined) existingProject.category = categoryId;
    if (title !== undefined) existingProject.title = title;
    if (description !== undefined) existingProject.description = description;
    if (url !== undefined) existingProject.url = url;

    if (req.file) {
      const oldImagePath = `uploads/images/${existingProject.image}`;
      existingProject.image = req.file.filename;

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await existingProject.save();

    res.json(existingProject);
  } catch (error) {
    if (req.file) {
      const path = `uploads/images/${req.file.filename}`;
      fs.unlinkSync(path);
    }
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

// Delete Project with image deletion
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const imagePath = `uploads/images/${project.image}`;
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.error("Error deleting project image:", err);
      return res.status(500).json({ message: "Error deleting project image" });
    }

    await ProjectModel.deleteOne({ _id: req.params.id });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};
// Get all projects (with category info)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("category", "title description") // populate category FK
      .sort({ createdAt: -1 }); // newest first
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all projects", error: error.message });
  }
};
