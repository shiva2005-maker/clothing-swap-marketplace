import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

const Profile = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();


    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [locationText, setLocationText] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const [editingName, setEditingName] = useState(false);
    const [editingDetails, setEditingDetails] = useState(false);

    const [loading, setLoading] = useState(true);
    const [savingName, setSavingName] = useState(false);
    const [savingImage, setSavingImage] = useState(false);
    const [savingDetails, setSavingDetails] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    useEffect(() => {

        const getProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/profile`,
                    {
                        withCredentials: true,
                    }
                );

                setUser(res.data);
                setName(res.data.name || "");
                setPhone(res.data.phone || "");

            } catch (error) {

                console.error("Profile error:", error);

                if (error.response?.status === 401) {
                    navigate("/login");
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);

            }
        };

        getProfile();

    }, [navigate]);



    const handleNameUpdate = async () => {

        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        try {

            setSavingName(true);
            setError("");
            setSuccess("");

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/user/editname`,
                {
                    name: name.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            const updatedUser = res.data;

            setUser(updatedUser);
            setName(updatedUser.name);

            // Update AuthContext
            setAuth({
                ...auth,
                user: updatedUser,
            });

            // Update localStorage
            const storedAuth = JSON.parse(
                localStorage.getItem("auth")
            );

            if (storedAuth) {

                storedAuth.user = updatedUser;

                localStorage.setItem(
                    "auth",
                    JSON.stringify(storedAuth)
                );

            }

            setEditingName(false);

            setSuccess(
                "Name updated successfully."
            );

        } catch (error) {

            console.error("Name update error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update name."
            );

        } finally {

            setSavingName(false);

        }
    };



    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            setError("Please select a valid image.");
            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image size should be less than 5MB."
            );

            return;

        }

        setSelectedImage(file);

        setError("");
        setSuccess("");
    };



    const handleImageUpload = async () => {

        if (!selectedImage) {

            setError(
                "Please select an image first."
            );

            return;
        }

        try {

            setSavingImage(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append(
                "profileimage",
                selectedImage
            );

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/user/editprofileimage`,
                formData,
                {
                    withCredentials: true,
                }
            );

            const updatedUser = res.data;

            setUser(updatedUser);

            // Update AuthContext
            setAuth({
                ...auth,
                user: updatedUser,
            });

            // Update localStorage
            const storedAuth = JSON.parse(
                localStorage.getItem("auth")
            );

            if (storedAuth) {

                storedAuth.user = updatedUser;

                localStorage.setItem(
                    "auth",
                    JSON.stringify(storedAuth)
                );

            }

            setSelectedImage(null);

            setSuccess(
                "Profile image updated successfully."
            );

        } catch (error) {

            console.error(
                "Image update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update profile image."
            );

        } finally {

            setSavingImage(false);

        }
    };


    //  UPDATE PHONE + LOCATION 

    const handleDetailsUpdate = async () => {

        const phoneValue = String(phone).trim();
        const locationValue = String(locationText).trim();

        // console.log("PHONE:", phoneValue);
        // console.log("LOCATION:", locationValue);

        if (!phoneValue) {
            setError("Phone number is required.");
            return;
        }

        if (!/^\d{10}$/.test(phoneValue)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!locationValue) {
            setError("Location is required.");
            return;
        }

        try {

            setSavingDetails(true);
            setError("");
            setSuccess("");

            // console.log("Sending request...");

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/user/updateprofile`,
                {
                    phone: phoneValue,
                    locationText: locationValue,
                },
                {
                    withCredentials: true,
                }
            );

            // console.log("UPDATE RESPONSE:", res.data);

            const updatedUser = res.data.user;

            setUser(updatedUser);
            setPhone(String(updatedUser.phone || ""));

            setAuth({
                ...auth,
                user: updatedUser,
            });

            const storedAuth = JSON.parse(
                localStorage.getItem("auth")
            );

            if (storedAuth) {
                storedAuth.user = updatedUser;
                localStorage.setItem(
                    "auth",
                    JSON.stringify(storedAuth)
                );
            }

            setEditingDetails(false);

            setSuccess(
                "Profile details updated successfully."
            );

        } catch (error) {

            console.error("UPDATE ERROR:", error);
            console.error("SERVER RESPONSE:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {
            setSavingDetails(false);
        }
    };



    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>

                    <p className="text-gray-600 mt-4">
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }


    if (!user) {
        return null;
    }


    return (

        <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4">

            <div className="max-w-5xl mx-auto">



                <div className="mb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-black transition mb-4"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-bold text-black">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your account information
                    </p>

                </div>



                {error && (

                    <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>

                )}

                {success && (

                    <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>

                )}



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                        <div className="flex flex-col items-center text-center">

                            <img
                                src={
                                    user.profileimage ||
                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                }
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                            />

                            <h2 className="text-xl font-bold text-gray-900 mt-5">
                                {user.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 break-all">
                                {user.email}
                            </p>

                            <span className="mt-4 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                                {user.role}
                            </span>

                        </div>



                        <div className="mt-7 pt-6 border-t border-gray-200">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Change Profile Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />

                            {selectedImage && (

                                <button
                                    onClick={handleImageUpload}
                                    disabled={savingImage}
                                    className="w-full mt-4 bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {savingImage
                                        ? "Uploading..."
                                        : "Upload Image"}
                                </button>

                            )}

                        </div>

                    </div>



                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">


                        <div className="mb-7">

                            <h2 className="text-xl font-bold">
                                Account Information
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage your personal details
                            </p>

                        </div>



                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            {editingName ? (

                                <div className="flex flex-col sm:flex-row gap-3">

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                    />

                                    <div className="flex gap-2">

                                        <button
                                            onClick={handleNameUpdate}
                                            disabled={savingName}
                                            className="flex-1 sm:flex-none px-5 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
                                        >
                                            {savingName
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingName(false);
                                                setName(user.name);
                                                setError("");
                                            }}
                                            className="flex-1 sm:flex-none px-5 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            ) : (

                                <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-lg px-4 py-3">

                                    <span className="text-gray-800 break-words">
                                        {user.name}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setEditingName(true);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="text-sm font-semibold text-black hover:underline flex-shrink-0"
                                    >
                                        Edit
                                    </button>

                                </div>

                            )}

                        </div>



                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <div className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-600 break-all">
                                {user.email}
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Email cannot be changed.
                            </p>

                        </div>



                        <div className="border-t border-gray-200 pt-6">


                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Contact Details
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage your phone number and location
                                    </p>

                                </div>


                                {!editingDetails && (

                                    <button
                                        onClick={() => {

                                            setEditingDetails(true);
                                            setError("");
                                            setSuccess("");

                                        }}
                                        className="self-start sm:self-auto text-sm font-semibold text-black hover:underline"
                                    >
                                        Edit
                                    </button>

                                )}

                            </div>



                            {editingDetails ? (

                                <div className="space-y-5">


                                    {/* Phone */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="Enter 10-digit phone number"
                                            maxLength={10}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        />

                                    </div>


                                    {/* Location */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            value={locationText}
                                            onChange={(e) =>
                                                setLocationText(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: Hyderabad"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        />

                                        <p className="text-xs text-gray-400 mt-2">
                                            Enter your city or area for nearby swap matching.
                                        </p>

                                    </div>


                                    {/* Buttons */}

                                    <div className="flex flex-col sm:flex-row gap-3">

                                        <button
                                            onClick={handleDetailsUpdate}
                                            disabled={savingDetails}
                                            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {savingDetails
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>


                                        <button
                                            onClick={() => {

                                                setEditingDetails(false);

                                                setPhone(
                                                    user.phone || ""
                                                );

                                                setLocationText("");

                                                setError("");
                                                setSuccess("");

                                            }}
                                            className="border border-gray-300 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            ) : (


                                <div className="space-y-4">


                                    {/* Phone */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Phone
                                        </label>

                                        <div className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-700">
                                            {user.phone ||
                                                "Not provided"}
                                        </div>

                                    </div>


                                    {/* Location */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Location
                                        </label>

                                        <div className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-700">
                                            {user.locationName || "Location not provided"}
                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>


                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;