import api from "../api/axios";

export const getMarketPrices = () => {

    return api.get("/market-prices");

};