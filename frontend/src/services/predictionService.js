import api from "../api/axios";

export const predictYield = (data) => {

    return api.post("/predict", data);

};

export const getHistory = () => {

    return api.get("/history");

};