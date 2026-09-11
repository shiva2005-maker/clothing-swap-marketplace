const express = require("express");

const router = express.Router();

const {
  createSwapRequest,
  getSentRequests,
  getReceivedRequests,
  updateSwapRequestStatus,
  completeSwapRequest
} = require("../Controllers/swapRequestController");


const  isloggedin  = require('../Middlewares/Isloggedin');


// Send swap request
router.post(
  "/create",
  isloggedin,
  createSwapRequest
);


// Requests I sent
router.get(
  "/sent",
  isloggedin,
  getSentRequests
);


// Requests I received
router.get(
  "/received",
  isloggedin,
  getReceivedRequests
);


// Accept / Reject / Cancel
router.put(
  "/status/:id",
  isloggedin,
  updateSwapRequestStatus
);

router.put(
  "/complete/:id",
  isloggedin,
  completeSwapRequest
)

module.exports = router;