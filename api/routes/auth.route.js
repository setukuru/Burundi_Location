import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Unified User/Proprietaire routes
router.post("/register", register); // unified register
router.post("/login", login);       // unified login

router.post("/logout", logout);

export default router;
