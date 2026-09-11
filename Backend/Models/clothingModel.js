const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
    },

    brand: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids"],
      required: true,
    },

    condition: {
      type: String,
      enum: ["Like New", "Excellent", "Good", "Fair"],
      required: true,
    },

    color: {
      type: String,
    },

    estimatedValue: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    location: {
      city: String,
      state: String,
      latitude: Number,
      longitude: Number,
    },
    locationName: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Available", "Pending Swap", "Swapped", "Inactive"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clothing", clothingSchema);