import api from "../api/api";
import { setToken } from "../api/authorization";
import { useStore } from "../store/useStore";

// LOGIN
export const userLogin = async (data) => {
    try {

        const response = await api.post("/auth/signin", data);

        console.log("hello",response);

        const { access_token, user } = response?.data?.data || {};

        if (!access_token || !user) {
            throw new Error("Invalid server response");
        }

        setToken(access_token);

        useStore.getState().setUser(user);

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