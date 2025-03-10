// src/api/userApi.js

import api from "../apiInterface";


export const getAllPayments = async () => {
    try {
        const response = await api.get('/payments-home-page-mobileapp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const savePayments = async (formData) => {
    try {
        const response = await api.post('/save-payment-mobileApp', formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
