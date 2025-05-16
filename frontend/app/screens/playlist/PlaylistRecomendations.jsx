import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../../constants/colors";
import { Localhost } from "../../../constants/localhost";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAccessToken } from "../../../actions/recommendations";
import TrackCard from "../../../components/recommendations/TrackCard"; 
import LoadingScreen from "../../../components/LoadingScreen";
import * as Animatable from "react-native-animatable";
import SwipeCards from "react-native-swipe-cards";
import StatsFooter from "../../../components/StatsFooter";
import { Ionicons } from "@expo/vector-icons";
import {
    sendSwipeMetricToBackend, sendSongAddedMetricToBackend, sendTrackToBackend,
    sendHistoryToBackend,
    sendAlbumToBackend,
    sendArtistToBackend,
} from "../../../actions/backendActions";
import { createOnPlaybackStatusUpdate, playTrack, toggleAudio, stopSound } from "../../../actions/audioActions";

//Busca canciones por artista en Deezer
const searchTracksByArtist = async (artistId, limit = 10) => {
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

//Busca los artistas relacionados
const searchRelatedArtists = async (artistId, limit = 3) => {
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

//Obtiene el nombre del artista
const getArtistName = async (artistId) => {
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

//Busca canciones por genero
const searchTracksByGenreSpotify = async (genre, limit = 50, accessToken) => {
    try {
        // Normaliza el genero antes de la busqueda
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
//Busca la cancion en deezer
const searchTrackInDeezer = async (title, artist) => {
    try {
        
        const query = `track:"${title}" artist:"${artist}"`;
        const response = await axios.get(
            `https://api.deezer.com/search`,
            {
                params: { q: query, limit: 3 },
            }
        );

        // Devuelve el primer resultado que tenga preview disponible
        const tracks = response.data.data || [];
        const trackWithPreview = tracks.find(t => t.preview);

        return trackWithPreview || null;
    } catch (error) {
        console.error(`Error buscando "${title}" de ${artist} en Deezer:`, error);
        return null;
    }
};
//Busca la cancion en spotify
const searchTrackInSpotify = async (title, artist, accessToken) => {
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

            console.log(`Canción encontrada: ${title} - ${artist}`);
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

        console.log(`No se encontró coincidencia para: ${title} - ${artist}`);
        return null;
    } catch (error) {
        console.error(`Error buscando "${title}" de ${artist} en Spotify:`, error);
        return null;
    }
};

export default function PlaylistRecomendations() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { playlistId, playlistName } = params;


    const [accessToken, setAccessToken] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState([]);
    const [genreCounts, setGenreCounts] = useState({});
    const [gradientColors, setGradientColors] = useState([Colors.black, "#1a1a1a"]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(30);
    const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
    const [swipeCount, setSwipeCount] = useState(0);
    const [totalTracks, setTotalTracks] = useState(0);
    const soundRef = useRef(null);
    const soundLoadingRef = useRef(false);
    const currentResultsRef = useRef([]);

    const [username, setUsername] = useState("");

    // Configuración del callback para el estado de reproducción
    const onPlaybackStatusUpdate = useCallback(
        createOnPlaybackStatusUpdate(setIsPlaying, setCurrentTime, setDuration),
        []
    );

    useEffect(() => {
        // Si esta vacio, navega a la página principal
        if (!loading && tracks.length === 0 && totalTracks > 0) {
            // Detiene el audio 
            if (soundRef.current) {
                stopSound(sound, soundRef);
            }

            // Pequeño retraso antes de navegar
            setTimeout(() => {
                router.push("../main/playlist");
            }, 1500);
        }
    }, [loading, tracks.length, totalTracks, router, sound]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem("userEmail");

                if (user) {
                    setUsername(user);
                } else {
                    setError("No se encontró el nombre de usuario");
                    setLoading(false);
                }
            } catch (error) {
                setError("Error al obtener los datos de sesión");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Función para volver a la pantalla anterior
    const handleExit = useCallback(() => {
        // Detener cualquier reproducción actual
        if (soundRef.current) {
            stopSound(sound, soundRef);
        }

        // Volver a la pantalla anterior
        router.push("../main/playlist");
    }, [router, sound]);

    // Generar color oscuro aleatorio
    const generateDarkRandomColor = () => {
        const r = Math.floor(Math.random() * 150);
        const g = Math.floor(Math.random() * 150);
        const b = Math.floor(Math.random() * 150);
        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    };

    // Genera nuevos colores de gradiente
    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    // Obtiene del token de acceso
    useEffect(() => {
        const getToken = async () => {
            try {
                const token = await fetchAccessToken();
                if (token) {
                    setAccessToken(token);
                } else {
                    throw new Error("No se pudo obtener el token de acceso");
                }
            } catch (error) {
                console.error("Error obteniendo el token:", error);
                Alert.alert("Error", "No se pudo obtener el token de acceso");
            }
        };
        getToken();
    }, []);

    // Actualizar referencia cuando cambian los resultados
    useEffect(() => {
        currentResultsRef.current = tracks;
    }, [tracks]);

    // Limpiar sonido al desmontar el componente
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Generar nuevo gradiente cuando cambia la cantidad de tracks
    useEffect(() => {
        generateNewGradient();
    }, [tracks.length, generateNewGradient]);

    // Función para reproducir una canción 
    const playSound = useCallback(async (previewUrl) => {
        if (!previewUrl) {
            Alert.alert("No disponible", "Esta canción no tiene vista previa disponible");
            return;
        }

        try {
            await playTrack(
                previewUrl,
                sound,
                setSound,
                soundRef,
                soundLoadingRef,
                currentTrackUrl,
                setCurrentTrackUrl,
                onPlaybackStatusUpdate
            );
        } catch (error) {
            console.error("Error reproduciendo sonido:", error);
        }
    }, [sound, currentTrackUrl, onPlaybackStatusUpdate]);

    // Función para alternar reproducción/pausa 
    const togglePlayPause = useCallback(async (previewUrl) => {
        if (!previewUrl) return;

        try {
            await toggleAudio(
                previewUrl,
                sound,
                setSound,
                soundRef,
                soundLoadingRef,
                currentTrackUrl,
                setCurrentTrackUrl,
                onPlaybackStatusUpdate
            );
        } catch (error) {
            console.error("Error alternando reproducción:", error);
        }
    }, [sound, currentTrackUrl, onPlaybackStatusUpdate]);

    // Reproducir la canción actual 
    const playCurrentTrack = useCallback(async () => {
        const currentTracks = currentResultsRef.current;
        if (currentTracks && currentTracks.length > 0) {
            const currentTrack = currentTracks[0];
            if (currentTrack && currentTrack.preview) {
                await playSound(currentTrack.preview);
            }
        }
    }, [currentResultsRef, playSound]);

    const fetchPreferences = async () => {
        try {
            const startTime = Date.now();

            // Obtener el ID de la playlist desde el dispositivo 
            const storedPlaylistId = await AsyncStorage.getItem("createdPlaylistId");
            if (!storedPlaylistId) {
                throw new Error("No se encontró el ID de la playlist en el almacenamiento local");
            }

            const userId = username;
            console.log("ID de usuario obtenido:", userId);
            console.log("ID de playlist:", storedPlaylistId);

            const preferencesUrl = `http://${Localhost}:8080/api/user-preferences/user/${userId}/playlist/${storedPlaylistId}`;
            console.log("Haciendo petición a:", preferencesUrl);

            // Obtener preferencias específicas para este usuario y esta playlist
            const preferencesResponse = await axios.get(preferencesUrl);

            console.log("Preferencias obtenidas:", preferencesResponse.data);
            setPreferences(preferencesResponse.data);

            // Obtener canciones basadas en las preferencias
            let artistTracks = []; // Canciones de artistas principales
            let relatedArtistTracks = []; // Canciones de artistas relacionados
            let genreTracks = []; // Canciones basadas en géneros
            let addedTracks = new Set();
            let genreCounts = {};

            const { artist1, artist2, artist3, artist4, artist5, genre1, genre2 } = preferencesResponse.data;

            const selectedArtists = [artist1, artist2, artist3, artist4, artist5].filter(Boolean);
            const selectedGenres = [genre1, genre2].filter(Boolean);

            // Obtener canciones de artistas principales y relacionados
            if (selectedArtists.length > 0) {
                for (const artistId of selectedArtists) {
                    // Obtener el nombre del artista principal
                    const mainArtistName = await getArtistName(artistId);

                    // Obtener canciones del artista principal
                    const mainArtistResults = await searchTracksByArtist(artistId, 5); 

                    // Procesar cada canción del artista principal
                    for (const track of mainArtistResults) {
                        if (!addedTracks.has(track.id)) {
                            // Buscar la canción en Spotify
                            let spotifyTrack = null;
                            try {
                                console.log(`Buscando en Spotify: "${track.title}" - ${track.artist.name}`);
                                spotifyTrack = await searchTrackInSpotify(track.title, track.artist.name, accessToken);
                            } catch (error) {
                                console.error(`Error buscando en Spotify: ${track.title}`, error);
                            }

                            // Formatear para TrackCard con la info de Spotify incluida
                            artistTracks.push({
                                id: track.id,
                                name: track.title,
                                artist: track.artist.name,
                                preview: spotifyTrack?.preview || track.preview,
                                image: spotifyTrack?.image || track.album.cover_medium,
                                album: spotifyTrack?.album || track.album.title,
                                mainArtist: mainArtistName,
                                spotifyId: spotifyTrack?.id,
                                spotifyUri: spotifyTrack?.spotifyUri,
                                source: 'artist' 
                            });
                            addedTracks.add(track.id);
                        }
                    }

                    // Obtener artistas relacionados y sus canciones
                    const relatedArtists = await searchRelatedArtists(artistId, 2); 

                    for (const relatedArtist of relatedArtists) {
                        const relatedResults = await searchTracksByArtist(relatedArtist.id, 3); 

                        // Procesar cada canción de artistas relacionados
                        for (const track of relatedResults) {
                            if (!addedTracks.has(track.id)) {
                                // Buscar la canción en Spotify
                                let spotifyTrack = null;
                                try {
                                    spotifyTrack = await searchTrackInSpotify(track.title, track.artist.name, accessToken);
                                } catch (error) {
                                    console.error(`Error buscando en Spotify: ${track.title}`, error);
                                }

                                // Formatear para TrackCard
                                relatedArtistTracks.push({
                                    id: track.id,
                                    name: track.title,
                                    artist: track.artist.name,
                                    preview: spotifyTrack?.preview || track.preview,
                                    image: spotifyTrack?.image || track.album.cover_medium,
                                    album: spotifyTrack?.album || track.album.title,
                                    mainArtist: `${track.artist.name} (relacionado con ${mainArtistName})`,
                                    spotifyId: spotifyTrack?.id,
                                    spotifyUri: spotifyTrack?.spotifyUri,
                                    source: 'related' // Para identificar el origen
                                });
                                addedTracks.add(track.id);
                            }
                        }
                    }
                }
            }

            // Obtener canciones por género
            if (selectedGenres.length > 0) {
                const genreLimit = selectedGenres.length === 2 ? 15 : 30;

                for (const genre of selectedGenres) {
                    console.log(`Buscando canciones para el género: ${genre}`);
                    const genreResults = await searchTracksByGenreSpotify(genre, genreLimit, accessToken);
                    console.log(`Canciones encontradas para el género ${genre}:`, genreResults.length);

                    // Procesamos cada pista una por una
                    for (const track of genreResults) {
                        if (!addedTracks.has(track.id)) {
                            let previewUrl = track.preview_url;
                            let imageUrl = track.album.images[0]?.url || "https://via.placeholder.com/300";

                            // Si no tiene preview, buscamos en Deezer
                            if (!previewUrl) {
                                const deezerTrack = await searchTrackInDeezer(track.name, track.artists[0].name);
                                if (deezerTrack) {
                                    previewUrl = deezerTrack.preview;
                                    if (deezerTrack.album?.cover_medium) {
                                        imageUrl = deezerTrack.album.cover_medium;
                                    }
                                }
                            }

                            // Solo se agrega si tiene preview
                            if (previewUrl) {
                                const spotifyUri = `spotify:track:${track.id}`;

                                genreTracks.push({
                                    id: track.id,
                                    name: track.name,
                                    artist: track.artists[0].name,
                                    preview: previewUrl,
                                    image: imageUrl,
                                    album: track.album.name,
                                    genre: genre,
                                    mainArtist: genre, 
                                    spotifyId: track.id,
                                    spotifyUri: spotifyUri,
                                    source: 'genre'
                                });

                                addedTracks.add(track.id);
                                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                            }
                        }
                    }
                }
            }

            //Mezclar todas las canciones de forma balanceada
            const mixedTracks = [];

            // Determinar la proporción de cada tipo de canción para una mezcla equilibrada
            const totalTracks = artistTracks.length + relatedArtistTracks.length + genreTracks.length;
            let artistIndex = 0;
            let relatedIndex = 0;
            let genreIndex = 0;

            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // Mezclar cada colección
            shuffleArray(artistTracks);
            shuffleArray(relatedArtistTracks);
            shuffleArray(genreTracks);

            // Mezclar canciones siguiendo un patrón que combine todos los orígenes
            while (
                artistIndex < artistTracks.length ||
                relatedIndex < relatedArtistTracks.length ||
                genreIndex < genreTracks.length
            ) {
                // Añadir canción de artista principal si hay disponible
                if (artistIndex < artistTracks.length) {
                    mixedTracks.push(artistTracks[artistIndex]);
                    artistIndex++;
                }

                // Añadir canción de artista relacionado si hay disponible
                if (relatedIndex < relatedArtistTracks.length) {
                    mixedTracks.push(relatedArtistTracks[relatedIndex]);
                    relatedIndex++;
                }

                // Añadir canción de género si hay disponible
                if (genreIndex < genreTracks.length) {
                    mixedTracks.push(genreTracks[genreIndex]);
                    genreIndex++;
                }
            }

            // Aplicar un shuffle final para romper cualquier patrón predecible
            const finalTracks = shuffleArray([...mixedTracks]);

            console.log("Tracks obtenidos:", finalTracks.length);
            console.log("Desglose - Artistas:", artistTracks.length, "Relacionados:", relatedArtistTracks.length, "Géneros:", genreTracks.length);

            setTracks(finalTracks);
            setGenreCounts(genreCounts);
            setTotalTracks(finalTracks.length);
            setLoading(false);

            // Reproducir primera canción automáticamente
            if (finalTracks.length > 0) {
                setTimeout(() => {
                    playSound(finalTracks[0].preview);
                }, 1000);
            }

            const endTime = Date.now();
            setLoadingTime(((endTime - startTime) / 1000).toFixed(2));

        } catch (error) {
            console.error("Error obteniendo preferencias:", error);
            setLoading(false);
            Alert.alert("Error", "No se pudieron obtener las preferencias");
        }
    };

    // Tiempo de carga
    const [loadingTime, setLoadingTime] = useState(null);

    useEffect(() => {
        if (accessToken) {
            fetchPreferences();
        }
    }, [accessToken]);

    // Función simplificada para agregar una canción a la playlist
    const addTrackToPlaylist = useCallback(async (track) => {
        try {
            // Si no hay spotifyUri disponible, mostrar mensaje y salir
            if (!track.spotifyUri) {
                console.log(`No hay URI de Spotify para: ${track.name}`);
                Alert.alert(
                    "Información",
                    `No se pudo agregar "${track.name}" porque no se encontró en Spotify.`,
                    [{ text: "OK" }],
                    { cancelable: true }
                );
                return false;
            }

            // Obtener el ID de la playlist
            const storedPlaylistId = await AsyncStorage.getItem("createdPlaylistId");

            console.log(`Agregando ${track.spotifyUri} a la playlist ${storedPlaylistId}`);

            const response = await axios.post(
                `http://${Localhost}:8080/api/spotify/playlists/${storedPlaylistId}/tracks`,
                {
                    uris: [track.spotifyUri]
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Respuesta del servidor:", response.data);
            console.log(`Canción ${track.name} agregada a la playlist ${storedPlaylistId}`);

            return true;
        } catch (error) {
            console.error("Error agregando canción a la playlist:", error);
            console.error("Detalles del error:", error.response?.data || error.message);

            Alert.alert(
                "Error",
                "No se pudo agregar la canción a la playlist.",
                [{ text: "OK" }],
                { cancelable: true }
            );

            return false;
        }
    }, [accessToken]);

    // Funciones para swipe
    const handleYup = useCallback((card) => {
        // Acción al deslizar a la derecha
        setSwipeCount((prev) => prev + 1);
        const trackForBackend = {
            ...card,
            spotify_id: card.spotifyId 
        };
        // Agregar la canción a la playlist
        addTrackToPlaylist(card);
        sendTrackToBackend(trackForBackend);
        sendHistoryToBackend(trackForBackend, "Yup");
        sendAlbumToBackend(trackForBackend);
        sendArtistToBackend(trackForBackend);
        sendSwipeMetricToBackend(1);
        sendSongAddedMetricToBackend(1);
        // Actualizar el estado de las pistas
        setTracks((prevTracks) => {
            const newTracks = prevTracks.filter(track => track.id !== card.id);
            currentResultsRef.current = newTracks;
            return newTracks;
        });

        // Generar nuevo gradiente
        generateNewGradient();

        // Reproducir siguiente canción
        setTimeout(() => {
            playCurrentTrack();
        }, 300);

        return true;
    }, [generateNewGradient, playCurrentTrack, addTrackToPlaylist]);

    const handleNope = useCallback((card) => {
        // Acción al deslizar a la izquierda
        setSwipeCount((prev) => prev + 1);
        sendSwipeMetricToBackend(1);

        // Actualizar el estado de las pistas
        setTracks((prevTracks) => {
            const newTracks = prevTracks.filter(track => track.id !== card.id);
            currentResultsRef.current = newTracks;
            return newTracks;
        });

        // Generar nuevo gradiente
        generateNewGradient();

        // Reproducir siguiente canción
        setTimeout(() => {
            playCurrentTrack();
        }, 300);

        return true;
    }, [generateNewGradient, playCurrentTrack]);

    // Renderizar las tarjetas
    const renderCard = useCallback((track) => {
        return (
            <Animatable.View
                key={track.id}
                animation="flipInY"
                duration={1000}
            >
                <TrackCard
                    track={track}
                    playSound={() => playSound(track.preview)}
                    togglePlayPause={() => togglePlayPause(track.preview)}
                    isPlaying={isPlaying && currentTrackUrl === track.preview}
                    currentTime={currentTrackUrl === track.preview ? currentTime : 0}
                    duration={duration}
                />
               
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTag}>
                        Recomendado por: {track.mainArtist || track.genre}
                    </Text>
                </View>
            </Animatable.View>
        );
    }, [playSound, togglePlayPause, isPlaying, currentTrackUrl, currentTime, duration]);

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.mainContainer}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
    
            <TouchableOpacity
                style={styles.exitButton}
                onPress={handleExit}
            >
                <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>

            {loading ? (
                <LoadingScreen loadingTime={loadingTime} />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.swipeCountText}>
                        Has realizado {swipeCount} Swipes
                    </Text>

                    {tracks.length > 0 ? (
                        <SwipeCards
                            cards={tracks}
                            renderCard={renderCard}
                            handleYup={handleYup}
                            handleNope={handleNope}
                        />
                    ) : (
                        <Animatable.View animation="flipInY">
                            <Text style={styles.text}>
                                No hay más canciones para mostrar
                            </Text>
                            <Text style={styles.subText}>
                                Redirigiendo a la página principal...
                            </Text>
                        </Animatable.View>
                    )}

                    <StatsFooter
                        loadingTime={loadingTime}
                        totalTracks={totalTracks}
                    />
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: "500"
    },
    swipeCountText: {
        color: "#ffffff",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
        marginTop: 70,
    },
    text: {
        color: "#ffffff",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
    },
    subText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        opacity: 0.7
    },
    infoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
    },
    infoTag: {
        color: Colors.white,
        opacity: 0.8,
        fontSize: 14,
        marginHorizontal: 5,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginBottom: 5,
    },
    exitButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    }
});