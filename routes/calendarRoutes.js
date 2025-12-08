import express from "express";
const router = express.Router();

// Status: A = Available, R = Reserved, H = Turnover
const getRandomBlock = () => Math.floor(Math.random() * 6) + 2;

const formatDate = (y, m, d) =>
  new Date(y, m - 1, d).toISOString().split("T")[0];

// Generate one month calendar
const generateCalendar = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  let days = [];
  let used = new Set();
  let current = 1;

  while (current <= daysInMonth) {
    // Reserved block size 1–3 days only
    const blockSize = Math.floor(Math.random() * 3) + 1;

    const start = current;
    const end = Math.min(start + blockSize - 1, daysInMonth);

    // TURNOVER BEFORE
    if (start > 1 && !used.has(start - 1)) {
      days.push({
        date: formatDate(year, month, start - 1),
        status: "H",
      });
      used.add(start - 1);
    }

    // RESERVED BLOCK
    for (let d = start; d <= end; d++) {
      days.push({
        date: formatDate(year, month, d),
        status: "R",
      });
      used.add(d);
    }

    // TURNOVER AFTER
    if (end < daysInMonth && !used.has(end + 1)) {
      days.push({
        date: formatDate(year, month, end + 1),
        status: "H",
      });
      used.add(end + 1);
    }

    // Move pointer and leave natural gap for AVAILABLE
    current = end + Math.floor(Math.random() * 4) + 2;
  }

  // FILL AVAILABLE DAYS (NO COLOR)
  for (let i = 1; i <= daysInMonth; i++) {
    if (!used.has(i)) {
      days.push({
        date: formatDate(year, month, i),
        status: "A",
      });
    }
  }

  // SORT OUTPUT
  days.sort((a, b) => new Date(a.date) - new Date(b.date));

  return days;
};


// Generate multiple months
const generateCalendarRange = (startY, startM, endY, endM) => {
  let calendar = {};
  let y = startY;
  let m = startM;

  while (y < endY || (y === endY && m <= endM)) {
    calendar[`${y}-${m}`] = generateCalendar(y, m);

    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  return calendar;
};

const properties = [
  { id: 7230, name: "Beach Sanctuary" },
  { id: 7303, name: "Crystal Sands 1BR 1.5BA Sleeps 6 104A" },
  { id: 7418, name: "Sea Dunes 404" },
  { id: 7445, name: "Grand Caribbean West 213" },
  { id: 7463, name: "Jade East 210" },
  { id: 7468, name: "Shoreline Towers 2051" },
  { id: 7526, name: "SummerSpell 106" },
  { id: 7563, name: "Summer Breeze" },
];

// Attach calendar to properties
const allProperties = properties.map((p) => ({
  ...p,
  calendar: generateCalendarRange(2025, 12, 2026, 3),
}));

// ================ MONTH API ================
router.get("/month", (req, res) => {
  const { year = 2025, month = 12 } = req.query;

  const key = `${year}-${month}`;

  const data = allProperties.map((prop) => ({
    id: prop.id,
    name: prop.name,
    days: prop.calendar[key] || [],
  }));

  res.json({ month, year, data });
});

// ================ SEARCH API ================
router.get("/search", (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: "Missing date values" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const available = allProperties.filter((prop) => {
    const allDays = Object.values(prop.calendar).flat();

    const daysInRange = allDays.filter((d) => {
      const c = new Date(d.date);
      return c >= checkInDate && c <= checkOutDate;
    });

    return !daysInRange.some((d) => d.status === "R");
  });

  res.json({
    checkIn,
    checkOut,
    availableCount: available.length,
    availableProperties: available,
  });
});

export default router;
