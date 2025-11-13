import express from "express";
import { getHistory } from "../controllers/historique.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Get the current user's history
router.get("/", verifyToken, getHistory);

export default router;
