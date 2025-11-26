import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);
const router = express.Router();

// CREATE PAYMENT INTENT
router.post("/create", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
