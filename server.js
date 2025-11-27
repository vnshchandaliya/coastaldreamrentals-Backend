import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

import Property from "./models/Property.js";

// Custom Routes
import calendarRoutes from "./routes/calendarRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const PORT =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root Test
app.get("/", (req, res) => {
  res.send("🏡 RentalPro API Working");
});

// -------------------------------------------------------
//  PROPERTY LIST
// -------------------------------------------------------
app.get("/api/properties", async (req, res) => {
  try {
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
app.use("/api/calendar", calendarRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// -------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Database Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

console.log("bookingRoutes loaded");
