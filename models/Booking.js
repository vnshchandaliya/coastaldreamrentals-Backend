import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

   user: {
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  country: String,
  city: String,
  state: String,
  zip: String,
},


    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
    },

    pricing: {
      subtotal: { type: Number, default: 0 },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    payment: {
      provider: { type: String, default: "none" },
      paid: { type: Boolean, default: false },
      paymentIntentId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
