import express from "express";
import {
  getLocataires,
  getProprietaires,
  getProperties,
  blockLocataire,
  getBlockedLocataires,
  blockProprietaire,
  getBlockedProprietaires,
  unblockUser,
} from "../controllers/admin.controller.js";

import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Apply verifyAdmin middleware to all admin routes
router.use(verifyAdmin);

// Fetch all users by role
router.get("/locataires", getLocataires);
router.get("/proprietaires", getProprietaires);

// Fetch all properties
router.get("/properties", getProperties);

// Block users
router.put("/block/locataire/:id", blockLocataire);
router.put("/block/proprietaire/:id", blockProprietaire);

// Fetch blocked users
router.get("/blocked/locataires", getBlockedLocataires);
router.get("/blocked/proprietaires", getBlockedProprietaires);
router.put("/unblock/:id", unblockUser);

export default router;
