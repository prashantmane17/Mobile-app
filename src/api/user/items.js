import api from "../apiInterface";

export const getAllItems = async () => {
    try {
        const response = await api.get('/items-home-page-mobilaApp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const saveItems = async (data) => {
    try {
        const response = await api.post('/save-items-mobileApp', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
export const deleteItem = async (itemId) => {
    try {
        const response = await api.delete(`/delete-itemsby-id/${itemId}`);
        return response;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};

