import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const login = (jwt, userRole) => {

        localStorage.setItem("token", jwt);
        localStorage.setItem("role", userRole);

        setToken(jwt);
        setRole(userRole);

    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setToken(null);
        setRole(null);

    };

    return (

        <AuthContext.Provider
            value={{
                token,
                role,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}