import api from "../api/api";

export const getAllActors = async () => {
    try {
        const response = await api.get("/actor");
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const getActorById = async (id) => {
    try {
        const response = await api.get(`/actor/${id}`);
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

export const addActor = async (data) => {
    try {
        const response = await api.post("/actor", data);
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

export const updateActor = async (data,id) => {
    try {
        const response = await api.patch(`/actor/${id}`, data);
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

export const deleteActor = async (id) => {
    try {
        const response = await api.delete(`/actor/${id}`);
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