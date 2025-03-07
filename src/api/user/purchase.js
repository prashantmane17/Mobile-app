import api from "../apiInterface";

export const getAllPurchases = async () => {
    try {
        const response = await api.get('/purchase-home-page-mobileApp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
