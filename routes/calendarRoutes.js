import express from "express";
const router = express.Router();

// Helper to generate random status
const statuses = ["A", "CI", "CO", "R", "T"];
const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

// Function to generate days data for 3 months (for search)
const generateCalendar = (year) => {
  const months = [10, 11, 12]; // Oct, Nov, Dec
  const allMonths = {};

  months.forEach((month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      days.push({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD
        status: randomStatus(),
      });
    }
    allMonths[month] = days;
  });

  return allMonths;
};

// Random property list (8)
const properties = [
  { id: 7230, name: "Beach Sanctuary" },
  { id: 7303, name: "Crystal Sands 1BR 1.5BA Sleeps 6 104A" },
  { id: 7418, name: "Sea Dunes 404" },
  { id: 7445, name: "Grand Caribbean West 213" },
  { id: 7463, name: "Jade East 210" },
  { id: 7468, name: "Shoreline Towers 2051" },
  { id: 7526, name: "SummerSpell 106" },
  { id: 7563, name: "Breakers East 803" },
];

// Store generated data once (simulate DB)
const year = 2025;
const allProperties = properties.map((p) => ({
  ...p,
  calendar: generateCalendar(year),
}));

// ✅ Route: Get single month data
router.get("/month", (req, res) => {
  const { month = 10, year = 2025 } = req.query;

  const data = allProperties.map((prop) => ({
    id: prop.id,
    name: prop.name,
    days: prop.calendar[month],
  }));

  res.json({ month, year, data });
});

// ✅ Route: Search by date range (fixed logic)
router.get("/search", (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: "Missing checkIn or checkOut date" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Filter available properties
  const availableProperties = allProperties.filter((prop) => {
    const allDays = Object.values(prop.calendar).flat();

    // Days between checkIn and checkOut
    const daysInRange = allDays.filter((d) => {
      const current = new Date(d.date);
      return current >= checkInDate && current <= checkOutDate;
    });

    // If any day is reserved or turnover, property unavailable
    const isUnavailable = daysInRange.some((d) => d.status === "R" || d.status === "T");

    return !isUnavailable; // ✅ Only return if fully available
  });

  res.json({
    checkIn,
    checkOut,
    availableCount: availableProperties.length,
    availableProperties,
  });
});

export default router;
