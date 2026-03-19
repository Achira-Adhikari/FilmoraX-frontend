import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (err) {
        console.error("User parse error", err);
        return null;
    }
};

// Remove auth
export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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