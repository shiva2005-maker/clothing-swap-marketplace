const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../Controllers/messageController");

const isloggedin = require("../Middlewares/Isloggedin");


// Send message
router.post(
  "/send",
  isloggedin,
  sendMessage
);


// Get messages
router.get(
  "/:swapRequestId",
  isloggedin,
  getMessages
);


module.exports = router;