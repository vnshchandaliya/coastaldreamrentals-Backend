import express from "express";
import { createInquiry, getAllInquiries } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);          // user
router.get("/", getAllInquiries);          // admin

export default router;
