import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminClothing = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    const currentUser = auth?.user;

    const [clothing, setClothing] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchClothing = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/clothing`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setClothing(response.data.clothing);
            }

        } catch (error) {
            console.log("Fetch clothing error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch clothing"
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
    }, [currentUser]);


    // Toggle status
    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/clothing/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setClothing((prev) =>
                    prev.map((item) =>
                        item._id === id
                            ? {
                                ...item,
                                status: response.data.status
                            }
                            : item
                    )
                );
            }

        } catch (error) {
            console.log("Toggle clothing error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update clothing status"
            );
        }
    };


    // Delete clothing
    const handleDelete = async (id) => {
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
                setClothing((prev) =>
                    prev.filter((item) => item._id !== id)
                );
            }

        } catch (error) {
            console.log("Delete clothing error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete clothing"
            );
        }
    };


    // Search + filter
    const filteredClothing = clothing.filter((item) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            item.title?.toLowerCase().includes(searchText) ||
            item.category?.toLowerCase().includes(searchText) ||
            item.brand?.toLowerCase().includes(searchText) ||
            item.color?.toLowerCase().includes(searchText) ||
            item.owner?.name?.toLowerCase().includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Loading clothing listings...
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
                        onClick={fetchClothing}
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
                            Clothing Management
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Manage all clothing listings
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

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold">
                                All Listings
                            </h2>

                            <p className="text-sm text-gray-500">
                                {filteredClothing.length} listings found
                            </p>
                        </div>


                        <div className="flex flex-col sm:flex-row gap-3">

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search title, category, brand..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-black"
                            />


                            {/* Status */}
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

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Pending Swap">
                                    Pending Swap
                                </option>

                                <option value="Swapped">
                                    Swapped
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                    </div>

                </div>


                {/* Listings */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    {filteredClothing.length === 0 ? (

                        <div className="py-16 text-center">

                            <p className="text-gray-500">
                                No clothing listings found
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Item
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Owner
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Category
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Condition
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Status
                                        </th>

                                        <th className="text-right px-6 py-4 text-sm font-semibold">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredClothing.map((item) => {

                                        const image =
                                            item.images?.length > 0
                                                ? item.images[0]
                                                : null;

                                        return (
                                            <tr
                                                key={item._id}
                                                className="border-b last:border-b-0 hover:bg-gray-50"
                                            >

                                                {/* Item */}
                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {image ? (

                                                            <img
                                                                src={image}
                                                                alt={item.title}
                                                                className="w-14 h-14 rounded-lg object-cover"
                                                            />

                                                        ) : (

                                                            <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                                No Image
                                                            </div>

                                                        )}

                                                        <div>

                                                            <p className="font-semibold text-gray-900">
                                                                {item.title}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {item.brand || "No brand"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Owner */}
                                                <td className="px-6 py-4">

                                                    <p className="text-sm font-medium">
                                                        {item.owner?.name || "Unknown"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {item.owner?.email || ""}
                                                    </p>

                                                </td>


                                                {/* Category */}
                                                <td className="px-6 py-4 text-sm text-gray-600">

                                                    <p>
                                                        {item.category || "—"}
                                                    </p>

                                                    {item.subCategory && (
                                                        <p className="text-xs text-gray-400">
                                                            {item.subCategory}
                                                        </p>
                                                    )}

                                                </td>


                                                {/* Condition */}
                                                <td className="px-6 py-4">

                                                    <span className="text-sm text-gray-600">
                                                        {item.condition || "—"}
                                                    </span>

                                                </td>


                                                {/* Status */}
                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Available"
                                                                ? "bg-green-100 text-green-700"
                                                                : item.status === "Inactive"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : item.status === "Swapped"
                                                                        ? "bg-gray-200 text-gray-700"
                                                                        : "bg-yellow-100 text-yellow-700"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>

                                                </td>


                                                {/* Actions */}
                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* View */}
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/clothing/${item._id}`
                                                                )
                                                            }
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                                                        >
                                                            View
                                                        </button>


                                                        {/* Toggle */}
                                                        <button
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={
                                                                item.status === "Pending Swap" ||
                                                                item.status === "Swapped"
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-sm ${item.status === "Pending Swap" ||
                                                                    item.status === "Swapped"
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


                                                        {/* Delete */}
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item._id
                                                                )
                                                            }
                                                            className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminClothing;