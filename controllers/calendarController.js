import Listing from "../models/Listing.js";


export const addCalendarDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ error: "Date & status required" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Remove existing entry for same date
    listing.calendar = listing.calendar.filter(
      (c) => c.date.toISOString().split("T")[0] !== date
    );

    // Push new calendar entry
    listing.calendar.push({
      date: new Date(date),
      status,
      source: "admin",
    });

    await listing.save();

    res.json({
      message: "Calendar updated successfully",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("Calendar error:", err);
    res.status(500).json({ error: "Calendar update failed" });
  }
};

/**
 * ❌ REMOVE DATE (MAKE AVAILABLE)
 */
export const removeCalendarDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = listing.calendar.filter(
      (c) => c.date.toISOString().split("T")[0] !== date
    );

    await listing.save();

    res.json({
      message: "Date unblocked",
      calendar: listing.calendar,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove date" });
  }
};

// ================================
// GET CALENDAR
// ================================
export const getCalendar = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).select("calendar");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing.calendar);
  } catch (err) {
    res.status(500).json({ error: "Calendar fetch failed" });
  }
};

// ================================
// BLOCK DATES (ADMIN)
// ================================
export const blockDates = async (req, res) => {
  try {
    const { startDate, endDate, status = "H" } = req.body;

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const exists = listing.calendar.find(
        (c) => c.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10)
      );

      if (!exists) {
        listing.calendar.push({
          date: new Date(d),
          status,
          source: "admin",
        });
      }
    }

    await listing.save();
    res.json({ message: "Dates blocked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Block failed" });
  }
};

// ================================
// UNBLOCK DATES
// ================================
export const unblockDates = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    listing.calendar = listing.calendar.filter((c) => {
      const d = new Date(c.date);
      return d < start || d > end;
    });

    await listing.save();
    res.json({ message: "Dates unblocked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Unblock failed" });
  }
};
