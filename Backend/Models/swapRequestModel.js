const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    // Person who is sending the request
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Person who owns the requested clothing
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Clothing the requester wants
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clothing",
      required: true,
    },

    // Clothing offered by requester
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clothing",
      required: true,
    },

    // Optional message
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Swap request status
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const SwapRequestModel = mongoose.model(
  "SwapRequest",
  swapRequestSchema
);

module.exports = SwapRequestModel;