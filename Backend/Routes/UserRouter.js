const express = require("express");
const router = express.Router();

const UserModel = require("../Models/UserModel");
const isloggedin = require("../Middlewares/Isloggedin");

const {
    userregister,
    userlogin,
    updateProfile
} = require("../Controllers/AuthController");

const upload = require("../Config/MulterConfig");


//  USER HOME 
router.get("/", (req, res) => {
    res.send("user");
});


//  AUTH 

// Register
router.post("/register", userregister);

// Login
router.post("/login", userlogin);

// Logout
router.post("/logout", (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});


// ================= USER DATA =================

// Get all users
router.get("/allusers", isloggedin, async (req, res) => {

    try {

        const allusers = await UserModel
            .find()
            .select("-password");

        return res.status(200).send(allusers);

    } catch (error) {

        console.log("Get all users error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to get users"
        });
    }
});


// Get logged-in user's profile
router.get("/profile", isloggedin, (req, res) => {

    return res.status(200).send(req.user);

});


// Check authentication
router.get("/checkauth", isloggedin, (req, res) => {

    return res.status(200).send({
        ok: true
    });

});


// ================= EDIT PROFILE =================


// Update phone + location
router.put(
    "/updateprofile",
    isloggedin,
    updateProfile
);


// Update profile image
router.put(
    "/editprofileimage",
    isloggedin,
    upload.single("profileimage"),
    async (req, res) => {

        try {

            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please select a profile image"
                });
            }

            const profileimage =
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            const userdata = await UserModel.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        profileimage: profileimage
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

            if (!userdata) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json(userdata);

        } catch (error) {

            console.log("Profile image update error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to update profile image"
            });
        }

    }
);


// Update name
router.put(
    "/editname",
    isloggedin,
    async (req, res) => {

        try {

            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const { name } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required"
                });
            }

            const userdata = await UserModel.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        name: name.trim()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

            if (!userdata) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json(userdata);

        } catch (error) {

            console.log("Edit name error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to update name"
            });
        }

    }
);


module.exports = router;