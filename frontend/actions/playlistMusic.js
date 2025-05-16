import axios from "axios";
import { Localhost } from "../constants/localhost";

// Funciones para API de Deezer
export const searchTracksByArtist = async (artistId, limit = 10) => {
    try {
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}/top`,
            {
                params: { limit },
            }
        );
        return response.data.data || [];
    } catch (error) {
        console.error("Error buscando canciones por artista:", error);
        throw error;
    }
};

export const searchRelatedArtists = async (artistId, limit = 3) => {
    try {
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}/related`,
            {
                params: { limit },
            }
        );
        return response.data.data || [];
    } catch (error) {
        console.error("Error buscando artistas relacionados:", error);
        throw error;
    }
};

export const getArtistName = async (artistId) => {
    try {
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}`
        );
        return response.data.name;
    } catch (error) {
        console.error("Error obteniendo el nombre del artista:", error);
        throw error;
    }
};

export const searchTrackInDeezer = async (title, artist) => {
    try {
        const encodedTitle = encodeURIComponent(title.trim());
        const encodedArtist = encodeURIComponent(artist.trim());
        const query = `track:"${title}" artist:"${artist}"`;

        const response = await axios.get(
            `https://api.deezer.com/search`,
            {
                params: { q: query, limit: 3 },
            }
        );

        // Devolvemos el primer resultado que tenga preview disponible
        const tracks = response.data.data || [];
        const trackWithPreview = tracks.find(t => t.preview);

        return trackWithPreview || null;
    } catch (error) {
        console.error(`Error buscando "${title}" de ${artist} en Deezer:`, error);
        return null;
    }
};

// Funciones para API de Spotify
export const searchTracksByGenreSpotify = async (genre, limit = 50, accessToken) => {
    try {
        const encodedGenre = encodeURIComponent(genre);
        const response = await axios.get(
            `https://api.spotify.com/v1/search`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    q: `genre:${encodedGenre}`,
                    type: "track",
                    limit,
                },
            }
        );
        return response.data.tracks.items || [];
    } catch (error) {
        console.error("Error buscando canciones por género en Spotify:", error);
        throw error;
    }
};

export const searchTrackInSpotify = async (title, artist, accessToken) => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    q: `track:"${title}" artist:"${artist}"`,
                    type: "track",
                    limit: 1,
                },
            }
        );

        // Verificar si hay resultados
        const tracks = response.data.tracks.items;
        if (tracks && tracks.length > 0) {
            const spotifyTrack = tracks[0];
            return {
                id: spotifyTrack.id,
                name: spotifyTrack.name,
                artist: spotifyTrack.artists[0].name,
                preview: spotifyTrack.preview_url,
                image: spotifyTrack.album.images[0]?.url || "https://via.placeholder.com/300",
                album: spotifyTrack.album.name,
                spotifyUri: `spotify:track:${spotifyTrack.id}`
            };
        }
        return null;
    } catch (error) {
        console.error(`Error buscando "${title}" de ${artist} en Spotify:`, error);
        return null;
    }
};

// Funciones para el backend propio
export const fetchUserPreferences = async (userId, playlistId) => {
    try {
        const preferencesUrl = `http://${Localhost}:8080/api/user-preferences/user/${userId}/playlist/${playlistId}`;
        const response = await axios.get(preferencesUrl);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo preferencias:", error);
        throw error;
    }
};

export const addTrackToSpotifyPlaylist = async (playlistId, spotifyUri, accessToken) => {
    try {
        const response = await axios.post(
            `http://${Localhost}:8080/api/spotify/playlists/${playlistId}/tracks`,
            {
                uris: [spotifyUri]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error agregando canción a la playlist:", error);
        throw error;
    }
};