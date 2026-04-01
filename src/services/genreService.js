import api from "../api/api";

export const getAllGenre = async () => {
    try {
        const response = await api.get("/genre");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const getGenreById = async (id) => {
    try {
        const response = await api.get(`/genre/${id}`);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const addGenre = async (data) => {
    try {
        const response = await api.post("/genre", data);
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

export const updateGenre = async (data,id) => {
    try {
        const response = await api.patch(`/genre/${id}`, data);
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

export const deleteGenre = async (id) => {
    try {
        const response = await api.delete(`/genre/${id}`);
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