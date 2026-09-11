import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

const AdminLayout = ({ children }) => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/user/logout`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            localStorage.removeItem("auth");
            setAuth({
                user: "",
                token: null
            });
            navigate("/login");
        }
    };
    const navItems = [
        {
            name: "Dashboard",
            path: "/admin"
        },
        {
            name: "Users",
            path: "/admin/users"
        },
        {
            name: "Clothing",
            path: "/admin/clothing"
        },
        {
            name: "Swaps",
            path: "/admin/swaps"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Mobile Header */}
            <div className="lg:hidden bg-black text-white h-16 px-5 flex items-center justify-between">

                <h1 className="font-bold text-lg">
                    Admin Panel
                </h1>

                <button
                    onClick={() => setOpen(!open)}
                    className="text-2xl"
                >
                    ☰
                </button>

            </div>


            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50
                    w-64 h-screen
                    bg-black text-white
                    transform transition-transform duration-300
                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                    lg:translate-x-0
                `}
            >

                {/* Logo */}
                <div className="h-20 px-6 flex items-center border-b border-gray-800">

                    <div>
                        <h1 className="text-xl font-bold">
                            Admin Panel
                        </h1>

                        <p className="text-xs text-gray-500 mt-1">
                            Clothing Exchange
                        </p>
                    </div>

                </div>


                {/* Navigation */}
                <nav className="p-4 space-y-2">

                    {navItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg text-sm font-medium transition ${isActive
                                    ? "bg-white text-black"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>

                    ))}

                </nav>


                {/* Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">

                    <div className="flex items-center gap-3 mb-4">

                        <img
                            src={
                                auth?.user?.profileimage
                            }
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="min-w-0">

                            <p className="text-sm font-medium truncate">
                                {auth?.user?.name}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                                {auth?.user?.email}
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-900 hover:text-white"
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* Mobile overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}


            {/* Main content */}
            <main className="lg:ml-64">

                {children}

            </main>

        </div>
    );
};

export default AdminLayout;