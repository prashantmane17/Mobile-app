import api from "../apiInterface";

export const getAllCustomers = async () => {
    try {
        const response = await api.get("/parties-home-page-mobileApp");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
