import api from "../api/axios";

const API_BASE = "http://127.0.0.1:8000";

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
});

export const getProfile = () => {

    return axios.get(`${API_BASE}/farmer/profile`, authHeaders());

};

export const updateProfile = (data) => {

    return axios.put(`${API_BASE}/farmer/profile`, data, authHeaders());

};

export const uploadProfilePhoto = (file) => {

    const formData = new FormData();

    formData.append("photo", file);

    return axios.post(`${API_BASE}/farmer/profile/photo`, formData, {
        headers: {
            ...authHeaders().headers,
            "Content-Type": "multipart/form-data"
        }
    });

};

export const changePassword = (data) => {

    return axios.put(`${API_BASE}/farmer/profile/password`, data, authHeaders());

};