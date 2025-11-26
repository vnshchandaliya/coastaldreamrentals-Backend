import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // e.g. 0.1 = 10%
  expiry: { type: Date, required: true },
  usageLimit: { type: Number, default: null } // optional
});

export default mongoose.model("Coupon", couponSchema);
