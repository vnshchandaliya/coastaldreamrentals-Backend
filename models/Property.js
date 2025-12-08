import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ["A","R"], default: "A" }
});

const bookingSchema = new mongoose.Schema({
  checkIn: Date,
  checkOut: Date,
  createdAt: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  guests: Number,
  floors: Number,
  bedroom: Number,
  bathroom: Number,
  sleep: String,
  image: String,
  latitude: Number,
  longitude: Number,
  externalId: Number,


  basePricePerNight: { type: Number, default: 0 },   // default 0
  cleaningFee: { type: Number, default: 0 },         // default 0
  serviceFeePercent: { type: Number, default: 5 },   // default 5%
  taxesPercent: { type: Number, default: 7 },        // default 7%

  link: { type: String, required: true },

  calendar: [calendarSchema],
  bookings: [bookingSchema] // added bookings array
});

export default mongoose.model("Property", propertySchema);
