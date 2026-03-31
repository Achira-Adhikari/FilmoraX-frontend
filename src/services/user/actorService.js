import api from "../../api/api";

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