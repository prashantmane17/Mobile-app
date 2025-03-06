// src/api/userApi.js

import api from "../apiInterface";


export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/delete-usersby-id/${id}`);
        return response;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const setTimeZone = async (data) => {
    try {
        const response = await api.post(`/saveOrgSettins`, data);
        return response;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const getSession = async (data) => {
    try {
        const response = await api.post(`/saveOrgSettins`, data);
        return response;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};

