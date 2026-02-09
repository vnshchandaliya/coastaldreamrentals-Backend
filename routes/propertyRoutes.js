import express from "express";
import {
  addProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  checkAvailability,
  reserveDates,
} from "../controllers/propertyController.js";

import upload from "../middleware/uploadMiddleware.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 PUBLIC ROUTES (order matters)
router.get("/:id/availability", checkAvailability);
router.post("/:id/reserve", reserveDates);
router.get("/:id", getPropertyById);

// 🔐 ADMIN ROUTES
router.post(
  "/",
  isAuth,
  isAdmin,
  upload.array("images", 5),
  addProperty
);

router.put(
  "/:id",
  isAuth,
  isAdmin,
  upload.array("images", 5),
  updateProperty
);

router.delete(
  "/:id",
  isAuth,
  isAdmin,
  deleteProperty
);

export default router;
