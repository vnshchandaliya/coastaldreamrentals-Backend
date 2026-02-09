import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  name: String,
  email: String,
  phone: String,
  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Inquiry", inquirySchema);
