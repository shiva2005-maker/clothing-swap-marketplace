import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth";

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [auth, setAuth] = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/login`,
                formData,
                {
                    withCredentials: true,
                }
            );

            const authData = {
                user: res.data.user,
                token: res.data.token,
            };

            localStorage.setItem(
                "auth",
                JSON.stringify(authData)
            );

            setAuth(authData);

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

            setFormData({
                email: "",
                password: "",
            });

        } catch (error) {

            console.error("Error logging in user:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                    {/* Logo */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-black">
                            SwapWear
                        </h1>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-5">
                            Welcome Back
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Login to continue exchanging clothes
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={submitHandler}
                        className="space-y-5"
                    >

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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={changeHandler}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"
                            }
                        </button>

                    </form>

                    {/* Register */}
                    <div className="text-center mt-7 pt-6 border-t border-gray-200">

                        <p className="text-sm text-gray-500">
                            Don't have an account?
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="mt-2 text-black font-semibold hover:underline"
                        >
                            Create an account
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

export default Login;