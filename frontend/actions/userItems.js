import axios from "axios";

export const getUserProfile = async (accessToken) => {
    try {
        const response = await axios.get(
            "http://192.168.1.71:8080/api/spotify/profile",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        throw error;
    }
};

export const getTopArtists = async (accessToken) => {
    try {
        const response = await axios.get(
            "http://192.168.1.71:8080/api/spotify/top/artists",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return response.data.items.slice(0, 5) || [];
    } catch (error) {
        console.error("Error al obtener los artistas más escuchados:", error);
        throw error;
    }
};

export const getTopTracks = async (accessToken) => {
    try {
        const response = await axios.get(
            "http://192.168.1.71:8080/api/spotify/top/tracks",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return response.data.items.slice(0, 5) || [];
    } catch (error) {
        console.error("Error al obtener las canciones más escuchadas:", error);
        throw error;
    }
};
