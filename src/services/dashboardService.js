import api from "../api/api";

export const getDashboardData = async () => {
    try {
        const response = await api.get("/dashboard");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};