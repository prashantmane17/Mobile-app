// src/api/userApi.js

import api from "../apiInterface";


export const getAllInvoices = async () => {
    try {
        const response = await api.get('/Recetly-View-Invoice');
        return response.data; // Return response message
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
