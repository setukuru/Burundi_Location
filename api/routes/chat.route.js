import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
  confirmClient,
  unconfirmClient,
  getChatsForProperty
} from "../controllers/chat.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/property/:propertyId", verifyToken, getChatsForProperty);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
router.patch("/:chatId/confirm", verifyToken, confirmClient);
router.patch("/:chatId/unconfirm", verifyToken, unconfirmClient);

export default router;