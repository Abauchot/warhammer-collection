import axios from "./axios";

export const login = async ({ identifier, password }) => {
    try {
        const response = await axios.post("/auth/local", {
            identifier, // CORRECT
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
}

export const register = async ({ username, email, password }) => {
    try {
        const response = await axios.post("/auth/local/register", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Register error:", error.response?.data || error.message);
        throw error;
    }
}
