import mongoose from "mongoose";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);


// ----------------------------------------------------------
// PREVIEW BOOKING
// ----------------------------------------------------------
export const previewBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, coupon } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ error: "Property not found" });

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const subtotal = property.basePricePerNight * nights;
    const cleaningFee = property.cleaningFee;
    const serviceFee = Math.round(subtotal * (property.serviceFeePercent / 100));
    const taxes = Math.round(subtotal * (property.taxesPercent / 100));

    let discount = 0;

    // FIXED
    if (coupon === "SUMMER10") {
      discount = Math.round(subtotal * 0.1);
    } else if (coupon === "WINTER5") {
      discount = Math.round(subtotal * 0.05);
    }

    const total = subtotal + cleaningFee + serviceFee + taxes - discount;

    res.json({
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      discount,
      total
    });

  } catch (error) {
    console.error("Preview Error:", error);
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
      couponCode,
      paymentIntentId
    } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment not verified" });
    }

    // ------------ VERIFY PAYMENT ------------
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    // ------------ SAVE BOOKING ------------
    const booking = new Booking({
      property: propertyId,
      checkIn,
      checkOut,
      guests,
      nights: pricing.nights,
      user,

      pricing: {
        subtotal: pricing.subtotal,
        cleaningFee: pricing.cleaningFee,
        serviceFee: pricing.serviceFee,
        taxes: pricing.taxes,
        discount: pricing.discount ?? 0,
        total: pricing.total
      },

      payment: {
        provider: "stripe",
        paid: true,
        paymentIntentId
      },

      status: "confirmed",
    });

    await booking.save();

    res.json({
      message: "Booking confirmed!",
      bookingId: booking._id
    });

  } catch (error) {
    console.log("Booking error:", error);
    res.status(500).json({ error: "Booking creation failed" });
  }
};
