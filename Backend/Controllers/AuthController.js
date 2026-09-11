const UserModel = require("../Models/UserModel");
const {generatetoken} = require("../Utils/GenerateToken"); 
const { hashpassword,comparepassword } = require("../Helper/AuthHelper"); 
const { geocodeLocation } = require("../Utils/geocode");


module.exports.userregister = async (req, res) => {
  try {
    const { name, email, phone, password, role, locationText } = req.body;

    // Basic validation to surface missing fields immediately
    if (!name || !email || !phone || !password) {
      return res.status(400).send({ message: 'Missing required fields: name, email, phone, password' });
    }

    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
      return res.status(400).send({ message: 'User already exists! Please try to login.' });
    }

    const hashedpassword = await hashpassword(password);

    let location = undefined;
    if (locationText) {
      const geo = await geocodeLocation(locationText);
      if (geo) {
        location = {
          type: 'Point',
          coordinates: [geo.lng, geo.lat]
        };
      }
    }

    const user = await UserModel.create({
      name,
      email,
      phone,
      password: hashedpassword,
      role: 'customer',
      location
    });

    const token = await generatetoken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.send({ user, token });
  } catch (err) {
    // Log full error to server console for debugging and return a safe message to client
    console.error('userregister error:', err);
    return res.status(500).send({ message: 'Server error during registration', error: err.message });
  }
};

module.exports.userlogin = async (req,res)=>{
    let {email,password} = req.body;

    let user = await UserModel.findOne({email});

    if(!user){
        return res.status(400).send({message:"User not found, please register."});
    }

    let checkpassword = await comparepassword(password,user.password);
    
    if(!checkpassword){
        return res.status(400).send({message:"Invalid Credentials"});
    }

    let token = await generatetoken(user);
    // Persist cookie for 7 days so session survives browser restarts
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.send({user,token,role:user.role});
    
};

module.exports.updateProfile = async (req, res) => {
    try {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { phone, locationText } = req.body;

        const updateData = {};

        // ================= PHONE =================

        if (phone !== undefined && phone !== "") {

            const phoneValue = String(phone).trim();

            if (!/^\d{10}$/.test(phoneValue)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid 10-digit phone number"
                });
            }

            updateData.phone = Number(phoneValue);
        }


        // ================= LOCATION =================

        if (
            locationText !== undefined &&
            String(locationText).trim() !== ""
        ) {

            const locationValue = String(locationText).trim();

            console.log("Location received:", locationValue);

            const geo = await geocodeLocation(locationValue);

            console.log("Geocode result:", geo);

            if (!geo) {

                return res.status(400).json({
                    success: false,
                    message: "Unable to find this location"
                });
            }

            updateData.location = {
                type: "Point",
                coordinates: [
                    geo.lng,
                    geo.lat
                ]
            };
            updateData.locationName = locationValue;
        }


        // ================= UPDATE USER =================

        const updatedUser =
            await UserModel.findByIdAndUpdate(
                user._id,
                {
                    $set: updateData
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");


        if (!updatedUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });


    } catch (error) {

        console.log("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to update profile"
        });
    }
};