import api from "../api/api";

export const updateProfile = async (data,id) => {
    try {
        const response = await api.patch(`/profile/${id}`, data);
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

export const deleteProfile = async (id) => {
    try {
        const response = await api.delete(`/profile/${id}`);
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