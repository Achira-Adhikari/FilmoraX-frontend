import axios from "axios";
import { clearAuth, isTokenExpired } from "./authorization";

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    maxBodyLength: Infinity,
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");

        // Check token before sending request
        if (token && !isTokenExpired()) {
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            clearAuth();
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuth();
            window.location.href = "/login"; // FIXED redirect
        }
        return Promise.reject(error);
    }
);

export default api;