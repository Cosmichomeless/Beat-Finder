import React, { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    StatusBar,
    Alert,
    Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Audio } from "expo-av";
import { Colors } from "../../../constants/colors";
import { Localhost } from "../../../constants/localhost";
import Separator from "../../../components/Separator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PlaylistHeader from "../../../components/playlist/PlaylistHeader";
import TrackItem from "../../../components/playlist/TrackItem";
import LoadingView from "../../../components/LoadingIndicator";
import ErrorView from "../../../components/NoResultsText";
import EmptyPlaylistView from "../../../components/playlist/EmptyPlaylistView";

const { width } = Dimensions.get("window");

const PlaylistDetail = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const playlist = JSON.parse(params.playlist);
    const [tracks, setTracks] = useState([]);
    const [uniqueTracks, setUniqueTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [previewUrls, setPreviewUrls] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    // Refs para los componentes swipeable
    const swipeableRefs = useRef({});

    // Función para filtrar duplicados
    const filterDuplicateTracks = (tracksList) => {
        const trackMap = new Map();
        let hasDuplicates = false;

        const filtered = tracksList.filter(item => {
            if (!item || !item.track || !item.track.id) return false;

            if (trackMap.has(item.track.id)) {
                hasDuplicates = true;
                return false;
            }

            trackMap.set(item.track.id, true);
            return true;
        });

        if (hasDuplicates) {
            Alert.alert(
                "Canciones duplicadas detectadas",
                "Se han encontrado canciones duplicadas en la lista. Las canciones duplicadas no se mostrarán.",
                [{ text: "Entendido", style: "default" }]
            );
        }

        return filtered;
    };
//Se obtienen los datos del usuario 
    const fetchCurrentUser = async () => {
        try {
            const accessToken = await AsyncStorage.getItem(
                "spotify_access_token"
            );
            if (!accessToken) return;

            const response = await axios.get(
                `http://${Localhost}:8080/api/spotify/profile`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const userId = response.data.id;
            setCurrentUserId(userId);

            // Verificar si el usuario es el propietario de la playlist
            if (playlist && playlist.owner && playlist.owner.id === userId) {
                setIsOwner(true);
            }
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
        }
    };

    // Función para manejar el botón de menú
    const handleMenuPress = (ownerStatus) => {
        setIsOwner(ownerStatus);
        setMenuVisible(true);

        // Mostrar opciones basadas en si es propietario o no
        if (ownerStatus) {
            Alert.alert(
                "Opciones de playlist",
                "¿Qué deseas hacer con esta playlist?",
                [
                    {
                        text: "Añadir canciones",
                        onPress: handleAddSongs,
                    },
                    {
                        text: "Editar playlist",
                        onPress: handleEditPlaylist,
                    },
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Eliminar playlist",
                        onPress: handleDeletePlaylist,
                        style: "destructive",
                    },
                ]
            );
        } else {
            Alert.alert(
                "Opciones de playlist",
                "¿Qué deseas hacer con esta playlist?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Dejar de seguir",
                        onPress: handleUnfollowPlaylist,
                        style: "destructive",
                    },
                ]
            );
        }
    };

    // Función para eliminar playlist (solo propietarios)
    const handleDeletePlaylist = async () => {
        try {
            const accessToken = await AsyncStorage.getItem(
                "spotify_access_token"
            );
            if (!accessToken) {
                Alert.alert("Error", "No se encontró token de acceso");
                return;
            }
        
            Alert.alert(
                "Información",
                "Spotify no permite eliminar playlists por completo. ¿Deseas dejar de seguir esta playlist?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Dejar de seguir",
                        onPress: handleUnfollowPlaylist,
                    },
                ]
            );
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo completar la operación");
        }
    };

    // Función para dejar de seguir playlist
    const handleUnfollowPlaylist = async () => {
        try {
            const accessToken = await AsyncStorage.getItem(
                "spotify_access_token"
            );
            if (!accessToken) {
                Alert.alert("Error", "No se encontró token de acceso");
                return;
            }

            await axios.delete(
                `http://${Localhost}:8080/api/spotify/playlists/${playlist.id}/followers`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            Alert.alert(
                "Éxito",
                "Has dejado de seguir la playlist correctamente",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error("Error al dejar de seguir playlist:", error);
            Alert.alert("Error", "No se pudo dejar de seguir la playlist");
        }
    };

    // Definición del callback de actualización de estado para el reproductor de audio
    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        fetchPlaylistTracks();
        fetchCurrentUser();

        // Limpiar recursos de audio cuando se desmonta el componente
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const fetchPlaylistTracks = async () => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem(
                "spotify_access_token"
            );

            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            const response = await axios.get(
                `http://${Localhost}:8080/api/spotify/playlists/${playlist.id}/tracks`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const receivedTracks = response.data.items || [];
            setTracks(receivedTracks);

            // Filtrar los tracks duplicados
            const filteredTracks = filterDuplicateTracks(receivedTracks);
            setUniqueTracks(filteredTracks);

            setError(null);
        } catch (err) {
            console.error("Error al obtener las canciones:", err);
            setError("No se pudieron cargar las canciones. Intenta más tarde.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Función para buscar previews en Deezer
    const searchDeezerPreview = async (trackName, artistName) => {
        try {
            const cleanTrackName = trackName
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
                .replace(/[¿?¡!'"]/g, ""); // Eliminar signos de puntuación problemáticos

            const cleanArtistName = artistName
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[¿?¡!'"]/g, "");

            // Creamos la query limpia
            const query = encodeURIComponent(`${cleanTrackName} ${cleanArtistName}`);
            const response = await axios.get(
                `https://api.deezer.com/search?q=${query}`
            );

            if (response.data.data && response.data.data.length > 0) {
                return response.data.data[0].preview;
            }
            return null;
        } catch (error) {
            console.error("Error al buscar en Deezer:", error);
            return null;
        }
    };

    // Función para reproducir/pausar audio
    const handlePlayPause = async (trackId, trackName, artistName) => {
        try {
            // Si ya hay un sonido reproduciendo y es la misma pista
            if (sound && currentTrackId === trackId) {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    if (status.isPlaying) {
                        await sound.pauseAsync();
                        setIsPlaying(false);
                    } else {
                        await sound.playAsync();
                        setIsPlaying(true);
                    }
                    return;
                }
            }

            // Si hay un sonido previo, detenerlo
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            setCurrentTrackId(trackId);
            setLoadingAudio(true);

            // Verificar si ya tenemos la URL en caché
            let previewUrl = previewUrls[trackId];

            // Si no está en caché, la busca en Deezer
            if (!previewUrl) {
                previewUrl = await searchDeezerPreview(trackName, artistName);

                if (previewUrl) {
                    setPreviewUrls((prev) => ({
                        ...prev,
                        [trackId]: previewUrl,
                    }));
                } else {
                    setLoadingAudio(false);
                    Alert.alert(
                        "Error",
                        "No se encontró una vista previa para esta canción"
                    );
                    return;
                }
            }

            // Cargar y reproducir el audio
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
            setLoadingAudio(false);
        } catch (error) {
            console.error("Error al reproducir audio:", error);
            setLoadingAudio(false);
            Alert.alert("Error", "No se pudo reproducir el audio");
        }
    };

    // Función para editar la playlist
    const handleEditPlaylist = () => {
        router.push({
            pathname: "./EditPlaylist",
            params: {
                playlistId: playlist.id,
                playlistName: playlist.name,
                playlistDescription: playlist.description || "",
                playlistImageUrl: playlist.images && playlist.images.length > 0
                    ? playlist.images[0].url
                    : "",
                playlist: JSON.stringify(playlist)
            }
        });
    };

    const handleAddSongs = () => {
        router.push({
            pathname: "./PlaylistAddSongs",
            params: {
                playlistId: playlist.id,
                playlistName: playlist.name,
                tracks: JSON.stringify(
                    uniqueTracks.filter(item => item && item.track).map(item => ({
                        id: item.track.id,
                        name: item.track.name,
                        artists: item.track.artists?.map(a => a.name) || [],
                    }))
                ),
            }
        });
    };

    const handleRemoveTrack = async (track) => {
        try {
            const isPlaylistOwner = currentUserId && playlist.owner && playlist.owner.id === currentUserId;

            if (!isPlaylistOwner) {
                Alert.alert("Información", "Solo el propietario puede eliminar canciones de esta playlist");
                return;
            }

            Alert.alert(
                "Eliminar canción",
                `¿Estás seguro de que deseas eliminar "${track.name}" de esta playlist?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const accessToken = await AsyncStorage.getItem("spotify_access_token");
                                if (!accessToken) throw new Error("No se encontró token de acceso");

                                console.log("Eliminando track:", {
                                    playlistId: playlist.id,
                                    trackUri: `spotify:track:${track.id}`
                                });

                                await axios.delete(
                                    `http://${Localhost}:8080/api/spotify/playlists/${playlist.id}/tracks`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                            "Content-Type": "application/json",
                                        },
                                        data: {
                                            tracks: [{ uri: `spotify:track:${track.id}` }],
                                        },
                                    }
                                );

                                // Actualizar lista tras la eliminación
                                fetchPlaylistTracks();
                                Alert.alert("Éxito", "Canción eliminada correctamente");
                            } catch (error) {
                                console.error("Error al eliminar canción:", error.response?.data || error.message);
                                Alert.alert("Error", "No se pudo eliminar la canción. " +
                                    (error.response?.data || error.message));
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo completar la operación");
        }
    };

    const handleAddToOtherPlaylist = (track) => {
        // Obtener la URL de la imagen del álbum si está disponible
        const albumImageUrl = track.album && track.album.images && track.album.images.length > 0
            ? track.album.images[0].url
            : null;

        router.push({
            pathname: "./AddToPlaylist",
            params: {
                trackUri: `spotify:track:${track.id}`,
                trackName: track.name,
                artistName: track.artists.map(a => a.name).join(", "),
                albumImageUrl: albumImageUrl
            }
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPlaylistTracks();
    };

    // Renderizador para la FlatList
    const renderTrackItem = ({ item }) => {
        const track = item.track;
        const trackId = track.id;
        const artistNames = track.artists
            .map((artist) => artist.name)
            .join(", ");

        const isCurrentTrack = currentTrackId === trackId;

        // Crear o acceder a una referencia para este swipeable
        if (!swipeableRefs.current[trackId]) {
            swipeableRefs.current[trackId] = React.createRef();
        }

        return (
            <TrackItem
                track={track}
                trackId={trackId}
                isCurrentTrack={isCurrentTrack}
                isPlaying={isPlaying}
                loadingAudio={loadingAudio}
                onPress={() => handlePlayPause(trackId, track.name, artistNames)}
                onPlayPausePress={() => handlePlayPause(trackId, track.name, artistNames)}
                swipeableRef={swipeableRefs.current[trackId]}
                onRemoveTrack={handleRemoveTrack}
                onAddToOtherPlaylist={handleAddToOtherPlaylist}
            />
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />

                <PlaylistHeader
                    playlist={playlist}
                    currentUserId={currentUserId}
                    onMenuPress={handleMenuPress}
                />
                <Separator height={20} />

                {loading && !refreshing ? (
                    <LoadingView />
                ) : error ? (
                    <ErrorView
                        errorMessage={error}
                        onRetry={fetchPlaylistTracks}
                    />
                ) : (
                    <FlatList
                        data={uniqueTracks}
                        renderItem={renderTrackItem}
                        keyExtractor={(item, index) => `${item.track?.id || 'track'}-${index}`}
                        contentContainerStyle={styles.tracksList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={Colors.orange}
                                colors={[Colors.orange]}
                            />
                        }
                        ListEmptyComponent={<EmptyPlaylistView />}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    tracksList: {
        paddingBottom: 20,
    },
});

export default PlaylistDetail;