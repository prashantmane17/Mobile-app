
import api from "../apiInterface";


export const getAllProformaInvoices = async () => {
    try {
        const response = await api.get('/get-proformainvoice-details-mobileApp');
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to delete user";
    }
};