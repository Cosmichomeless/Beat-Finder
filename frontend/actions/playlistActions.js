import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Localhost } from "../constants/localhost";

// Variable para cachear el ID de la playlist Beat Finder
let cachedBeatFinderPlaylistId = null;

// Función para establecer el ID cacheado (para usar desde el createBeatFinderPlaylist)
export const setCachedBeatFinderPlaylistId = (id) => {
    cachedBeatFinderPlaylistId = id;
    // También lo guardamos en AsyncStorage para persistencia
    AsyncStorage.setItem("beat_finder_playlist_id", id).catch((err) =>
        console.error("Error al guardar ID de playlist en AsyncStorage:", err)
    );
};

// Función para obtener el token con reintentos
export const getSpotifyToken = async (maxRetries = 3, delay = 1000) => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const token = await AsyncStorage.getItem("spotify_access_token");
            if (token) return token;

            // Si no hay token, esperamos antes de reintentar
            await new Promise((resolve) => setTimeout(resolve, delay));
            retries++;
        } catch (error) {
            console.log(
                `Error al obtener token (intento ${
                    retries + 1
                }/${maxRetries}):`,
                error
            );
            retries++;

            if (retries >= maxRetries) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error("No se pudo obtener el token después de varios intentos");
};

// Función para encontrar la playlist Beat Finder del usuario
export const findBeatFinderPlaylist = async (accessToken) => {
    try {
        // Si tenemos un ID cacheado, intentamos recuperarlo primero de AsyncStorage
        if (!cachedBeatFinderPlaylistId) {
            const storedId = await AsyncStorage.getItem(
                "beat_finder_playlist_id"
            );
            if (storedId) {
                console.log("Usando ID de playlist cacheado:", storedId);
                cachedBeatFinderPlaylistId = storedId;

                // Verificamos que la playlist siga existiendo con el ID cacheado
                try {
                    const playlistResponse = await axios.get(
                        `http://${Localhost}:8080/api/spotify/playlists/${storedId}`,
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );

                    if (
                        playlistResponse.data &&
                        playlistResponse.data.name === "Beat Finder Saves"
                    ) {
                        return playlistResponse.data;
                    }
                } catch (verificationError) {
                    console.log(
                        "El ID cacheado ya no es válido, buscando nuevamente"
                    );
                    cachedBeatFinderPlaylistId = null;
                }
            }
        }

        // Si no tenemos un ID cacheado válido, buscamos normalmente
        const response = await axios.get(
            `http://${Localhost}:8080/api/spotify/playlists`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { limit: 50 },
            }
        );

        const userResponse = await axios.get(
            `http://${Localhost}:8080/api/spotify/profile`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const userId = userResponse.data.id;
        const playlists = response.data.items || [];

        // Buscar la playlist Beat Finder
        const beatFinderPlaylist = playlists.find(
            (playlist) =>
                playlist.name === "Beat Finder Saves" &&
                playlist.owner.id === userId
        );

        // Si encontramos la playlist, guardamos su ID
        if (beatFinderPlaylist) {
            cachedBeatFinderPlaylistId = beatFinderPlaylist.id;
            AsyncStorage.setItem(
                "beat_finder_playlist_id",
                beatFinderPlaylist.id
            ).catch((err) =>
                console.error("Error al guardar ID de playlist:", err)
            );
        }

        return beatFinderPlaylist;
    } catch (error) {
        console.error("Error al buscar Beat Finder Playlist:", error);
        return null;
    }
};

// Función para añadir una canción a la Beat Finder Playlist
export const addTrackToBeatFinderPlaylist = async (track) => {
    try {
        // Obtener token de acceso con sistema de reintentos
        const accessToken = await getSpotifyToken();
        if (!accessToken) {
            throw new Error("No se encontró token de acceso");
        }

        let playlistId = cachedBeatFinderPlaylistId;

        // Si no tenemos ID cacheado, buscar la playlist
        if (!playlistId) {
            const beatFinderPlaylist = await findBeatFinderPlaylist(
                accessToken
            );
            if (beatFinderPlaylist) {
                playlistId = beatFinderPlaylist.id;
                cachedBeatFinderPlaylistId = playlistId;
            } else {
                console.log("No se encontró la playlist Beat Finder");
                return false;
            }
        }

        // Añadir la canción a la playlist
        await axios.post(
            `http://${Localhost}:8080/api/spotify/playlists/${playlistId}/tracks`,
            {
                uris: [`spotify:track:${track.spotify_id}`],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`Canción ${track.name} añadida a Beat Finder Playlist`);
        return true;
    } catch (error) {
        console.error("Error al añadir canción a Beat Finder Playlist:", error);
        return false;
    }
};
