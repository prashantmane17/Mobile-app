import api from "../apiInterface";

export const getAllExpenses = async () => {
    try {
        const response = await api.get("/Expenses-home-page-mobileApp");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};


export const getAllBankData = async () => {
    try {
        const response = await api.get("/Bank-home-page-mobileApp");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};
