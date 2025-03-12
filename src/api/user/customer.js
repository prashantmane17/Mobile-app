import api from "../apiInterface";

export const getAllCustomers = async () => {
    try {
        const response = await api.get("/parties-home-page-mobileApp");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};

export const deleteCustomer = async (partyId) => {
    try {
        const response = await api.delete(`/delete-partiesby-id/${partyId}`);
        return response;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
