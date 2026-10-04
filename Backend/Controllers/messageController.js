const MessageModel = require("../Models/messageModel");
const SwapRequestModel = require("../Models/swapRequestModel");



module.exports.sendMessage = async (req, res) => {
  try {
    const user = req.user;

    const {
      receiver,
      swapRequest,
      message,
    } = req.body;

    if (!receiver || !swapRequest || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const request =
      await SwapRequestModel.findById(
        swapRequest
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    // User must belong to this swap
    const isParticipant =
      request.requester.toString() ===
        user._id.toString() ||
      request.receiver.toString() ===
        user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this swap",
      });
    }

    // Only accepted requests can chat
    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Chat is available only after swap request is accepted",
      });
    }

    const newMessage =
      await MessageModel.create({
        sender: user._id,
        receiver,
        swapRequest,
        message: message.trim(),
      });

    await newMessage.populate(
      "sender",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });
  } catch (error) {
    console.error(
      "sendMessage error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};



module.exports.getMessages = async (req, res) => {
  try {
    const user = req.user;

    const { swapRequestId } = req.params;

    const request =
      await SwapRequestModel.findById(swapRequestId)
        .populate("requester", "name email")
        .populate("receiver", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    // Check participant
    const requesterId =
      request.requester?._id ||
      request.requester;
    const receiverId =
      request.receiver?._id ||
      request.receiver;

    const isParticipant =
      requesterId.toString() === user._id.toString() ||
      receiverId.toString() === user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this swap",
      });
    }

    const messages =
      await MessageModel.find({
        swapRequest: swapRequestId,
      })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

    const otherUser =
      requesterId.toString() === user._id.toString()
        ? request.receiver
        : request.requester;

    return res.status(200).json({
      success: true,
      messages,
      otherUser,
    });
  } catch (error) {
    console.error(
      "getMessages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};