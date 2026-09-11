import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "../Context/Auth";

// Components
import Navbar from "../Components/Navbar";
import AdminProtectedRoute from "../Components/AdminProtectedRoute";
import AdminLayout from "../Components/AdminLayout";

// Normal pages
import Register from "../Features/Auth/Register";
import Login from "../Features/Auth/Login";
import Home from "../Pages/Home";
import AddClothing from "../Pages/AddClothing";
import MyListings from "../Pages/MyListings";
import Marketplace from "../Pages/Marketplace";
import ClothingDetails from "../Pages/ClothingDetails";
import SwapRequest from "../Pages/swapRequest";
import SwapRequests from "../Pages/SwapRequests";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import EditClothing from "../Pages/EditClothing";

// Admin pages
import AdminDashboard from "../Pages/AdminDashboard";
import AdminUsers from "../Pages/AdminUsers";
import AdminClothing from "../Pages/AdminClothing";
import AdminSwaps from "../Pages/AdminSwaps";
import AdminSwapDetails from "../Pages/AdminSwapDetails";
import AdminUserDetails from "../Pages/AdminUserDetails";
import AdminClothingDetails from "../Pages/AdminClothingDetails";
import ProtectedRoute from "../Components/ProtectedRoute";
import Profile from "../Pages/Profile";


const App = () => {

  const location = useLocation();

  // Hide normal Navbar on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!isAdminRoute && !isAuthPage && <Navbar />}

      <Routes>

        {/*  NORMAL ROUTES  */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={<Home />}
        />
        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/add-clothing"
            element={<AddClothing />}
          />

          <Route
            path="/my-listings"
            element={<MyListings />}
          />





          <Route
            path="/swap-request/:id"
            element={<SwapRequest />}
          />

          <Route
            path="/swap-requests"
            element={<SwapRequests />}
          />

          <Route
            path="/chat/:swapRequestId"
            element={<Chat />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/edit-clothing/:id"
            element={<EditClothing />}
          />

        </Route>
        <Route
          path="/marketplace"
          element={<Marketplace />}
        />
        <Route
          path="/clothing/:id"
          element={<ClothingDetails />}
        />
        {/*  ADMIN ROUTES  */}

        <Route element={<AdminProtectedRoute />}>

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <AdminLayout>
                <AdminUserDetails />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/clothing"
            element={
              <AdminLayout>
                <AdminClothing />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/clothing/:id"
            element={
              <AdminLayout>
                <AdminClothingDetails />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/swaps"
            element={
              <AdminLayout>
                <AdminSwaps />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/swaps/:id"
            element={
              <AdminLayout>
                <AdminSwapDetails />
              </AdminLayout>
            }
          />

        </Route>



        <Route
          path="*"
          element={
            <h1 className="text-center text-2xl font-bold mt-20">
              404 Not Found
            </h1>
          }
        />

      </Routes>
    </>
  );
};

export default App;