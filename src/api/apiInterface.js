
import axios from 'axios';

const API_BASE_URL = "https://billing.portstay.com/";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;
