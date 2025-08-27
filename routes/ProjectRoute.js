import express from "express";
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectsByCategoryTitle,
} from "../controllers/ProjectController.js";
import { uploadImage } from "../middelwear/multer.js"; // adjust path if needed

const ProjectRoutes = express.Router();

/**
 * @route POST /api/projects
 * @desc Create a project with image upload
 */
ProjectRoutes.post("/", uploadImage.single("image"), createProject);

/**
 * @route GET /api/projects/category/:categoryId
 * @desc Get projects by category ID
 */
ProjectRoutes.get("/category/title/:categoryTitle", getProjectsByCategoryTitle);

/**
 * @route GET /api/projects/:id
 * @desc Get single project by ID
 */
ProjectRoutes.get("/:id", getProjectById);
ProjectRoutes.get("/", getAllProjects);

/**
 * @route PUT /api/projects/:id
 * @desc Update a project (with optional new image)
 */
ProjectRoutes.put("/:id", uploadImage.single("image"), updateProject);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project (removes associated image too)
 */
ProjectRoutes.delete("/:id", deleteProject);

export default ProjectRoutes;
