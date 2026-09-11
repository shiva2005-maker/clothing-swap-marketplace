import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminClothingDetails = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const currentUser = auth?.user;

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchClothing = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/clothing/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setItem(response.data.clothing);
            }

        } catch (error) {
            console.log("Fetch clothing details error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch clothing details"
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

        fetchClothing();
    }, [currentUser, id]);


    const handleToggle = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/clothing/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setItem((prev) => ({
                    ...prev,
                    status: response.data.status
                }));
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update clothing status"
            );
        }
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this clothing listing?"
        );

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/admin/clothing/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                navigate("/admin/clothing");
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete clothing"
            );
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                Loading clothing details...
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
                        onClick={fetchClothing}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }


    if (!item) return null;


    const isUnavailable =
        item.status === "Pending Swap" ||
        item.status === "Swapped";


    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-black text-white px-6 py-5">

                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Clothing Details
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Admin listing information
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/clothing")}
                        className="border border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                    >
                        ← Clothing
                    </button>

                </div>

            </div>


            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    {/* Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-100">

                        {item.images?.length > 0 ? (

                            item.images.map((image, index) => (

                                <img
                                    key={index}
                                    src={image}
                                    alt={`${item.title} ${index + 1}`}
                                    className="w-full h-80 object-cover"
                                />

                            ))

                        ) : (

                            <div className="h-80 flex items-center justify-center text-gray-500">
                                No Images
                            </div>

                        )}

                    </div>


                    {/* Content */}
                    <div className="p-6">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {item.title}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    {item.brand || "No brand"}
                                </p>

                            </div>

                            <span className={`px-4 py-2 rounded-full text-xs font-semibold w-fit ${item.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Inactive"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {item.status}
                            </span>

                        </div>


                        {/* Description */}
                        {item.description && (
                            <div className="mt-6">

                                <h3 className="font-semibold mb-2">
                                    Description
                                </h3>

                                <p className="text-gray-600">
                                    {item.description}
                                </p>

                            </div>
                        )}


                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    CATEGORY
                                </p>
                                <p className="font-medium mt-1">
                                    {item.category || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    SUB CATEGORY
                                </p>
                                <p className="font-medium mt-1">
                                    {item.subCategory || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    SIZE
                                </p>
                                <p className="font-medium mt-1">
                                    {item.size || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    GENDER
                                </p>
                                <p className="font-medium mt-1">
                                    {item.gender || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    CONDITION
                                </p>
                                <p className="font-medium mt-1">
                                    {item.condition || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    COLOR
                                </p>
                                <p className="font-medium mt-1">
                                    {item.color || "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    ESTIMATED VALUE
                                </p>
                                <p className="font-medium mt-1">
                                    {item.estimatedValue
                                        ? `₹${item.estimatedValue}`
                                        : "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    OWNER
                                </p>
                                <p className="font-medium mt-1">
                                    {item.owner?.name || "Unknown"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-400">
                                    LISTED ON
                                </p>
                                <p className="font-medium mt-1">
                                    {item.createdAt
                                        ? new Date(
                                            item.createdAt
                                        ).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>

                        </div>


                        {/* Actions */}
                        <div className="border-t mt-8 pt-6 flex flex-wrap gap-3">

                            <button
                                disabled={isUnavailable}
                                onClick={handleToggle}
                                className={`px-5 py-2.5 rounded-lg text-sm ${isUnavailable
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : item.status === "Available"
                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                            >
                                {item.status === "Available"
                                    ? "Deactivate"
                                    : item.status === "Inactive"
                                        ? "Activate"
                                        : "Unavailable"}
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                            >
                                Delete Listing
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminClothingDetails;