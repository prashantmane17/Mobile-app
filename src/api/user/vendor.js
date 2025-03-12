

import api from "../apiInterface";


export const getAllVendors = async () => {
    try {
        const response = await api.get('/vendor-home-page-mobileApp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};

export const deleteVendor = async (vendorId) => {
    try {
        const response = await api.delete(`/delete-vendorsby-id/${vendorId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
