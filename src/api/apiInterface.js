
import axios from 'axios';

const API_BASE_URL = "http://192.168.1.25:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;
