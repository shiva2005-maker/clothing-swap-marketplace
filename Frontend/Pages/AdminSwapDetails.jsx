import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminSwapDetails = () => {
    const [auth] = useAuth();
    const currentUser = auth?.user;

    const navigate = useNavigate();
    const { id } = useParams();

    const [swap, setSwap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSwap = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/swaps/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setSwap(response.data.swap);
            }

        } catch (error) {
            console.log("Fetch swap details error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch swap details"
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

        fetchSwap();
    }, [currentUser, id]);


    const updateStatus = async (status) => {
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
                setSwap((prev) => ({
                    ...prev,
                    status: response.data.status
                }));

                alert("Swap status updated successfully");
            }

        } catch (error) {
            console.log("Update status error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update status"
            );
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Loading swap details...
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
                        onClick={fetchSwap}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }


    if (!swap) {
        return null;
    }


    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-black text-white px-6 py-5">

                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Swap Details
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Admin view
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/swaps")}
                        className="border border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                    >
                        ← Back
                    </button>

                </div>

            </div>


            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Status */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <p className="text-sm text-gray-500">
                                Swap Request ID
                            </p>

                            <p className="font-semibold mt-1 break-all">
                                {swap._id}
                            </p>
                        </div>

                        <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                            {swap.status}
                        </span>

                    </div>

                </div>


                {/* Users */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <h2 className="text-lg font-bold mb-5">
                        Participants
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="border rounded-xl p-5">

                            <p className="text-xs text-gray-400">
                                REQUESTER
                            </p>

                            <h3 className="font-semibold mt-2">
                                {swap.requester?.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {swap.requester?.email}
                            </p>

                            <p className="text-sm text-gray-500">
                                {swap.requester?.phone}
                            </p>

                        </div>


                        <div className="border rounded-xl p-5">

                            <p className="text-xs text-gray-400">
                                RECEIVER
                            </p>

                            <h3 className="font-semibold mt-2">
                                {swap.receiver?.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {swap.receiver?.email}
                            </p>

                            <p className="text-sm text-gray-500">
                                {swap.receiver?.phone}
                            </p>

                        </div>

                    </div>

                </div>


                {/* Items */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <h2 className="text-lg font-bold mb-5">
                        Swap Items
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Requested */}
                        <div className="border rounded-xl overflow-hidden">

                            {swap.requestedItem?.images?.[0] ? (
                                <img
                                    src={swap.requestedItem.images[0]}
                                    alt={swap.requestedItem.title}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}

                            <div className="p-5">

                                <p className="text-xs text-gray-400">
                                    REQUESTED ITEM
                                </p>

                                <h3 className="font-bold text-lg mt-2">
                                    {swap.requestedItem?.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Category:{" "}
                                    {swap.requestedItem?.category}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Condition:{" "}
                                    {swap.requestedItem?.condition}
                                </p>

                            </div>

                        </div>


                        {/* Offered */}
                        <div className="border rounded-xl overflow-hidden">

                            {swap.offeredItem?.images?.[0] ? (
                                <img
                                    src={swap.offeredItem.images[0]}
                                    alt={swap.offeredItem.title}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}

                            <div className="p-5">

                                <p className="text-xs text-gray-400">
                                    OFFERED ITEM
                                </p>

                                <h3 className="font-bold text-lg mt-2">
                                    {swap.offeredItem?.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Category:{" "}
                                    {swap.offeredItem?.category}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Condition:{" "}
                                    {swap.offeredItem?.condition}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Message */}
                {swap.message && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                        <h2 className="text-lg font-bold mb-3">
                            Message
                        </h2>

                        <p className="text-gray-600">
                            {swap.message}
                        </p>

                    </div>
                )}


                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-lg font-bold mb-4">
                        Update Status
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {[
                            "Pending",
                            "Accepted",
                            "Rejected",
                            "Cancelled",
                            "Completed"
                        ].map((status) => (

                            <button
                                key={status}
                                disabled={swap.status === "Completed"}
                                onClick={() =>
                                    updateStatus(status)
                                }
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium ${swap.status === status
                                    ? "bg-black text-white"
                                    : swap.status === "Completed"
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {status}
                            </button>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminSwapDetails;