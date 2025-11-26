import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// Get all reviews for a specific property
router.get("/property/:propertyId", async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new review
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
