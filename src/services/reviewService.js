import api from "../api/api";

export const getAllMovies = async () => {
    try {
        const response = await api.get("/movie");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};