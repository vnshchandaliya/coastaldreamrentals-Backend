import dotenv from "dotenv";
import Listing from "../models/Listing.js";
dotenv.config();

export const publishListing = async (req, res) => {
  try {
    const listing = await Listing.findById(id);

    listing.property = req.body;

    if (
      listing.property?.title &&
      listing.description &&
      listing.photos.length > 0 &&
      listing.location?.lat
    ) {
      listing.status = "published";
    }

    await listing.save();

    res.json(listing);

    res.json({
      message: "Listing published successfully",
      listing
    });
  } catch (err) {
    res.status(500).json({ error: "Publish failed" });
  }
};

//  ADMIN – Create Listing

export const createListing = async (req, res) => {
  const listing = new Listing({
    property: req.body,
    status: "draft"
  });

  await listing.save();

  res.json(listing);
};




// UPDATE PROPERTY TAB
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("LISTING ID:", id);
    console.log("PROPERTY DATA:", req.body);

    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        $set: {
          property: req.body
        }
      },
      { new: true }
    );

    res.json(listing);

  } catch (err) {
    console.error("PROPERTY UPDATE ERROR FULL:", err);
    res.status(500).json({ error: "Property update failed" });
  }
};

// USER – Get all listings

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//  USER – Get listing by ID

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ error: "Listing not found" });

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

// ADMIN – Delete listing

export const deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};


export const updateDescription = async (req, res) => {
 const listing = await Listing.findById(req.params.id);

  listing.description = req.body.description;

  if (
    listing.property?.title &&
    listing.description &&
    listing.photos.length > 0 &&
    listing.location?.lat
  ) {
    listing.status = "published";
  }

  await listing.save();

  res.json({ success: true });
};
export const updateAmenities = async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, {
    amenities: req.body
  });

  res.json({ success: true });
};

export const updateRates = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  listing.rates.push(req.body.rate);
  await listing.save();
  res.json(listing);
};
export const deleteRate = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  listing.rates.splice(req.body.index, 1);
  await listing.save();
  res.json(listing);
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // =============================
    // CASE 1: LAT / LNG PROVIDED
    // =============================
    if (lat && lng) {
      listing.location = {
        lat: Number(lat),
        lng: Number(lng),
        address: address || ""
      };

      await listing.save();

      return res.json({
        success: true,
        location: listing.location
      });
    }

    // =============================
    // CASE 2: ADDRESS PROVIDED
    // =============================
    if (address) {
      const geoRes = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: process.env.GOOGLE_MAPS_KEY
          }
        }
      );

      const result = geoRes.data.results[0];

      if (!result) {
        return res.status(400).json({
          message: "Invalid address"
        });
      }

      const location = result.geometry.location;

      listing.location = {
        lat: location.lat,
        lng: location.lng,
        address: result.formatted_address
      };

      await listing.save();

      return res.json({
        success: true,
        location: listing.location
      });
    }

    res.status(400).json({
      message: "Provide lat/lng or address"
    });

  } catch (error) {
    console.error("LOCATION ERROR:", error.message);

    res.status(500).json({
      message: "Location update failed"
    });
  }
};

export const updateActivities = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { activities: req.body },
      { new: true }
    );

    if (!listing)
      return res.status(404).json({ error: "Listing not found" });

    res.json({ message: "Activities saved", listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to update activities" });
  }
};
export const updatePhotos = async (req, res) => {
  try {
    const { id } = req.params;

    const newPhotos = req.files?.map(file => file.path) || [];

    if (!newPhotos.length) {
      return res.status(400).json({ error: "No photos uploaded" });
    }

    const listing = await Listing.findById(id);

    if (!listing)
      return res.status(404).json({ error: "Listing not found" });

    // ✅ total photos limit
    if (listing.photos.length + newPhotos.length > 30) {
      return res
        .status(400)
        .json({ error: "Maximum 30 photos allowed" });
    }

    // ✅ append photos
    listing.photos.push(...newPhotos);

    await listing.save();

    res.json({
      message: "Photos uploaded successfully",
      photos: listing.photos,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Photo upload failed" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { video: req.body },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
      message: "Video updated successfully",
      listing
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update video" });
  }
};

//! Add Review
export const addReview = async (req, res) => {
  const { id } = req.params;

  const review = {
    ...req.body,
    published: false
  };

  const listing = await Listing.findByIdAndUpdate(
    id,
    { $push: { reviews: review } },
    { new: true }
  );

  res.json({
    message: "Review submitted",
    review
  });
};

//! Publish Review 
export const publishReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const review = listing.reviews.id(req.params.reviewId);

  review.published = true;

  await listing.save();

  res.json({ success: true });
};

//! Admin Reply Review 
export const replyReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const review = listing.reviews.id(req.params.reviewId);

  review.reply = req.body.reply;

  await listing.save();

  res.json({ success: true });
};

//! if Admin not show Reviews 
export const deleteReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  listing.reviews = listing.reviews.filter(
    r => r._id.toString() !== req.params.reviewId
  );

  await listing.save();

  res.json({ success: true });
};

// ================= ADD EXTRA FEE =================
export const addExtraFee = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  listing.extraFees.push(req.body);
  await listing.save();

  res.json(listing.extraFees);
};

// ================= EDIT EXTRA FEE =================
export const editExtraFee = async (req, res) => {
  const { index, fee } = req.body;

  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  listing.extraFees[index] = fee;
  await listing.save();

  res.json(listing.extraFees);
};

// ================= DELETE EXTRA FEE =================
export const deleteExtraFee = async (req, res) => {
  const { index } = req.body;

  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  listing.extraFees.splice(index, 1);
  await listing.save();

  res.json(listing.extraFees);
};

// LISTING PUBLISH AND UNPUBLISH 
export const toggleListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status =
      listing.status === "published" ? "draft" : "published";

    await listing.save();

    res.json({
      message: "Status updated",
      status: listing.status,
      listingId: listing._id,
    });
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublishedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "published" });

    console.log("PUBLISHED LISTINGS:", listings.length);

    res.status(200).json(listings);
  } catch (error) {
    console.error("ERROR in getPublishedListings:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch listing",
    });
  }
};
