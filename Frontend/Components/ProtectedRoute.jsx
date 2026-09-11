import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth";

const ProtectedRoute = () => {

    const [auth, , isLoading] = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!auth?.user || !auth?.token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;