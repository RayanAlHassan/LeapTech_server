import express from "express";
import {
  submitConsult,
  getAllConsults,
  getConsultById
} from "../controllers/ConsultController.js";
import { auth, authorize } from "../middelwear/auth.js";

const router = express.Router();

router.post("/", submitConsult);

// Admin only routes
router.get("/", auth, authorize("admin"), getAllConsults);
router.get("/:id", auth, authorize("admin"), getConsultById);

export default router;
