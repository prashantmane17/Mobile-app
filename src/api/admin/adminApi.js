// src/api/userApi.js

import api from "../apiInterface";


export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/delete-usersby-id/${id}`);
        return response; // Return response message
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
