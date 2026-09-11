const express = require("express");

const router = express.Router();

const isloggedin = require("../Middlewares/Isloggedin");
const isAdmin = require("../Middlewares/isAdmin");

const {
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
} = require("../Controllers/AdminController");


router.get(
    "/dashboard",
    isloggedin,
    isAdmin,
    getDashboardStats
);


router.get(
    "/users",
    isloggedin,
    isAdmin,
    getAllUsers
);

router.get(
    "/users/:id",
    isloggedin,
    isAdmin,
    getUserById
);

router.put(
    "/users/:id/toggle",
    isloggedin,
    isAdmin,
    toggleUserStatus
);

router.delete(
    "/users/:id",
    isloggedin,
    isAdmin,
    deleteUser
);


// Clothing Management

router.get(
    "/clothing",
    isloggedin,
    isAdmin,
    getAllClothing
);

router.get(
    "/clothing/:id",
    isloggedin,
    isAdmin,
    getClothingById
);

router.put(
    "/clothing/:id/toggle",
    isloggedin,
    isAdmin,
    toggleClothingStatus
);

router.delete(
    "/clothing/:id",
    isloggedin,
    isAdmin,
    deleteClothing
);


// Swap Management

router.get(
    "/swaps",
    isloggedin,
    isAdmin,
    getAllSwaps
);

router.get(
    "/swaps/:id",
    isloggedin,
    isAdmin,
    getSwapById
);

router.get(
    "/swaps/status/:status",
    isloggedin,
    isAdmin,
    getSwapsByStatus
);

router.put(
    "/swaps/:id/status",
    isloggedin,
    isAdmin,
    updateSwapStatus
);
module.exports = router;