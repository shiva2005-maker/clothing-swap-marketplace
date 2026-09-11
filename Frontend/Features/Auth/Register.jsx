import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Basic validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.phone
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/register`,
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log("User registered successfully:", res.data);

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
            });

            // Redirect to login
            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            console.error("Error registering user:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-black">
                            SwapWear
                        </h1>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-5">
                            Create Account
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Join the clothing exchange community
                        </p>

                    </div>


                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}


                    {/* Success Message */}
                    {success && (
                        <div className="mb-5 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}


                    {/* Form */}
                    <form
                        onSubmit={submitHandler}
                        className="space-y-5"
                    >

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={changeHandler}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                            />
                        </div>


                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={changeHandler}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                            />
                        </div>


                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={changeHandler}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                            />
                        </div>


                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={changeHandler}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Password must be at least 6 characters.
                            </p>
                        </div>


                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }
                        </button>

                    </form>


                    {/* Login */}
                    <div className="text-center mt-7 pt-6 border-t border-gray-200">

                        <p className="text-sm text-gray-500">
                            Already have an account?
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="mt-2 text-black font-semibold hover:underline"
                        >
                            Login here
                        </button>

                    </div>

                </div>


                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-5">
                    Clothing Exchange & Swap Marketplace
                </p>

            </div>

        </div>
    );
};

export default Register;