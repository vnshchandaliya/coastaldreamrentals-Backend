import Listing from "../models/Listing.js";

export const searchController = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const listings = await Listing.find({ status: "published" });

    const availableListings = listings.filter((listing) => {

      // ===============================
      // 1️⃣ CALENDAR CONFLICT ONLY
      // ===============================
      const hasConflict = listing.calendar?.some(day => {
        const booked = new Date(day.date);
        return booked >= start && booked < end && day.status === "R";
      });

      if (hasConflict) return false;

      // ===============================
      // 2️⃣ GUEST CHECK
      // ===============================
      if (guests && listing.property?.maxSleeps < Number(guests)) {
        return false;
      }

      return true;
    });

    res.json({
      results: availableListings,
      total: availableListings.length,
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};


