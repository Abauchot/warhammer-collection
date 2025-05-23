import axios from "./axios";

export const getFigurines = async (token) => {
    try {
        const response = await axios.get("/figurines", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching figurines:", error);
        throw error;
    }
}
