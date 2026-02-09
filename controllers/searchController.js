import Listing from "../models/Listing.js";

export const searchController = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Dates required" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const listings = await Listing.find({ status: "published" });

    const available = listings.filter((listing) => {
      // ✅ ONLY RATE CHECK
      const rateMatch = listing.rates?.some((rate) => {
        return (
          start >= new Date(rate.from) &&
          end <= new Date(rate.to)
        );
      });

      return rateMatch;
    });

    res.json({
      checkIn,
      checkOut,
      total: available.length,
      results: available,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
