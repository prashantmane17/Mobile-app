import api from "../apiInterface";

export const getAllItems = async () => {
    try {
        const response = await api.get('/items-home-page-mobilaApp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
