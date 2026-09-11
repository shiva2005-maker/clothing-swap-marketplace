const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Person sending message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Person receiving message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Related swap request
    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
    },

    // Message content
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Read/unread
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model(
  "Message",
  messageSchema
);

module.exports = MessageModel;