import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/Auth";

const Navbar = () => {

    const [auth, setAuth] = useAuth();
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const user = auth?.user;

    const isLoggedIn =
        !!user &&
        typeof user === "object" &&
        !!user._id;



    const handleLogout = async () => {

        try {

            await axios.post(
                `${import.meta.env.VITE_API_URL}/user/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

        } catch (error) {

            console.log(
                "Logout error:",
                error
            );

        } finally {

            localStorage.removeItem("auth");

            setAuth({
                user: "",
                token: null,
            });

            setOpen(false);

            navigate("/login");
        }
    };


 

    const navLinkClass = ({ isActive }) =>
        `transition-colors duration-200 ${
            isActive
                ? "text-black font-semibold"
                : "text-gray-600 hover:text-black"
        }`;


    const mobileNavLinkClass = ({ isActive }) =>
        `block py-2.5 px-3 rounded-lg transition ${
            isActive
                ? "bg-gray-100 text-black font-semibold"
                : "text-gray-700 hover:bg-gray-100"
        }`;


    const closeMenu = () => {
        setOpen(false);
    };


    return (

        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                

                <div className="h-16 flex items-center justify-between">


                    {/* LOGO */}

                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="text-xl sm:text-2xl font-bold text-black tracking-tight"
                    >
                        SwapWear
                    </Link>


               

                    <div className="hidden md:flex items-center gap-6 lg:gap-8">

                        <NavLink
                            to="/marketplace"
                            className={navLinkClass}
                        >
                            Marketplace
                        </NavLink>


                        {/* LOGGED IN ONLY */}

                        {isLoggedIn && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={navLinkClass}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/add-clothing"
                                    className={navLinkClass}
                                >
                                    Add Clothing
                                </NavLink>

                                <NavLink
                                    to="/swap-requests"
                                    className={navLinkClass}
                                >
                                    Swap Requests
                                </NavLink>
                            </>
                        )}


                        {/* ADMIN */}

                        {isLoggedIn &&
                            user?.role === "admin" && (

                                <button
                                    onClick={() =>
                                        navigate("/admin")
                                    }
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                >
                                    Admin Panel
                                </button>

                            )}

                    </div>


                    

                    <div className="hidden md:flex items-center gap-4">


                        

                        {isLoggedIn ? (

                            <>

                                {/* PROFILE */}

                                <button
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                    className="flex items-center gap-2 hover:opacity-80 transition"
                                >

                                    <img
                                        src={
                                            user?.profileimage ||
                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        }
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full object-cover border border-gray-300"
                                    />

                                    <span className="text-sm font-medium text-gray-700 max-w-28 truncate">
                                        {user?.name || "User"}
                                    </span>

                                </button>


                                {/* LOGOUT */}

                                <button
                                    onClick={handleLogout}
                                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                                >
                                    Logout
                                </button>

                            </>

                        ) : (

                      

                            <>

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="text-sm font-medium text-gray-600 hover:text-black transition"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                >
                                    Register
                                </button>

                            </>

                        )}

                    </div>



                    <button
                        onClick={() =>
                            setOpen(!open)
                        }
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-xl"
                        aria-label="Toggle menu"
                    >
                        {open ? "✕" : "☰"}
                    </button>

                </div>


              

                {open && (

                    <div className="md:hidden border-t border-gray-200 py-4">

                        <div className="space-y-1">


                            {/* MARKETPLACE */}

                            <NavLink
                                to="/marketplace"
                                onClick={closeMenu}
                                className={mobileNavLinkClass}
                            >
                                Marketplace
                            </NavLink>


                            {/* LOGGED IN LINKS */}

                            {isLoggedIn && (
                                <>

                                    <NavLink
                                        to="/dashboard"
                                        onClick={closeMenu}
                                        className={mobileNavLinkClass}
                                    >
                                        Dashboard
                                    </NavLink>


                                    <NavLink
                                        to="/add-clothing"
                                        onClick={closeMenu}
                                        className={mobileNavLinkClass}
                                    >
                                        Add Clothing
                                    </NavLink>


                                    <NavLink
                                        to="/my-listings"
                                        onClick={closeMenu}
                                        className={mobileNavLinkClass}
                                    >
                                        My Listings
                                    </NavLink>


                                    <NavLink
                                        to="/swap-requests"
                                        onClick={closeMenu}
                                        className={mobileNavLinkClass}
                                    >
                                        Swap Requests
                                    </NavLink>


                                    {/* ADMIN */}

                                    {user?.role === "admin" && (

                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                navigate("/admin");
                                            }}
                                            className="w-full text-left py-2.5 px-3 rounded-lg font-medium text-black hover:bg-gray-100 transition"
                                        >
                                            Admin Panel
                                        </button>

                                    )}


                                    {/* PROFILE */}

                                    <NavLink
                                        to="/profile"
                                        onClick={closeMenu}
                                        className={mobileNavLinkClass}
                                    >
                                        Profile
                                    </NavLink>

                                </>
                            )}


                            {/* NOT LOGGED IN */}

                            {!isLoggedIn && (

                                <>

                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            navigate("/login");
                                        }}
                                        className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Login
                                    </button>


                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            navigate("/register");
                                        }}
                                        className="w-full text-left py-2.5 px-3 rounded-lg font-medium text-black hover:bg-gray-100 transition"
                                    >
                                        Register
                                    </button>

                                </>

                            )}

                        </div>


                        

                        {isLoggedIn && (

                            <div className="border-t border-gray-200 mt-4 pt-4">


                                <div className="flex items-center gap-3 px-3 mb-4">

                                    <img
                                        src={
                                            user?.profileimage ||
                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        }
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    />

                                    <div className="min-w-0">

                                        <p className="font-medium text-gray-800 truncate">
                                            {user?.name || "User"}
                                        </p>

                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email || ""}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                                >
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </nav>
    );
};

export default Navbar;