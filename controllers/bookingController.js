import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ----------------------------------------------------------
// PREVIEW BOOKING
// ----------------------------------------------------------

export const previewBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;

    // ✅ PROPERTY FETCH (variable name FIXED)
    const property = await Listing.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    // ✅ RATE MATCH (SEASON LOGIC)
    const matchedRate = property.rates.find(rate => {
      const rateStart = new Date(rate.from);
      const rateEnd = new Date(rate.to);

      return start >= rateStart && end <= rateEnd;
    });

    if (!matchedRate) {
      return res.status(400).json({
        error: "No rate available for selected dates"
      });
    }

    const nightlyPrice = matchedRate.nightly;
    const subtotal = nightlyPrice * nights;

    // ✅ STATIC FEES (abhi simple rakha)
    const cleaningFee = 150;
    const serviceFee = Math.round(subtotal * 0.05);
    const taxes = Math.round(subtotal * 0.12);
    const warranty = 79;

    const total =
      subtotal +
      cleaningFee +
      serviceFee +
      taxes +
      warranty;

    // ✅ RESPONSE
    res.json({
      nights,
      nightlyPrice,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      warranty,
      total,
    });

  } catch (error) {
    console.error("Preview Booking Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// ----------------------------------------------------------
// CREATE BOOKING (Stripe Verification)
// ----------------------------------------------------------
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      user,
      pricing,
      paymentIntentId
    } = req.body;

    // 🔒 must be paid
    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const listing = await Listing.findById(propertyId);
    if (!listing) {
      return res.status(404).json({ error: "Property not found" });
    }

    const booking = new Booking({
      property: propertyId,
      checkIn,
      checkOut,
      guests,
      nights: pricing.nights,
      user,

      pricing,

      payment: {
        provider: "stripe",
        paid: true,
        paymentIntentId,
      },

      status: "confirmed"
    });

    await booking.save();

    // 🔒 BLOCK CALENDAR AFTER PAYMENT
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      listing.calendar.push({
        date: new Date(d),
        status: "R",
        source: "internal"
      });
    }

    await listing.save();

    res.json({
      message: "Booking confirmed",
      bookingId: booking._id
    });

  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};



export const updateBookingStatus = async (req, res) => {
  const { status } = req.body; // confirmed / cancelled

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  // ❌ Agar already cancelled
  if (booking.status === "cancelled") {
    return res.status(400).json({ error: "Booking already cancelled" });
  }

  // ✅ CONFIRM
if (status === "confirmed") {
  const property = await Listing.findById(booking.property);

  const start = new Date(booking.checkIn);
  const end = new Date(booking.checkOut);

  // reserve all stay dates
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    property.calendar.push({
      date: new Date(d),
      status: "R",
      source: "booking"
    });
  }

  // 🔥 ADD TURNOVER DAY
  property.calendar.push({
    date: new Date(end),
    status: "H",
    source: "booking"
  });

  await property.save();
  booking.status = "confirmed";
}



  // ❌ CANCEL
  if (status === "cancelled") {
    booking.status = "cancelled";
  }

  await booking.save();

  res.json({
    message: `Booking ${status}`,
    booking,
  });
  
};

// ----------------------------------------------------------
// GET ALL BOOKINGS (ADMIN)
// ----------------------------------------------------------
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const intent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
};


