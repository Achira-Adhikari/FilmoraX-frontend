import api from "../api/api";

export const getAllReview = async () => {
    try {
        const response = await api.get("/review");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const deleteReview = async (id) => {
    try {
        const response = await api.delete(`/review/${id}`);
        console.log(response.data);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};