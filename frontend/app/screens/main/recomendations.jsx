import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import SwipeCards from "react-native-swipe-cards";
import TrackCard from "../../../components/recommendations/TrackCard";
import LoadingScreen from "../../../components/LoadingScreen";
import StatsFooter from "../../../components/StatsFooter";
import { LinearGradient } from "expo-linear-gradient";
import { fetchAccessToken, fetchData } from "../../../actions/recommendations";
import { searchInitialTracks, loadSpotifyData } from "../../../actions/trackSearch";
import { handleSwipeRight, handleSwipeLeft } from "../../../actions/swipeActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconButton from "../../../components/IconButton";
import { HistoryIcon, RefreshIcon } from "../../../constants/icons";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import { Colors } from "../../../constants/colors";

export default function Recommendations() {
    const [accessToken, setAccessToken] = useState(null);
    const [profile, setProfile] = useState({ display_name: "" });
    const [topArtists, setTopArtists] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(30);
    const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [endTime, setEndTime] = useState(null);
    const [swipeCount, setSwipeCount] = useState(0);
    const [user, setUser] = useState("");
    const [totalTracks, setTotalTracks] = useState(0);
    const [gradientColors, setGradientColors] = useState([
        Colors.black,
        "#1a1a1a",
    ]);
    const processedTracksRef = useRef(new Set());
    const currentResultsRef = useRef([]);
    const soundRef = useRef(null);
    const soundLoadingRef = useRef(false);
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

    // Se generan los colores del gradiente 
    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    const onPlaybackStatusUpdate = useCallback((status) => {
        if (!status.isLoaded) return;

        setIsPlaying(status.isPlaying);

        if (status.isPlaying) {
            setCurrentTime(status.positionMillis / 1000);
        }

        if (status.durationMillis && status.durationMillis > 0) {
            setDuration(status.durationMillis / 1000);
        }

        if (status.didJustFinish) {
            console.log("Audio terminó de reproducirse");
            setIsPlaying(false);
        }
    }, []);

    const playSound = useCallback(async (previewUrl) => {
        if (!previewUrl) return;

        try {
            await import('../../../actions/audioActions').then(({ playTrack }) => {
                playTrack(
                    previewUrl,
                    sound,
                    setSound,
                    soundRef,
                    soundLoadingRef,
                    currentTrackUrl,
                    setCurrentTrackUrl,
                    onPlaybackStatusUpdate
                );
            });
        } catch (error) {
            console.error("Error al reproducir sonido:", error);
        }
    }, [sound, currentTrackUrl, onPlaybackStatusUpdate]);

    const togglePlayPause = useCallback(async (previewUrl) => {
        if (!previewUrl) return;

        console.log("Toggle play/pause para:", previewUrl);
        console.log("Estado actual:", {
            isPlaying,
            soundUrl: currentTrackUrl,
            mismo: currentTrackUrl === previewUrl
        });

        try {
            await import('../../../actions/audioActions').then(({ toggleAudio }) => {
                toggleAudio(
                    previewUrl,
                    sound,
                    setSound,
                    soundRef,
                    soundLoadingRef,
                    currentTrackUrl,
                    setCurrentTrackUrl,
                    onPlaybackStatusUpdate
                );
            });
        } catch (error) {
            console.error("Error en togglePlayPause:", error);
        }
    }, [sound, currentTrackUrl, isPlaying, onPlaybackStatusUpdate]);

    const playCurrentTrack = useCallback(async () => {
        try {
            if (currentResultsRef.current.length === 0) {
                console.log("No hay canciones disponibles");
                return;
            }

            const currentTrack = currentResultsRef.current[0];
            if (currentTrack && currentTrack.preview) {
                await playSound(currentTrack.preview);
            }
        } catch (error) {
            console.error("Error reproduciendo la canción actual:", error);
        }
    }, [playSound]);

    useEffect(() => {
        currentResultsRef.current = searchResults;
    }, [searchResults]);

    // Se obtienen los datos del usuario 
    useEffect(() => {
        const getUserName = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    setUser(user);
                } else {
                    console.error("Usuario no encontrado en AsyncStorage");
                }
            } catch (error) {
                console.error("Error obteniendo el usuario:", error);
            }
        };
        getUserName();
    }, []);

    // Genera y cambia el gradiente
    useEffect(() => {
        generateNewGradient();
    }, [searchResults.length, generateNewGradient]);

    // Cálculo del tiempo de carga
    const loadingTime =
        startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

    // Obtención del token de acceso
    useEffect(() => {
        const getToken = async () => {
            try {
                const token = await fetchAccessToken();
                setAccessToken(token);
            } catch (error) {
                console.error("Error obteniendo el token:", error);
            }
        };
        getToken();
    }, []);

    // Obtención de datos iniciales si hay token 
    useEffect(() => {
        if (accessToken) {
            setStartTime(Date.now());
            fetchData(accessToken, setProfile, setTopArtists, setLoading);
        }
    }, [accessToken]);

    const handleNewSearchResults = useCallback((newTracks) => {
        setSearchResults((prevResults) => {
            const newFilteredTracks = newTracks.filter((track) => {
                if (!processedTracksRef.current.has(track.id)) {
                    processedTracksRef.current.add(track.id);
                    return true;
                }
                return false;
            });

            if (newFilteredTracks.length > 0) {
                const updatedResults = [...prevResults, ...newFilteredTracks];
                currentResultsRef.current = updatedResults;
                setTotalTracks(updatedResults.length);
                return updatedResults;
            }
            return prevResults;
        });

        setEndTime(Date.now());
    }, []);

    // Búsqueda inicial de pistas cuando hay artistas
    useEffect(() => {
        if (topArtists.length > 0 && accessToken) {
            searchInitialTracks(
                topArtists,
                accessToken,
                handleNewSearchResults,
                setEndTime,
                setLoading
            );
        }
    }, [topArtists, accessToken, handleNewSearchResults]);

    // Limpiar el sonido al desmontar el componente
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync()
                    .catch((err) => console.error("Error al descargar el sonido:", err));
            }
        };
    }, [sound]);

    // Función para reiniciar la busqueda
    const handleRefresh = useCallback(async () => {
        
        setLoading(true);

        // Se detiene cualquier reproducción actual
        if (soundRef.current) {
            try {
                await soundRef.current.pauseAsync();
            } catch (error) {
                console.error("Error al pausar el audio:", error);
            }
        }

        // Limpiar los resultados y referencias
        setSearchResults([]);
        processedTracksRef.current = new Set();
        currentResultsRef.current = [];

        // Reiniciar métricas
        setSwipeCount(0);
        setTotalTracks(0);
        setStartTime(Date.now());
        setEndTime(null);

        // Volver a iniciar la búsqueda si tenemos artistas
        if (topArtists.length > 0 && accessToken) {
            searchInitialTracks(
                topArtists,
                accessToken,
                handleNewSearchResults,
                setEndTime,
                setLoading
            );
        } else {
            // Si no hay artistas, intentar obtenerlos de nuevo
            fetchData(accessToken, setProfile, setTopArtists, setLoading);
        }

        // Generar nuevo gradiente
        generateNewGradient();
    }, [accessToken, topArtists, handleNewSearchResults, generateNewGradient]);

    // Renderizado de tarjetas
    const renderCard = useCallback((track) => {
        if (!track.spotifyLoaded) {
            loadSpotifyData(track, accessToken).then((updatedTrack) => {
                setSearchResults((prevResults) => {
                    const newResults = [...prevResults];
                    const trackIndex = newResults.findIndex(
                        (t) => t.id === track.id
                    );
                    if (trackIndex !== -1) {
                        newResults[trackIndex] = updatedTrack;
                    }
                    return newResults;
                });
            });
        }

        return (
            <Animatable.View
                key={track.id}
                animation='fadeInUpBig'
                duration={1000}
            >
                <TrackCard
                    track={track}
                    playSound={() => playSound(track.preview)}
                    togglePlayPause={() => togglePlayPause(track.preview)}
                    isPlaying={isPlaying && currentTrackUrl === track.preview}
                    currentTime={currentTime}
                    duration={duration}
                />
            </Animatable.View>
        );
    }, [accessToken, playSound, togglePlayPause, isPlaying, currentTrackUrl, currentTime, duration]);

    // Funciones de manejo de swipe
    const handleYup = useCallback(
        (card) => {
            const result = handleSwipeRight(
                card,
                setSwipeCount,
                setSearchResults,
                currentResultsRef,
                null
            );

            // Generar nuevo gradiente
            generateNewGradient();

            setTimeout(() => {
                playCurrentTrack();
            }, 300);

            return result;
        },
        [setSwipeCount, setSearchResults, currentResultsRef, playCurrentTrack, generateNewGradient]
    );

    const handleNope = useCallback(
        (card) => {
            const result = handleSwipeLeft(
                card,
                setSwipeCount,
                setSearchResults,
                currentResultsRef,
                null
            );

            // Generar nuevo gradiente
            generateNewGradient();

            setTimeout(() => {
                playCurrentTrack();
            }, 300);

            return result;
        },
        [setSwipeCount, setSearchResults, currentResultsRef, playCurrentTrack, generateNewGradient]
    );

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.mainContainer}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            {loading ? (
                <LoadingScreen loadingTime={loadingTime} />
            ) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <IconButton
                            onPress={handleRefresh}
                            IconComponent={RefreshIcon}
                            iconProps={{ size: 24, color: "white" }}
                            style={styles.headerButton}
                        />

                        <Text style={styles.headerTitle}>
                            Bienvenido {user}
                        </Text>

                        <IconButton
                            onPress={() => router.push("../recomendations/History")}
                            IconComponent={HistoryIcon}
                            iconProps={{ size: 24, color: "white" }}
                            style={styles.headerButton}
                        />
                    </View>

                    <Text style={styles.swipeCountText}>
                        Has realizado {swipeCount} Swipes
                    </Text>

                    {searchResults.length > 0 ? (
                        <SwipeCards
                            cards={searchResults}
                            renderCard={renderCard}
                            handleYup={handleYup}
                            handleNope={handleNope}
                        />
                    ) : (
                        <Text style={styles.text}>
                            No se encontraron canciones
                        </Text>
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
    text: {
        color: "#ffffff",
        fontSize: 16,
        marginBottom: 2,
    },
    container: {
        flex: 1,
    },
    swipeCountText: {
        color: "#ffffff",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
        marginTop: 25,
    },
    header: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 0,
    },
    headerButton: {
        padding: 8, 
    },
    headerTitle: {
        color: "#ffffff",
        fontSize: 24,
        textAlign: "center",
        flex: 1,
    }
});