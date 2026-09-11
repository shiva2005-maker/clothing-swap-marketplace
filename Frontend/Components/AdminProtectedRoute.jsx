import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth";

const AdminProtectedRoute = () => {
    const [auth, , isLoading] = useAuth();

    // Wait until localStorage authentication is restored
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    const user = auth?.user;

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Not admin
    if (user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;