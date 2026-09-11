import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";

const AdminDashboard = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClothing: 0,
        availableClothing: 0,
        pendingSwaps: 0,
        completedSwaps: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUser = auth?.user;

    useEffect(() => {
        if (!currentUser) return;

        if (currentUser.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        fetchStats();
    }, [currentUser]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/dashboard`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setStats(response.data.stats);
            }

        } catch (error) {
            console.log("Admin dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading admin dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>

                    <button
                        onClick={fetchStats}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-black text-white px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Manage your clothing exchange marketplace
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <span className="text-sm text-gray-300">
                            {currentUser?.name}
                        </span>

                        <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                            ADMIN
                        </span>

                    </div>

                </div>
            </div>


            {/* Main */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

                    {/* Users */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Total Users
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.totalUsers}
                        </h2>

                        <p className="text-gray-400 text-xs mt-2">
                            Registered customers
                        </p>
                    </div>


                    {/* Clothing */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Total Clothing
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.totalClothing}
                        </h2>

                        <p className="text-gray-400 text-xs mt-2">
                            All listings
                        </p>
                    </div>


                    {/* Available */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Available
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.availableClothing}
                        </h2>

                        <p className="text-gray-400 text-xs mt-2">
                            Ready for swapping
                        </p>
                    </div>


                    {/* Pending */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Pending Swaps
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.pendingSwaps}
                        </h2>

                        <p className="text-gray-400 text-xs mt-2">
                            Waiting for response
                        </p>
                    </div>


                    {/* Completed */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Completed
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.completedSwaps}
                        </h2>

                        <p className="text-gray-400 text-xs mt-2">
                            Successful swaps
                        </p>
                    </div>

                </div>


                {/* Management */}
                <div className="mt-8">

                    <h2 className="text-xl font-bold mb-5">
                        Management
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Users */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">

                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        User Management
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        View, activate, deactivate and
                                        delete users.
                                    </p>
                                </div>

                                <span className="text-2xl">
                                    👥
                                </span>

                            </div>

                            <button
                                onClick={() => navigate("/admin/users")}
                                className="mt-5 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800"
                            >
                                Manage Users
                            </button>

                        </div>


                        {/* Clothing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">

                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Clothing Management
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        Manage clothing listings and
                                        their status.
                                    </p>
                                </div>

                                <span className="text-2xl">
                                    👕
                                </span>

                            </div>

                            <button
                                onClick={() => navigate("/admin/clothing")}
                                className="mt-5 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800"
                            >
                                Manage Clothing
                            </button>

                        </div>


                        {/* Swaps */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">

                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Swap Management
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        Monitor and manage all swap
                                        requests.
                                    </p>
                                </div>

                                <span className="text-2xl">
                                    🔄
                                </span>

                            </div>

                            <button
                                onClick={() => navigate("/admin/swaps")}
                                className="mt-5 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800"
                            >
                                Manage Swaps
                            </button>

                        </div>

                    </div>

                </div>


                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">

                    <h2 className="text-lg font-bold mb-4">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                            View Users
                        </button>

                        <button
                            onClick={() => navigate("/admin/clothing")}
                            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                            View Clothing
                        </button>

                        <button
                            onClick={() => navigate("/admin/swaps")}
                            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                            View Swaps
                        </button>

                        <button
                            onClick={fetchStats}
                            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                            Refresh Stats
                        </button>

                    </div>

                </div>

            </div>

        </div>
        </AdminLayout>
    );
};

export default AdminDashboard;