import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colors";
import { Localhost } from "../../../constants/localhost";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { setCachedBeatFinderPlaylistId, getSpotifyToken } from "../../../actions/playlistActions";
import MainPlaylistHeader from "../../../components/playlist/MainPlaylistHeader";
import PlaylistActions from "../../../components/playlist/PlaylistActions";
import PlaylistList from "../../../components/playlist/PlaylistList";

const getLocalImageBase64 = async () => {
    try {
        const localImage = require("../../../assets/BeatFinder.png");
        const asset = await Asset.fromModule(localImage).downloadAsync();
        const base64Data = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const sizeInKB = Math.round((base64Data.length * 3) / 4 / 1024);
        if (sizeInKB > 256) {
            console.warn("¡Advertencia! La imagen excede los 256KB que permite Spotify");
        }
        return base64Data;
    } catch (error) {
        console.error("Error al cargar la imagen local:", error);
        throw error;
    }
};

const Playlist = () => {
    const router = useRouter();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showOnlyMine, setShowOnlyMine] = useState(false);
    const [creatingPlaylist, setCreatingPlaylist] = useState(false);
    const [hasBeatFinderPlaylist, setHasBeatFinderPlaylist] = useState(false);
    const [gradientColors, setGradientColors] = useState(["#000000", "#1a1a1a"]);

    const generateDarkRandomColor = () => {
        const r = Math.floor(Math.random() * 100);
        const g = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);
        return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
    };

    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    useEffect(() => {
        generateNewGradient();
    }, []);
    //Se obtiene el perfil del usuario desde spotify
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
    //Se obtiene las playlist del usuario 
    const fetchPlaylists = async () => {
        try {
            const accessToken = await getSpotifyToken();
            if (!accessToken) {
                setError("No se encontró token de acceso");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://${Localhost}:8080/api/spotify/playlists`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { limit: 50 },
            });
            const userId = await fetchCurrentUser(accessToken);
            const playlistsData = response.data.items || [];
            setPlaylists(playlistsData);

            const beatFinderPlaylist = playlistsData.find(
                (playlist) => playlist.name === "Beat Finder Saves" && playlist.owner.id === userId
            );

            setHasBeatFinderPlaylist(!!beatFinderPlaylist);
            //En caso de que no se encuentre en las playlist del usuario la de BF se pide crear 
            if (!beatFinderPlaylist && userId) {
                setTimeout(() => {
                    Alert.alert(
                        "Playlist necesaria",
                        "Para guardar tus canciones recomendadas, es necesario crear una playlist 'Beat Finder'. ¿Deseas crearla ahora?",
                        [
                            { text: "No ahora", style: "cancel" },
                            { text: "Crear Playlist", onPress: () => createBeatFinderPlaylist(userId, accessToken) },
                        ]
                    );
                }, 500);
            }

            setError(null);
        } catch (err) {
            console.error("Error al obtener las playlists:", err);
            setError("No se pudieron cargar las playlists. Intenta más tarde.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        generateNewGradient();
        fetchPlaylists();
    };
    //Funcion para crear la playlist de BF
    const createBeatFinderPlaylist = async (userId, accessToken) => {
        try {
            setCreatingPlaylist(true);

            const response = await axios.post(
                `http://${Localhost}:8080/api/spotify/users/${userId}/playlists`,
                {
                    name: "Beat Finder Saves",
                    description: "Playlist creada por Beat Finder con tus canciones favoritas",
                    public: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const createdPlaylist = response.data;
            setCachedBeatFinderPlaylistId(createdPlaylist.id);
            //Aplica la imagen de BF predefinida a la playlist 
            try {
                const beatFinderImageBase64 = await getLocalImageBase64();
                await axios.put(
                    `http://${Localhost}:8080/api/spotify/playlists/${createdPlaylist.id}/images`,
                    beatFinderImageBase64,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "image/jpeg",
                        },
                    }
                );
            } catch (imageError) {
                console.error("Error al establecer la imagen:", imageError);
            }

            setHasBeatFinderPlaylist(true);
            Alert.alert("¡Éxito!", "La playlist Beat Finder se ha creado correctamente.");
            fetchPlaylists();
            return createdPlaylist;
        } catch (error) {

            console.error("Error al crear Beat Finder Playlist:", error);
            let errorMessage = "No se pudo crear la playlist Beat Finder.";

            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = "No tienes permisos suficientes para crear playlists. Verifica los permisos de la aplicación en Spotify.";
                } else if (error.response.status === 401) {
                    errorMessage = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
                }
            }
            Alert.alert("Error", errorMessage);
            throw error;
        } finally {
            setCreatingPlaylist(false);
        }
    };

    const handleCreatePlaylist = () => {
        router.push({
            pathname: "../playlist/CreatePlaylist",
            params: { userId: currentUserId },
        });
    };

    const filteredPlaylists = showOnlyMine && currentUserId
        ? playlists.filter((playlist) => playlist.owner && playlist.owner.id === currentUserId)
        : playlists;

    return (

        <LinearGradient colors={gradientColors} style={styles.container} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
            <StatusBar style='auto' />
            <MainPlaylistHeader filteredPlaylists={filteredPlaylists} />
            <PlaylistActions
                showOnlyMine={showOnlyMine}
                setShowOnlyMine={setShowOnlyMine}
                handleCreatePlaylist={handleCreatePlaylist}
                creatingPlaylist={creatingPlaylist}
            />
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={Colors.orange} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchPlaylists}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <PlaylistList
                    filteredPlaylists={filteredPlaylists}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Playlist;