import api from "../api/api";

export const getWatchlist = async () => {
    try {
        const response = await api.get('/watchlist');
        console.log("wishlist",response.data);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const addtoWatchlist = async (data) => {
    try {
        const response = await api.post("/watchlist", data);
        console.log(response);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};

export const deleteFromWatchlist = async (id) => {
    try {
        const response = await api.delete(`/watchlist/${id}`);
        console.log("delete",response.data);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error.message ||
            "Unexpected Error"
        );
    }
};