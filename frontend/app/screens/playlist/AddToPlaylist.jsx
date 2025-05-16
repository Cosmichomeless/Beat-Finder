import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    StatusBar,
    RefreshControl,
    Dimensions
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/colors";
import { Localhost } from "../../../constants/localhost";
import { getSpotifyToken } from "../../../actions/playlistActions";
import { LinearGradient } from "expo-linear-gradient";

export default function AddToPlaylist() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const trackUri = params.trackUri;
    const trackName = params.trackName;
    const artistName = params.artistName;
    const albumImageUrl = params.albumImageUrl || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [gradientColors, setGradientColors] = useState(["#000000", "#1a1a1a"]);

    // Genera un color oscuro para luego crear el gradiente 
    const generateDarkRandomColor = () => {
        const r = Math.floor(Math.random() * 100);
        const g = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);
        return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
    };

    // Generar nuevos colores de gradiente
    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    useEffect(() => {
        generateNewGradient();
    }, []);

    // Función para obtener datos del usuario del back
    const fetchCurrentUser = async (accessToken) => {
        try {
            const response = await axios.get(`http://${Localhost}:8080/api/spotify/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setCurrentUserId(response.data.id);
            return response.data.id;
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            return null;
        }
    };

    // Función para obtener las playlists del usuario
    const fetchUserPlaylists = async () => {
        try {
            setLoading(true);

            // Obtener token de Spotify
            const accessToken = await getSpotifyToken();

            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            // Obtener playlists
            const response = await axios.get(
                `http://${Localhost}:8080/api/spotify/playlists`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { limit: 50 }
                }
            );

            // Obtener el ID del usuario 
            const userId = await fetchCurrentUser(accessToken);

            // Guarda en el almacenamiento el user ID
            await AsyncStorage.setItem("spotify_user_id", userId);

            // Filtrar solo las playlists que son del usuario 
            const userPlaylists = response.data.items.filter(
                playlist => playlist.owner.id === userId
            );

            setPlaylists(userPlaylists);
            setError(null);

            if (userPlaylists.length === 0) {
                console.log("No se encontraron playlists del usuario", userId);
            } else {
                console.log(`Se encontraron ${userPlaylists.length} playlists del usuario`);
            }
        } catch (err) {
            console.error("Error al obtener playlists:", err);
            setError("No se pudieron cargar tus playlists. Intenta más tarde.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        generateNewGradient();
        fetchUserPlaylists();
    };

    useEffect(() => {
        fetchUserPlaylists();
    }, []);

    // Función para añadir canción a la playlist seleccionada
    const addTrackToPlaylist = async (playlistId, playlistName) => {
        if (adding) return;

        try {
            setAdding(true);
            setSelectedPlaylistId(playlistId);

            const accessToken = await getSpotifyToken();

            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            // se añade la cancion
            await axios.post(
                `http://${Localhost}:8080/api/spotify/playlists/${playlistId}/tracks`,
                {
                    uris: [trackUri]
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Alert.alert(
                "Éxito",
                `"${trackName}" se añadió a la playlist "${playlistName}"`,
                [
                    {
                        text: "OK",
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (err) {
            console.error("Error al añadir canción:", err);

            // Verificar si la canción ya existía en la playlist
            if (err.response && err.response.status === 400 &&
                err.response.data.includes("already exists")) {
                Alert.alert(
                    "Información",
                    `"${trackName}" ya existe en esta playlist`
                );
            } else {
                Alert.alert(
                    "Error",
                    "No se pudo añadir la canción a la playlist"
                );
            }
        } finally {
            setAdding(false);
            setSelectedPlaylistId(null);
        }
    };

    const renderPlaylistItem = ({ item }) => {
        const imageUrl = item.images && item.images.length > 0
            ? item.images[0].url
            : "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";

        const isSelected = selectedPlaylistId === item.id;

        return (
            <TouchableOpacity
                style={styles.playlistCard}
                onPress={() => addTrackToPlaylist(item.id, item.name)}
                disabled={adding}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.playlistImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={["transparent", "rgb(0, 0, 0)"]}
                    style={styles.gradient}
                >
                    <Text style={styles.playlistName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.playlistDetails} numberOfLines={1}>
                        {item.tracks.total} canciones
                    </Text>
                </LinearGradient>

                {isSelected && adding ? (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color={Colors.orange} />
                    </View>
                ) : (
                    <View style={styles.addIconOverlay}>
                        <Ionicons name="add-circle" size={40} color="rgba(255,255,255,0.8)" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const TrackInfoHeader = () => {
        return (
            <View style={styles.trackInfoHeader}>
                <Image
                    source={{ uri: albumImageUrl }}
                    style={styles.albumImage}
                />
                <View style={styles.trackInfoContainer}>
                    <Text style={styles.trackInfoTitle}>Añadir a playlist:</Text>
                    <Text style={styles.trackInfoDetail}>{trackName || "Canción sin título"}</Text>
                    <Text style={styles.trackInfoArtist}>{artistName || "Artista desconocido"}</Text>
                </View>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <StatusBar barStyle="light-content" />

            <TrackInfoHeader />

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.orange} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchUserPlaylists}
                    >
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={playlists}
                    renderItem={renderPlaylistItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.gridContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.orange}
                            colors={[Colors.orange]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No tienes playlists disponibles
                            </Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => router.push("./CreatePlaylist")}
                            >
                                <Text style={styles.createButtonText}>
                                    Crear una playlist
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    trackInfoHeader: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    albumImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 16,
        backgroundColor: '#333', 
    },
    trackInfoContainer: {
        flex: 1,
    },
    trackInfoTitle: {
        fontSize: 14,
        color: "#999",
        marginBottom: 4,
    },
    trackInfoDetail: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    trackInfoArtist: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: Colors.orange,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryText: {
        color: Colors.black,
        fontWeight: "bold",
    },
    gridContainer: {
        padding: 12,
    },
    playlistCard: {
        width: (Dimensions.get("window").width - 36) / 2,
        height: (Dimensions.get("window").width - 36) / 2,
        marginHorizontal: 6,
        marginVertical: 12,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#333",
        position: "relative",
    },
    playlistImage: {
        width: "100%",
        height: "100%",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "40%",
        padding: 10,
        justifyContent: "flex-end",
    },
    playlistName: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    playlistDetails: {
        color: "#DDD",
        fontSize: 12,
        marginTop: 2,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIconOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
        opacity: 0.8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: Colors.orange,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});