import express from "express";
import { chatResponse, createChat, streamResponse,getChatHistory } from "../controller/chat.controller.js";
import { clerkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/message",clerkAuth, chatResponse);
router.post("/create", clerkAuth,createChat);
router.post("/stream", clerkAuth,streamResponse);
router.get("/:chatId",clerkAuth,getChatHistory)
export default router;
