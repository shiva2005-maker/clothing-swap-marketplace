const clothingModel = require("../Models/clothingModel");
const { geocodeLocation } = require("../Utils/geocode");

module.exports.createClothing = async (req, res) => {
  try {

    // Logged-in user
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      category,
      subCategory,
      brand,
      size,
      gender,
      condition,
      color,
      estimatedValue,
      location,
    } = req.body;


    // =========================
    // REQUIRED VALIDATION
    // =========================

    if (
      !title ||
      !description ||
      !category ||
      !brand ||
      !size ||
      !gender ||
      !condition ||
      !estimatedValue ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required clothing details",
      });
    }


    // =========================
    // GEOCODE LOCATION
    // =========================

    const locationValue = String(location).trim();

    console.log(
      "Clothing location received:",
      locationValue
    );

    const geo = await geocodeLocation(locationValue);

    console.log(
      "Clothing geocode result:",
      geo
    );


    if (!geo) {
      return res.status(400).json({
        success: false,
        message: "Unable to find the provided location",
      });
    }


    // =========================
    // HANDLE IMAGES
    // =========================

    let imageUrls = [];

    if (req.files && req.files.length > 0) {

      imageUrls = req.files.map((file) => {

        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      });

    }


    // =========================
    // CREATE CLOTHING
    // =========================

    const clothing = await clothingModel.create({

      owner: user._id,

      title,
      description,
      category,
      subCategory,
      brand,
      size,
      gender,
      condition,
      color,
      estimatedValue,

      images: imageUrls,

      // Actual location text
      locationName: locationValue,

      // Coordinates for nearby matching
      location: {
        type: "Point",
        coordinates: [
          geo.lng,
          geo.lat
        ]
      }

    });


    return res.status(201).json({

      success: true,

      message: "Clothing listed successfully",

      clothing,

    });


  } catch (error) {

    console.error(
      "createClothing error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error while creating clothing item",

      error: error.message,

    });

  }
};


module.exports.updateClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "description",
      "category",
      "subCategory",
      "brand",
      "size",
      "gender",
      "condition",
      "color",
      "estimatedValue",
      "images",
      "location",
      "status",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    const updatedProduct = await clothingModel.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(403).json({
        success: false,
        message: "Only the product owner can update this product",
      });
    }

    return res.status(200).send(updatedProduct);
  } catch (err) {
    return res.status(500).send("unable to update the product");
  }
};


module.exports.deleteClothing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.send("oops! something went wrong");
    }

    const deletedProduct = await clothingModel.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!deletedProduct) {
      return res.status(403).json({
        success: false,
        message: "Only the product owner can delete this product",
      });
    }

    return res.status(200).send(deletedProduct);
  } catch (err) {
    return res.status(500).send("unable to delete the product");
  }
};


module.exports.getClothingById = async (req, res) => {
  try {
    let { id } = req.params

    if (!id) {
      res.send("oops! something went wrong");
    }

    let product = await clothingModel.findById(id);

    return res.status(200).send(product);


  } catch (err) {
    return res.status(500).send("unable to get the product")
  }

}


module.exports.getAllClothing = async (req, res) => {
  try {
    let allclothing = await clothingModel.find();
    return res.send(allclothing);
  } catch (err) {
    return res.status(500).send("unable to get the products")
  }
}

module.exports.getMyListings = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object after authentication
    const listings = await clothingModel.find({ owner: userId });
    res.json({ clothing: listings });
  } catch (error) {
    console.error("Error fetching my listings:", error);
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
}