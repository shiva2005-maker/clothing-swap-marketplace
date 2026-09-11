import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import AdminLayout from "../Components/AdminLayout";

const AdminUsers = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    const currentUser = auth?.user;

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/users`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setUsers(response.data.users);
            }

        } catch (error) {
            console.log("Fetch users error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch users"
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

        fetchUsers();
    }, [currentUser]);


    // Toggle active/inactive
    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/users/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === id
                            ? {
                                ...user,
                                isActive: response.data.isActive
                            }
                            : user
                    )
                );
            }

        } catch (error) {
            console.log("Toggle user error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update user status"
            );
        }
    };


    // Delete user
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
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
                setUsers((prevUsers) =>
                    prevUsers.filter(
                        (user) => user._id !== id
                    )
                );
            }

        } catch (error) {
            console.log("Delete user error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };


    // Search
    const filteredUsers = users.filter((user) => {
        const searchText = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText) ||
            String(user.phone || "").includes(searchText)
        );
    });


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Loading users...
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
                        onClick={fetchUsers}
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
                            User Management
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Manage registered users
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

                {/* Top controls */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold">
                                All Users
                            </h2>

                            <p className="text-sm text-gray-500">
                                {filteredUsers.length} users found
                            </p>
                        </div>


                        {/* Search */}
                        <div className="w-full md:w-96">

                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-black"
                            />

                        </div>

                    </div>

                </div>


                {/* Users table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    {filteredUsers.length === 0 ? (

                        <div className="py-16 text-center">

                            <p className="text-gray-500">
                                No users found
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            User
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Phone
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Role
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Status
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold">
                                            Joined
                                        </th>

                                        <th className="text-right px-6 py-4 text-sm font-semibold">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredUsers.map((user) => {

                                        const isCurrentUser =
                                            String(user._id) ===
                                            String(currentUser?._id);

                                        return (
                                            <tr
                                                key={user._id}
                                                className="border-b last:border-b-0 hover:bg-gray-50"
                                            >

                                                {/* User */}
                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <img
                                                            src={
                                                                user.profileimage
                                                            }
                                                            alt={user.name}
                                                            className="w-11 h-11 rounded-full object-cover"
                                                        />

                                                        <div>

                                                            <p className="font-semibold text-gray-900">
                                                                {user.name}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {user.email}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Phone */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {user.phone || "—"}
                                                </td>


                                                {/* Role */}
                                                <td className="px-6 py-4">

                                                    {user.role === "admin" ? (

                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                                                            ADMIN
                                                        </span>

                                                    ) : (

                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                                                            CUSTOMER
                                                        </span>

                                                    )}

                                                </td>


                                                {/* Status */}
                                                <td className="px-6 py-4">

                                                    {user.isActive ? (

                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                            Active
                                                        </span>

                                                    ) : (

                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                            Inactive
                                                        </span>

                                                    )}

                                                </td>


                                                {/* Joined */}
                                                <td className="px-6 py-4 text-sm text-gray-600">

                                                    {user.createdAt
                                                        ? new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString()
                                                        : "—"}

                                                </td>


                                                {/* Actions */}
                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* View */}
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/users/${user._id}`
                                                                )
                                                            }
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                                                        >
                                                            View
                                                        </button>


                                                        {/* Toggle */}
                                                        <button
                                                            disabled={
                                                                isCurrentUser
                                                            }
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user._id
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-sm ${isCurrentUser
                                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                : user.isActive
                                                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                                                }`}
                                                        >
                                                            {user.isActive
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>


                                                        {/* Delete */}
                                                        <button
                                                            disabled={
                                                                isCurrentUser
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-sm ${isCurrentUser
                                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                : "bg-red-100 text-red-600 hover:bg-red-200"
                                                                }`}
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

export default AdminUsers;