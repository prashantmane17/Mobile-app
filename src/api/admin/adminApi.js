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
export const getSession = async () => {
    try {
        const response = await api.get(`/mobile-session`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const getOrgProfie = async () => {
    try {
        const response = await api.get(`/get-org-profile-data`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const updateOrgProfie = async (orgId, orgData) => {
    try {
        const response = await api.put(`/editOrgitembyid/${orgId}`, orgData, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};

