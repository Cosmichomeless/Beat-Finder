import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Localhost } from "../constants/localhost";

// Función para obtener el token de Spotify desde AsyncStorage
const getSpotifyApiTokens = async () => {
    try {
        const accessToken = await AsyncStorage.getItem("spotify_access_token");
        if (accessToken) {
            console.log("Token de Spotify recuperado de AsyncStorage");
            return { accessToken };
        } else {
            console.error("No se encontró token de Spotify en AsyncStorage");
            return null;
        }
    } catch (error) {
        console.error("Error al recuperar token de Spotify:", error);
        return null;
    }
};

// Función para buscar imagen de artista en Spotify
export const getArtistImageFromSpotify = async (artistName) => {
    try {
        console.log("Iniciando búsqueda de imagen para artista:", artistName);
        
        // Obtener token de Spotify
        const tokens = await getSpotifyApiTokens();
        console.log("Tokens obtenidos:", tokens ? "Sí" : "No");
        
        if (!tokens || !tokens.accessToken) {
            console.error("No se pudo obtener el token de Spotify");
            return null;
        }
        
        // Mostrar primeros caracteres del token para confirmar que es válido
        console.log("Token de Spotify (primeros 10 caracteres):", 
                   tokens.accessToken.substring(0, 10) + "...");
        
        // Realizar búsqueda del artista en Spotify
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            }
        );
        
        // Verificar si hay resultados y extraer la imagen
        if (response.data && response.data.artists && response.data.artists.items.length > 0) {
            const artist = response.data.artists.items[0];
            console.log("Artista encontrado:", artist.name, "ID:", artist.id);
            
            // Spotify devuelve un array de imágenes de diferentes tamaños
            if (artist.images && artist.images.length > 0) {
                // Usar la imagen de tamaño medio o la primera disponible
                const image = artist.images.length > 1 ? artist.images[1].url : artist.images[0].url;
                console.log("Imagen encontrada para", artistName, ":", image);
                
                const result = {
                    image: image,
                    spotifyId: artist.id
                };
                
                console.log("Devolviendo datos completos:", result);
                return result;
            } else {
                console.log("El artista no tiene imágenes disponibles");
            }
        } else {
            console.log("No se encontraron resultados para el artista:", artistName);
        }
        
        console.log("No se encontró imagen para el artista:", artistName);
        return null;
    } catch (error) {
        console.error("Error al obtener imagen del artista desde Spotify:", error.message);
        
        // Si hay error de autenticación, mostrar más detalles
        if (error.response && error.response.status === 401) {
            console.error("Error de autenticación con Spotify. Detalles:", 
                          error.response.data);
        }
        
        return null;
    }
};


export const sendTrackToBackend = async (track) => {
    try {
        const response = await axios.post(`http://${Localhost}:8080/api/tracks`, {
            spotifyId: track.spotify_id,
            artist: track.artist,
            name: track.name,
            album: track.album,
            preview: track.preview,
            cover: track.image,
        });

        if (response.status === 200) {
            console.log("Track sent successfully!");
        } else {
            console.error("Error sending track:", response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error sending track:", error);
    }
};

export const sendHistoryToBackend = async (track, decision) => {
    try {
        const user = await AsyncStorage.getItem("userEmail");
        if (!user) {
            console.error("User not found in AsyncStorage");
            return;
        }

        const response = await axios.post(`http://${Localhost}:8080/api/history`, {
            user: user,
            spotifyId: track.spotify_id,
            title: track.name,
            artist: track.artist,
            album: track.album,
            image: track.image,
            preview: track.preview,
            decision: decision,
        });

        if (response.status === 200) {
            console.log("History sent successfully!");
        } else {
            console.error("Error sending history:", response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error sending history:", error);
    }
};

export const sendAlbumToBackend = async (track) => {
    try {
        const response = await axios.post(`http://${Localhost}:8080/api/albums`, {
            album: track.album,
            artist: track.artist,
            cover: track.image,
        });

        if (response.status === 200) {
            console.log("Album sent successfully!");
        } else {
            console.error("Error sending album:", response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error sending album:", error);
    }
};

export const sendArtistToBackend = async (track) => {
    try {
        // Verificar que track tenga la propiedad artist
        if (!track || !track.artist) {
            console.error("Error: track no contiene información de artista", track);
            return false;
        }

        console.log("Enviando artist al backend:", track.artist);
        
        // Buscar imagen del artista en Spotify
        const artistInfo = await getArtistImageFromSpotify(track.artist);
        console.log("Información obtenida de Spotify:", artistInfo);
        
        // Preparar datos para enviar al backend - IMPORTANTE: usar imageUrl, no image
        const artistData = {
            name: track.artist,
            dezeerId: track.deezerArtistId || null,
            spotifyId: artistInfo ? artistInfo.spotifyId : null,
            imageUrl: artistInfo ? artistInfo.image : null // Cambiado a imageUrl para coincidir con el DTO
        };
        
        console.log("Datos completos de artista a enviar:", artistData);
        
        // Enviar los datos al backend
        const response = await axios.post(`http://${Localhost}:8080/api/artists`, artistData);

        if (response.status === 200) {
            console.log("Artist sent successfully with image!");
            return true;
        } else {
            console.error("Error sending artist:", response.statusText, response.data);
            return false;
        }
    } catch (error) {
        console.error("Error sending artist:", error);
        return false;
    }
};

export const sendSwipeMetricToBackend = async (value = 1) => {
    try {
        const user = await AsyncStorage.getItem("userEmail");
        if (!user) {
            console.error("User not found in AsyncStorage");
            return;
        }

        const response = await axios.post(`http://${Localhost}:8080/api/achievements/metrics/${user}/swipes`, {
            value: value  // Por defecto es 1, pero permite personalización
        });

        if (response.status === 200) {
            console.log("Swipe metric updated successfully!");
        } else {
            console.error("Error updating swipe metric:", response.status, response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error updating swipe metric:", error);
    }
};

export const sendPlaylistCreatedMetricToBackend = async (value = 1) => {
    try {
        const user = await AsyncStorage.getItem("userEmail");
        if (!user) {
            console.error("User not found in AsyncStorage");
            return;
        }

        const response = await axios.post(`http://${Localhost}:8080/api/achievements/metrics/${user}/playlists_created`, {
            value: value  // Por defecto es 1, pero permite personalización
        });

        if (response.status === 200) {
            console.log("Playlist created metric updated successfully!");
        } else {
            console.error("Error updating playlist metric:", response.status, response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error updating playlist metric:", error);
    }
};

export const sendSongAddedMetricToBackend = async (value = 1) => {
    try {
        const user = await AsyncStorage.getItem("userEmail");
        if (!user) {
            console.error("User not found in AsyncStorage");
            return;
        }

        const response = await axios.post(`http://${Localhost}:8080/api/achievements/metrics/${user}/songs_added`, {
            value: value  // Por defecto es 1, pero permite personalización
        });

        if (response.status === 200) {
            console.log("Song added metric updated successfully!");
        } else {
            console.error("Error updating song added metric:", response.status, response.statusText, response.data);
        }
    } catch (error) {
        console.error("Error updating song added metric:", error);
    }
};