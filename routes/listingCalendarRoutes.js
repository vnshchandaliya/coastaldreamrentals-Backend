import express from "express";
import {
  addCalendarDate,
  removeCalendarDate,
  getCalendar,
  blockDates,
  unblockDates,
} from "../controllers/calendarController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/:id/calendar",
  isAuth,
  isAdmin,
  addCalendarDate
);

router.delete(
  "/:id/calendar",
  isAuth,
  isAdmin,
  removeCalendarDate
);
router.get("/month", (req, res) => {
  const { year, month } = req.query;

  res.json({
    year,
    month,
    data: [],
  });
});

// Get calendar of a listing
router.get("/:id/calendar", getCalendar);

// Admin block dates
router.post("/:id/calendar/block", isAuth, isAdmin, blockDates);

// Admin unblock dates
router.post("/:id/calendar/unblock", isAuth, isAdmin, unblockDates);

export default router;
