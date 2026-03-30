import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = () => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return true;

        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decoded?.exp || decoded.exp < currentTime) {
            clearAuth();
            window.location.href = '/login';
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error decoding token", error);
        clearAuth();
        window.location.href = '/login';
        return true;
    }
};