import express from "express";
import { previewBooking, createBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/preview", previewBooking);
router.post("/create", createBooking);

export default router;
