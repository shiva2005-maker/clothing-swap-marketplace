import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/Auth'
import Spinner from './Spinner'
import axios from 'axios'
import { Outlet, useNavigate } from 'react-router-dom'

const PrivateRoute = () => {
  
    const [auth, setAuth, isAuthLoading] = useAuth();
    const [ok, setOk] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authcheck = async () => {
            try {
                setIsVerifying(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/checkauth`, { withCredentials: true });
                if (res.data.ok) {
                    setOk(true);
                } else {
                    // Backend validation failed, logout user and redirect
                    setAuth({ user: "", token: null });
                    localStorage.removeItem('auth');
                    setOk(false);
                    navigate('/login');
                }
            } catch (error) {
                // If check returns 401 or any error, clear auth and redirect to login
                console.log("Auth check failed:", error);
                setAuth({ user: "", token: null });
                localStorage.removeItem('auth');
                setOk(false);
                navigate('/login');
            } finally {
                setIsVerifying(false);
            }
        };

        // Wait for Auth context to finish loading from localStorage
        if (!isAuthLoading) {
            // If user has a token, verify it with backend
            if (auth?.token) {
                authcheck();
            } else {
                // No token found, user not authenticated — redirect to login
                navigate('/login');
            }
        }
    }, [auth?.token, isAuthLoading, navigate, setAuth]);

    // Show Spinner while Auth context is loading or verification in progress
    if (isAuthLoading || isVerifying) {
        return <Spinner />;
    }

    // If verified, render protected routes; otherwise null (we already redirected)
    return ok ? <Outlet /> : null;
}

export default PrivateRoute
