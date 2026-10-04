const UserModel = require("../Models/UserModel");
const ClothingModel = require("../Models/clothingModel");
const SwapRequestModel = require("../Models/swapRequestModel");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments({
            role: "customer"
        });

        const totalClothing = await ClothingModel.countDocuments();

        const availableClothing = await ClothingModel.countDocuments({
            status: "Available"
        });

        const pendingSwaps = await SwapRequestModel.countDocuments({
            status: "Pending"
        });

        const completedSwaps = await SwapRequestModel.countDocuments({
            status: "Completed"
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalClothing,
                availableClothing,
                pendingSwaps,
                completedSwaps
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard statistics"
        });
    }
};
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find(
            {},
            "-password"
        ).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch users"
        });
    }
};


// Get single user
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(
            id,
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch user"
        });
    }
};


// Activate / Deactivate user
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deactivating himself
        if (String(user._id) === String(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        user.isActive = !user.isActive;

        await user.save();

        return res.status(200).json({
            success: true,
            message: user.isActive
                ? "User activated successfully"
                : "User deactivated successfully",
            isActive: user.isActive
        });

    } catch (error) {
        console.error("Toggle user status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update user status"
        });
    }
};


// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting himself
        if (String(id) === String(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await UserModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete user"
        });
    }
};


// Get all clothing
const getAllClothing = async (req, res) => {
    try {
        const clothing = await ClothingModel.find()
            .populate("owner", "name email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: clothing.length,
            clothing
        });

    } catch (error) {
        console.error("Get all clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch clothing"
        });
    }
};


// Get single clothing
const getClothingById = async (req, res) => {
    try {
        const { id } = req.params;

        const clothing = await ClothingModel.findById(id)
            .populate("owner", "name email phone");

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing not found"
            });
        }

        return res.status(200).json({
            success: true,
            clothing
        });

    } catch (error) {
        console.error("Get clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch clothing"
        });
    }
};


// Activate / Deactivate clothing
const toggleClothingStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const clothing = await ClothingModel.findById(id);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing not found"
            });
        }

        // Toggle only between Available and Inactive
        if (clothing.status === "Inactive") {
            clothing.status = "Available";
        } else {
            clothing.status = "Inactive";
        }

        await clothing.save();

        return res.status(200).json({
            success: true,
            message: `Clothing ${
                clothing.status === "Available"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            status: clothing.status
        });

    } catch (error) {
        console.error("Toggle clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update clothing status"
        });
    }
};


// Delete clothing
const deleteClothing = async (req, res) => {
    try {
        const { id } = req.params;

        const clothing = await ClothingModel.findById(id);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing not found"
            });
        }

        await ClothingModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Clothing deleted successfully"
        });

    } catch (error) {
        console.error("Delete clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete clothing"
        });
    }
};
// Get all swap requests
const getAllSwaps = async (req, res) => {
    try {
        const swaps = await SwapRequestModel.find()
            .populate("requester", "name email phone")
            .populate("receiver", "name email phone")
            .populate("requestedItem", "title images category condition")
            .populate("offeredItem", "title images category condition")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: swaps.length,
            swaps
        });

    } catch (error) {
        console.error("Get all swaps error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch swap requests"
        });
    }
};


// Get single swap request
const getSwapById = async (req, res) => {
    try {
        const { id } = req.params;

        const swap = await SwapRequestModel.findById(id)
            .populate("requester", "name email phone")
            .populate("receiver", "name email phone")
            .populate("requestedItem")
            .populate("offeredItem");

        if (!swap) {
            return res.status(404).json({
                success: false,
                message: "Swap request not found"
            });
        }

        return res.status(200).json({
            success: true,
            swap
        });

    } catch (error) {
        console.error("Get swap error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch swap request"
        });
    }
};


// Get swaps by status
const getSwapsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const allowedStatuses = [
            "Pending",
            "Accepted",
            "Rejected",
            "Cancelled",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid swap status"
            });
        }

        const swaps = await SwapRequestModel.find({ status })
            .populate("requester", "name email")
            .populate("receiver", "name email")
            .populate("requestedItem", "title images")
            .populate("offeredItem", "title images")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: swaps.length,
            status,
            swaps
        });

    } catch (error) {
        console.error("Get swaps by status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch swaps"
        });
    }
};


// Update swap status by admin
const updateSwapStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Accepted",
            "Rejected",
            "Cancelled",
            "Completed"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid swap status"
            });
        }

        const swap = await SwapRequestModel.findById(id);

        if (!swap) {
            return res.status(404).json({
                success: false,
                message: "Swap request not found"
            });
        }

        // Already completed
        if (swap.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed swap cannot be changed"
            });
        }

        // If completing the swap
        if (status === "Completed") {

            await ClothingModel.findByIdAndUpdate(
                swap.requestedItem,
                {
                    status: "Swapped"
                }
            );

            await ClothingModel.findByIdAndUpdate(
                swap.offeredItem,
                {
                    status: "Swapped"
                }
            );
        }

        // If accepted
        if (status === "Accepted") {

            await ClothingModel.findByIdAndUpdate(
                swap.requestedItem,
                {
                    status: "Pending Swap"
                }
            );

            await ClothingModel.findByIdAndUpdate(
                swap.offeredItem,
                {
                    status: "Pending Swap"
                }
            );
        }

        // Rejected / Cancelled → make items available again
        if (
            status === "Rejected" ||
            status === "Cancelled"
        ) {

            await ClothingModel.findByIdAndUpdate(
                swap.requestedItem,
                {
                    status: "Available"
                }
            );

            await ClothingModel.findByIdAndUpdate(
                swap.offeredItem,
                {
                    status: "Available"
                }
            );
        }

        swap.status = status;

        await swap.save();

        return res.status(200).json({
            success: true,
            message: "Swap status updated successfully",
            status: swap.status
        });

    } catch (error) {
        console.error("Update swap status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update swap status"
        });
    }
};


module.exports = {
    getDashboardStats,

    getAllUsers,
    getUserById,
    toggleUserStatus,
    deleteUser,

    getAllClothing,
    getClothingById,
    toggleClothingStatus,
    deleteClothing,

    getAllSwaps,
    getSwapById,
    getSwapsByStatus,
    updateSwapStatus
};