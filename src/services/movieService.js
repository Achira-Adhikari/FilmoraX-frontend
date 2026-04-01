import api from "../api/api";

export const getAllMovies = async (filter = '') => {
    try {
        const response = await api.get(`/movie${filter ? `?filter=${filter}` : ''}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const getMovieById = async (id) => {
    try {
        const response = await api.get(`/movie/${id}`);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const addMovie = async (data) => {
    try {
        const response = await api.post("/movie", data);
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

export const updateMovie = async (data,id) => {
    try {
        const response = await api.patch(`/movie/${id}`, data);
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

export const deleteMovie = async (id) => {
    try {
        const response = await api.delete(`/movie/${id}`);
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