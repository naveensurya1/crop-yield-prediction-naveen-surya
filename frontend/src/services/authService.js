import api from "../api/axios";

// Register
export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};

// Login
export const loginUser = (userData) => {
    return api.post("/auth/login", userData);
};

export const googleLogin = (credential) => {
    return api.post("/auth/google", { token: credential });
};

export const completeGoogleSignup = (credential, role) => {
    return api.post("/auth/google/complete", { token: credential, role });
};

// Get Roles
export const getRoles = () => {
    return api.get("/roles");
};

// Logged-in User
export const getCurrentUser = () => {
    return api.get("/auth/me");
};