import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminUserDetails = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const currentUser = auth?.user;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setUser(response.data.user);
            }

        } catch (error) {
            console.log("Fetch user details error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch user details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) return;

        if (currentUser.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        fetchUser();
    }, [currentUser, id]);


    const handleToggle = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/users/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setUser((prev) => ({
                    ...prev,
                    isActive: response.data.isActive
                }));
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update user"
            );
        }
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user?.name}?`
        );

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                navigate("/admin/users");
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                Loading user details...
            </div>
        );
    }


    if (error) {
        return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-red-500 mb-4">{error}</p>

                        <button
                            onClick={fetchUser}
                            className="bg-black text-white px-5 py-2 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
        );
    }


    if (!user) return null;


    const isCurrentUser =
        String(user._id) === String(currentUser?._id);


    return (
            <div className="min-h-screen bg-gray-100">

                {/* Header */}
                <div className="bg-black text-white px-6 py-5">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">

                        <div>
                            <h1 className="text-2xl font-bold">
                                User Details
                            </h1>

                            <p className="text-gray-400 text-sm mt-1">
                                Admin user information
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="border border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                        >
                            ← Users
                        </button>

                    </div>
                </div>


                <div className="max-w-4xl mx-auto px-6 py-8">

                    {/* Profile */}
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            <img
                                src={user.profileimage}
                                alt={user.name}
                                className="w-28 h-28 rounded-full object-cover"
                            />

                            <div className="flex-1 text-center sm:text-left">

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                                    <h2 className="text-2xl font-bold">
                                        {user.name}
                                    </h2>

                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit mx-auto sm:mx-0 ${user.role === "admin"
                                            ? "bg-black text-white"
                                            : "bg-gray-200 text-gray-700"
                                        }`}>
                                        {user.role.toUpperCase()}
                                    </span>

                                </div>

                                <p className="text-gray-500 mt-2">
                                    {user.email}
                                </p>

                            </div>

                        </div>


                        {/* Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    EMAIL
                                </p>

                                <p className="font-medium mt-1 break-all">
                                    {user.email}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    PHONE
                                </p>

                                <p className="font-medium mt-1">
                                    {user.phone || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    STATUS
                                </p>

                                <p className={`font-semibold mt-1 ${user.isActive
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    JOINED
                                </p>

                                <p className="font-medium mt-1">
                                    {user.createdAt
                                        ? new Date(
                                            user.createdAt
                                        ).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>

                        </div>


                        {/* Actions */}
                        <div className="border-t mt-8 pt-6 flex flex-wrap gap-3">

                            <button
                                disabled={isCurrentUser}
                                onClick={handleToggle}
                                className={`px-5 py-2.5 rounded-lg text-sm ${isCurrentUser
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : user.isActive
                                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                            >
                                {user.isActive
                                    ? "Deactivate User"
                                    : "Activate User"}
                            </button>

                            <button
                                disabled={isCurrentUser}
                                onClick={handleDelete}
                                className={`px-5 py-2.5 rounded-lg text-sm ${isCurrentUser
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-red-100 text-red-600 hover:bg-red-200"
                                    }`}
                            >
                                Delete User
                            </button>

                        </div>

                    </div>

                </div>

            </div>
    );
};

export default AdminUserDetails;