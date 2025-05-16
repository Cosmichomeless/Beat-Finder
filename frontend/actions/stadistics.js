import { Localhost } from "./constants";
import axios from "axios";

// Función para obtener estadísticas del usuario
export const getUserStatistics = async (username) => {
    try {
        const response = await axios.get(`http://${Localhost}:8080/api/statistics/user/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
};

// Función específica para obtener estadísticas del historial
export const getHistoryStatistics = async (username) => {
    try {
        const response = await axios.get(`http://${Localhost}:8080/api/statistics/history-details/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas de historial:', error);
        throw error;
    }
};