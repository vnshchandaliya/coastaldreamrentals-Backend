import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  deleteListing,
  updateProperty,
  updateDescription,
  updateAmenities,
  updateActivities,
  updatePhotos,
  updateVideo,
  updateRates,
  updateLocation ,
  publishListing,
  deleteRate,
   addReview,
  publishReview,
  replyReview,
  deleteReview,
   addExtraFee,
  editExtraFee,
  deleteExtraFee,
  toggleListingStatus,
  getPublishedListings
  

} from "../controllers/listingController.js";
import multer from "multer";
// import path from "path";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: "uploads/listings",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });
router.get("/published", getPublishedListings);
// TEMP (no auth)
router.post("/", createListing);

router.get("/", isAuth, isAdmin, getAllListings);
router.get("/:id", getListingById);
router.delete("/:id", deleteListing);

// tab-wise save
router.put("/:id/property", updateProperty);
router.put("/:id/description", updateDescription);
router.put("/:id/amenities", updateAmenities);
router.put("/:id/activities", updateActivities);
router.put(
  "/:id/photos",
  upload.array("photos", 30),
  updatePhotos
);
router.put("/:id/video", updateVideo);
router.put("/:id/rates", updateRates);
router.put("/:id/rates/delete", deleteRate);
router.put("/:id/location", updateLocation);


router.put("/:id/publish", publishListing);

//! Reviews Route 
router.post("/:id/reviews", addReview);

router.put("/:id/reviews/:reviewId/publish", publishReview);
router.put("/:id/reviews/:reviewId/reply", replyReview);
router.delete("/:id/reviews/:reviewId", deleteReview);

//! EXTRA FEES
router.put("/:id/extra-fees", addExtraFee);
router.put("/:id/extra-fees/edit", editExtraFee);
router.put("/:id/extra-fees/delete", deleteExtraFee);

router.put(
  "/:id/toggle-status",
  isAuth,
  isAdmin,
  toggleListingStatus
);




export default router;
  