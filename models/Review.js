import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  propertyId: String,
  name: String,
  date: Date,
  comment: String,
  reply: String, // owner reply
});

export default mongoose.model("Review", reviewSchema);
