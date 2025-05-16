import axios from "axios";
import { Localhost } from "../constants/localhost";

const API_URL = `http://${Localhost}:8080/api/auth`;

export const loginUser = async (emailOrUsername, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: emailOrUsername, // Mantenemos la clave 'email' para compatibilidad con backend
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        throw error;
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error al registrarse", error);
        throw error;
    }
};


export const changeUsername = async (oldUsername, newUsername) => {
    try {
        const response = await axios.post(`http://${Localhost}:8080/api/users/change-username`, {
            oldUsername,
            newUsername
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el nombre de usuario", error);
        throw error;
    }
};