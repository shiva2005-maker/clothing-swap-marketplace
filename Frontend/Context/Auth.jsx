import { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext();


const Authprovider = ({children})=>{
    const [auth, setAuth] = useState({
        user: "",
        token: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Restore auth data from localStorage on mount
    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            try {
                let parsedData = JSON.parse(data);
                setAuth({
                    user: parsedData.user,
                    token: parsedData.token
                });
            } catch (error) {
                console.log("Error parsing auth data from localStorage:", error);
                localStorage.removeItem('auth');
            }
        }
        setIsLoading(false);
    }, []);

    return(
        <AuthContext.Provider value={[auth, setAuth, isLoading]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export {Authprovider, useAuth}