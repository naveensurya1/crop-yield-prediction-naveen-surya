import api from "../api/axios";

// Get logged-in farmer profile
export const getProfile = () => {
    return api.get("/farmer/profile");
};

// Update profile
export const updateProfile = (data) => {
    return api.put("/farmer/profile", data);
};

// Upload profile photo
export const uploadProfilePhoto = (file) => {

    const formData = new FormData();
    formData.append("photo", file);

    return api.post(
        "/farmer/profile/photo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

// Change password
export const changePassword = (data) => {
    return api.put("/farmer/profile/password", data);
};