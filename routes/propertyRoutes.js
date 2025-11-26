import express from "express";
import {
  addProperty,
  getPropertyById,
  checkAvailability,
  reserveDates
} from "../controllers/propertyController.js"; // FIXED

const router = express.Router();

router.post("/add", addProperty);
router.get("/:id", getPropertyById);
router.get("/check", checkAvailability);
router.post("/reserve", reserveDates);

export default router;
