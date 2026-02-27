import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import Property from "./models/Property.js";


dotenv.config();

// Mongo connection string (merged)
const MONGO = process.env.MONGO_URI

// Custom Routes
import searchRoutes from "./routes/searchRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import calendarRoutes from "./routes/listingCalendarRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5175",
   "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Root Test
app.get("/", (req, res) => {
  res.send(" API Working");
});


// -------------------------------------------------------
//  PROPERTY LIST
// -------------------------------------------------------
app.get("/api/properties", async (req, res) => {
  try {
    const count = await Property.countDocuments();
    // console.log("🔍 Property count from backend =", count);

    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Error fetching properties" });
  }
});

// -------------------------------------------------------
app.get("/api/properties/filter", async (req, res) => {
  try {
    const { guests, bathroom } = req.query;
    const filter = {};

    if (guests) filter.guests = { $gte: Number(guests) };
    if (bathroom) filter.bathroom = { $gte: Number(bathroom) };

    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Error filtering properties" });
  }
});

// -------------------------------------------------------
app.get("/api/properties/available", async (req, res) => {
  try {
    const { checkIn, checkOut, guests, bathroom } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        error: "Check-in and Check-out dates are required",
      });
    }

    let availableFromCalendar = [];

    try {
      const response = await axios.get(`http://localhost:${PORT}/api/calendar/search`, {
        params: { checkIn, checkOut },
      });

      availableFromCalendar = response.data.availableProperties || [];
    } catch (error) {
      console.warn("⚠ Calendar API unavailable — fallback only DB search");
    }

    const dbFilter = {};
    if (guests) dbFilter.guests = { $gte: Number(guests) };
    if (bathroom) dbFilter.bathroom = { $gte: Number(bathroom) };

    if (availableFromCalendar.length > 0) {
      const ids = availableFromCalendar.map((p) => p.id);

      const properties = await Property.find({
        ...dbFilter,
        externalId: { $in: ids },
      });

      return res.json(properties);
    }

    const properties = await Property.find(dbFilter);
    res.json(properties);
  } catch (err) {
    console.error("Available Properties Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }  
});

// -------------------------------------------------------
//  MOUNT ROUTES
// -------------------------------------------------------
app.use("/api", searchRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/listings", calendarRoutes);
app.use("/api/inquiries" , inquiryRoutes);
app.use("/uploads", express.static("uploads"));



// -------------------------------------------------------
// CONNECT MONGO
// -------------------------------------------------------
mongoose
  .connect(MONGO, {
    serverSelectionTimeoutMS: 8000,
    tls: true,
    ssl: true,
    tlsAllowInvalidCertificates: true, // ⚠️ dev only
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Database Error:", err.message));

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

console.log("Listing routes loaded");

// console.log("Loaded MONGO_URI =", process.env.MONGO_URI);
// console.log("bookingRoutes loaded");
