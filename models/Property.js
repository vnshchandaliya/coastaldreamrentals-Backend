import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  date: { type: Date, required: true },
});

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  checkIn: Date,
  checkOut: Date,
  createdAt: { type: Date, default: Date.now },
});

const propertylabSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    guests: Number,
    floors: Number,
    bedroom: Number,
    bathroom: Number,
    sleep: String,

    images: [String],

    latitude: Number,
    longitude: Number,
    externalId: Number,

    basePricePerNight: { type: Number, default: 0 },
    cleaningFee: { type: Number, default: 0 },
    serviceFeePercent: { type: Number, default: 5 },
    taxesPercent: { type: Number, default: 7 },

    link: { type: String, required: true },

    calendar: [calendarSchema],   // only reserved dates
    bookings: [bookingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertylabSchema);
