import api from "../api/axios";

export const getWeather = () => {

    return api.get("/weather");

};