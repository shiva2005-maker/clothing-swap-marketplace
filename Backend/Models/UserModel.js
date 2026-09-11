const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    profileimage: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    locationName: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

