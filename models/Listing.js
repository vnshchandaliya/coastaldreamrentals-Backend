import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    // ✅ PROPERTY TAB
    property: {
      type: new mongoose.Schema(
        {
          title: String,
          category: String,
          type: String,
          bedrooms: Number,
          bathrooms: Number,
          maxSleeps: Number,
          altEmail: String,
          altPhone: String,
        },
        { _id: false }
      ),
      default: {},
    },

    // ✅ DESCRIPTION
    description: {
      type: String,
      default: "",
    },

    // ✅ AMENITIES (100+ checkboxes)
    amenities: {
      type: Object,
      default: {},
    },

    // ✅ ACTIVITIES
    activities: {
      type: Object,
      default: {},
    },

    // ✅ PHOTOS
    photos: {
      type: [String],
      default: [],
    },

    // ✅ VIDEO
    video: {
      youtube: String,
      virtualTour: String,
    },

    // ✅ RATES
    rates: {
      type: [
        {
          season: String,
          from: Date,
          to: Date,
          nightly: Number,
          weekly: Number,
          monthly: Number,
          minNights: Number,
        },
      ],
      default: [],
    },

    // ✅ Extra Fee

    extraFees: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },

        // $ or %
        type: {
          type: String,
          enum: ["$", "%"],
          default: "$",
        },

        // mandatory / optional
        option: {
          type: String,
          enum: ["mandatory", "optional"],
          default: "mandatory",
        },
      },
    ],

    // ✅ LOCATION
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    reviews: [
      {
        name: String,
        email: String,
        rating: Number,
        title: String,
        message: String,
        stayDate: String,

        published: {
          type: Boolean,
          default: false
        },

        reply: String,

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
  //  Calendar Model

calendar: [
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["A", "R", "H"],
      default: "A",
    },
    source: {
      type: String,
      enum: ["internal", "admin", "ical"],
      default: "internal",
    },
  },
],

  },
  
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
