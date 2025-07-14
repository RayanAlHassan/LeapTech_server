import express from "express";
import { createContact, getAllContacts,getContactById } from "../controllers/ContactController.js";
import { auth, authorize } from "../middelwear/auth.js";

const ContactRouter = express.Router();

ContactRouter.post("/", createContact); // Public
ContactRouter.get("/", auth, authorize("admin"), getAllContacts); // Admin only
ContactRouter.get("/:id", auth, authorize("admin"), getContactById); // Admin-only

export default ContactRouter;
