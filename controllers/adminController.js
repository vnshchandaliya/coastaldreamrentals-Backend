import dotenv from "dotenv";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
// import Property from "../models/Property.js";
import Listing from "../models/Listing.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
 if (!admin || admin.role !== "admin") {
  return res.status(403).json({ message: "Not an admin" });
}

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
};
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
export const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListing = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    // 🔥 REVIEW STATS
    let totalReviews = 0;
    let pendingReviews = 0;

    const listings = await Listing.find({}, { reviews: 1 });

    listings.forEach((listing) => {
      listing.reviews?.forEach((review) => {
        totalReviews++;

        if (!review.published) {
          pendingReviews++;
        }
      });
    });

    res.json({
      totalUsers,
      totalListing,
      totalBookings,
      pendingBookings,
      totalReviews,
      pendingReviews,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = new User({
    name,
    email,
    password: hashed,
    role: "admin",
  });

  await admin.save();

  res.json({ message: "Admin created successfully" });
};

