const SwapRequestModel = require("../Models/swapRequestModel");
const ClothingModel = require("../Models/clothingModel");



module.exports.createSwapRequest = async (req, res) => {
  try {
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      requestedItem,
      offeredItem,
      message,
    } = req.body;

    // Validate fields
    if (!requestedItem || !offeredItem) {
      return res.status(400).json({
        success: false,
        message: "Requested item and offered item are required",
      });
    }

    // Get requested clothing
    const requestedClothing =
      await ClothingModel.findById(requestedItem);

    if (!requestedClothing) {
      return res.status(404).json({
        success: false,
        message: "Requested clothing not found",
      });
    }

    // Get offered clothing
    const offeredClothing =
      await ClothingModel.findById(offeredItem);

    if (!offeredClothing) {
      return res.status(404).json({
        success: false,
        message: "Offered clothing not found",
      });
    }

    // User cannot request their own item
    if (
      requestedClothing.owner.toString() ===
      requester._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own clothing",
      });
    }

    // User can only offer their own item
    if (
      offeredClothing.owner.toString() !==
      requester._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only offer your own clothing",
      });
    }

    // Requested item must be available
    if (requestedClothing.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This clothing is no longer available",
      });
    }

    // Offered item must be available
    if (offeredClothing.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Your offered clothing is not available",
      });
    }

    // Check duplicate pending request
    const existingRequest =
      await SwapRequestModel.findOne({
        requester: requester._id,
        requestedItem,
        offeredItem,
        status: "Pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already sent this swap request",
      });
    }

    // Create request
    const swapRequest =
      await SwapRequestModel.create({
        requester: requester._id,
        receiver: requestedClothing.owner,
        requestedItem,
        offeredItem,
        message,
      });

    return res.status(201).json({
      success: true,
      message: "Swap request sent successfully",
      swapRequest,
    });
  } catch (error) {
    console.error("createSwapRequest error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating swap request",
      error: error.message,
    });
  }
};



module.exports.getSentRequests = async (req, res) => {
  try {
    const user = req.user;

    const requests = await SwapRequestModel.find({
      requester: user._id,
    })
      .populate("requestedItem")
      .populate("offeredItem")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("getSentRequests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
    });
  }
};


module.exports.getReceivedRequests = async (req, res) => {
  try {
    const user = req.user;

    const requests = await SwapRequestModel.find({
      receiver: user._id,
    })
      .populate("requestedItem")
      .populate("offeredItem")
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("getReceivedRequests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch received requests",
    });
  }
};



module.exports.updateSwapRequestStatus = async (
  req,
  res
) => {
  try {
    const user = req.user;

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Accepted",
      "Rejected",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request =
      await SwapRequestModel.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    // Receiver can Accept / Reject
    if (
      request.receiver.toString() ===
      user._id.toString()
    ) {
      if (status === "Cancelled") {
        return res.status(403).json({
          success: false,
          message: "Receiver cannot cancel this request",
        });
      }
    }

    // Requester can Cancel
    else if (
      request.requester.toString() ===
      user._id.toString()
    ) {
      if (
        status !== "Cancelled"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Requester can only cancel the request",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    // Only pending requests can change
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer pending",
      });
    }

    request.status = status;

    await request.save();

    // If accepted, mark both clothes as pending swap
    if (status === "Accepted") {
      await ClothingModel.findByIdAndUpdate(
        request.requestedItem,
        {
          status: "Pending Swap",
        }
      );

      await ClothingModel.findByIdAndUpdate(
        request.offeredItem,
        {
          status: "Pending Swap",
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Swap request ${status.toLowerCase()} successfully`,
      request,
    });
  } catch (error) {
    console.error(
      "updateSwapRequestStatus error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update swap request",
      error: error.message,
    });
  }
};


module.exports.completeSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const swap = await SwapRequestModel.findById(id);

        if (!swap) {
            return res.status(404).json({
                success: false,
                message: "Swap request not found"
            });
        }

        // Only requester or receiver can complete
        const userId = String(req.user._id);

        if (
            String(swap.requester) !== userId &&
            String(swap.receiver) !== userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not part of this swap"
            });
        }

        // Only accepted swaps can be completed
        if (swap.status !== "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted swaps can be completed"
            });
        }

        // Update both clothing items
        await ClothingModel.findByIdAndUpdate(
            swap.requestedItem,
            { status: "Swapped" }
        );

        await ClothingModel.findByIdAndUpdate(
            swap.offeredItem,
            { status: "Swapped" }
        );

        // Update swap
        swap.status = "Completed";

        await swap.save();

        return res.status(200).json({
            success: true,
            message: "Swap completed successfully",
            swap
        });

    } catch (error) {

        console.error(
            "Complete swap error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to complete swap"
        });
    }
};