import api from "../api/api";

export const getHomeData = async () => {
    try {
        const response = await api.get("/home");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};