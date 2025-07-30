// ChatBotRoute.js
import express from "express";
import { handleChatMessage } from "../controllers/ChatBotController.js";

const router = express.Router();

router.post("/", handleChatMessage);

export default router;
