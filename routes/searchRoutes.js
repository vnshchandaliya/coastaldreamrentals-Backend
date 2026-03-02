import express from "express";
import { searchController } from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", searchController);
router.get("/api/listings/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
