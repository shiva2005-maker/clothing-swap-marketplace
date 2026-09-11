import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminSwaps = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    const currentUser = auth?.user;

    const [swaps, setSwaps] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSwaps = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/swaps`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setSwaps(response.data.swaps);
            }

        } catch (error) {
            console.log("Fetch swaps error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch swap requests"
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

        fetchSwaps();
    }, [currentUser]);


    // Update swap status
    const handleStatusChange = async (id, status) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/swaps/${id}/status`,
                {
                    status
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setSwaps((prev) =>
                    prev.map((swap) =>
                        swap._id === id
                            ? {
                                ...swap,
                                status: response.data.status
                            }
                            : swap
                    )
                );
            }

        } catch (error) {
            console.log("Update swap status error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update swap status"
            );
        }
    };


    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Accepted":
                return "bg-blue-100 text-blue-700";

            case "Completed":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            case "Cancelled":
                return "bg-gray-200 text-gray-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };


    const filteredSwaps =
        statusFilter === "All"
            ? swaps
            : swaps.filter(
                (swap) => swap.status === statusFilter
            );


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Loading swap requests...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white p-8 rounded-xl shadow-sm text-center">

                    <p className="text-red-500 mb-4">
                        {error}
                    </p>

                    <button
                        onClick={fetchSwaps}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-black text-white px-6 py-5">

                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Swap Management
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Monitor and manage all swap requests
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin")}
                        className="border border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>


            {/* Main */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold">
                                All Swap Requests
                            </h2>

                            <p className="text-sm text-gray-500">
                                {filteredSwaps.length} requests found
                            </p>
                        </div>


                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-black"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Accepted">
                                Accepted
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Rejected">
                                Rejected
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>
                        </select>

                    </div>

                </div>


                {/* Swap cards */}
                {filteredSwaps.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-sm py-16 text-center">

                        <p className="text-gray-500">
                            No swap requests found
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {filteredSwaps.map((swap) => {

                            const requestedImage =
                                swap.requestedItem?.images?.[0];

                            const offeredImage =
                                swap.offeredItem?.images?.[0];

                            return (
                                <div
                                    key={swap._id}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >

                                    {/* Top */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Swap ID
                                            </p>

                                            <p className="text-sm font-medium mt-1">
                                                {swap._id}
                                            </p>

                                        </div>


                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusClass(
                                                swap.status
                                            )}`}
                                        >
                                            {swap.status}
                                        </span>

                                    </div>


                                    {/* People */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                                        <div className="bg-gray-50 rounded-lg p-4">

                                            <p className="text-xs text-gray-400 mb-1">
                                                Requester
                                            </p>

                                            <p className="font-semibold">
                                                {swap.requester?.name ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {swap.requester?.email ||
                                                    ""}
                                            </p>

                                        </div>


                                        <div className="bg-gray-50 rounded-lg p-4">

                                            <p className="text-xs text-gray-400 mb-1">
                                                Receiver
                                            </p>

                                            <p className="font-semibold">
                                                {swap.receiver?.name ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {swap.receiver?.email ||
                                                    ""}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Items */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* Requested */}
                                        <div className="border rounded-xl p-4">

                                            <p className="text-sm font-semibold mb-3">
                                                Requested Item
                                            </p>

                                            <div className="flex gap-4">

                                                {requestedImage ? (

                                                    <img
                                                        src={requestedImage}
                                                        alt={
                                                            swap.requestedItem
                                                                ?.title
                                                        }
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />

                                                ) : (

                                                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                        No Image
                                                    </div>

                                                )}

                                                <div>

                                                    <p className="font-medium">
                                                        {
                                                            swap.requestedItem
                                                                ?.title
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {
                                                            swap.requestedItem
                                                                ?.category
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {
                                                            swap.requestedItem
                                                                ?.condition
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Offered */}
                                        <div className="border rounded-xl p-4">

                                            <p className="text-sm font-semibold mb-3">
                                                Offered Item
                                            </p>

                                            <div className="flex gap-4">

                                                {offeredImage ? (

                                                    <img
                                                        src={offeredImage}
                                                        alt={
                                                            swap.offeredItem
                                                                ?.title
                                                        }
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />

                                                ) : (

                                                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                        No Image
                                                    </div>

                                                )}

                                                <div>

                                                    <p className="font-medium">
                                                        {
                                                            swap.offeredItem
                                                                ?.title
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {
                                                            swap.offeredItem
                                                                ?.category
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {
                                                            swap.offeredItem
                                                                ?.condition
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Message */}
                                    {swap.message && (

                                        <div className="mt-5 bg-gray-50 rounded-lg p-4">

                                            <p className="text-xs text-gray-400 mb-1">
                                                Message
                                            </p>

                                            <p className="text-sm text-gray-700">
                                                {swap.message}
                                            </p>

                                        </div>

                                    )}


                                    {/* Bottom actions */}
                                    <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <p className="text-xs text-gray-400">
                                            Created:{" "}
                                            {swap.createdAt
                                                ? new Date(
                                                    swap.createdAt
                                                ).toLocaleString()
                                                : "—"}
                                        </p>


                                        <div className="flex flex-wrap gap-2">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/swaps/${swap._id}`
                                                    )
                                                }
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                                            >
                                                View Details
                                            </button>


                                            <select
                                                value={swap.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        swap._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
                                            >
                                                <option value="Pending">
                                                    Pending
                                                </option>

                                                <option value="Accepted">
                                                    Accepted
                                                </option>

                                                <option value="Rejected">
                                                    Rejected
                                                </option>

                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>
                                            </select>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
};

export default AdminSwaps;