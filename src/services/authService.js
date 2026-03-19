import api from "../api/api";
import { setToken, setUser } from "../api/authorization";

export const saveAuth = (data) => {
    setToken(data.access_token);
    setUser(data.user);
};

// LOGIN
export const userLogin = async (data) => {
    try {
        console.log(data);
        const response = await api.post("/auth/signin", data);

        const { access_token, user } = response?.data?.data || {};

        if (!access_token || !user) {
            throw new Error("Invalid server response");
        }

        saveAuth(response.data.data);

        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Login failed"
        );
    }
};

// REGISTER
export const userRegister = async (data) => {
    try {
        const response = await api.post("/auth/signup", data);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Register failed"
        );
    }
};