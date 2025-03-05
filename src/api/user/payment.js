// src/api/userApi.js

import api from "../apiInterface";


export const getAllPayments = async () => {
    try {
        const response = await api.get('/payments-home-page-mobileapp');
        return response.data; // Return response message
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
