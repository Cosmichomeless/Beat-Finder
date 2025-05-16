import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Colors } from "../../../constants/colors";
import HistoryItem from "../../../components/history/HistoryItem";

export default function History() {
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [sound, setSound] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const swipeableRefs = useRef({});

    useEffect(() => {
        const getUserName = async () => {
            const user = await AsyncStorage.getItem("userEmail");
            if (!user) {
                console.error("User not found in AsyncStorage");
                return;
            }
            setUser(user);
        };
        getUserName();
    }, []);

    useEffect(() => {
        if (user) {
            getHistory();
        }
    }, [user]);

    // Limpiar recursos de audio cuando se desmonta el componente
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);
//Obtiene el historial del usuario 
    const getHistory = async () => {
        try {
            const response = await axios.get(
                `http://192.168.1.71:8080/api/history/${user}`
            );
            setHistory(response.data || []);
        } catch (error) {
            console.error("Error al obtener el historial", error.message);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getHistory();
        setRefreshing(false);
    };

    const playSound = async (previewUrl) => {
        try {
            setLoadingAudio(true);

            // Si ya hay un sonido reproduciendo y es la misma pista
            if (sound && currentTrack === previewUrl) {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    if (status.isPlaying) {
                        await sound.pauseAsync();
                        setIsPlaying(false);
                    } else {
                        await sound.playAsync();
                        setIsPlaying(true);
                    }
                    setLoadingAudio(false);
                    return;
                }
            }

            // Si hay un sonido previo, detenerlo
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            setCurrentTrack(previewUrl);

            // Configurar callback para cuando termine la reproducción
            const onPlaybackStatusUpdate = (status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                }
            };

            // Cargar y reproducir el audio
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
        } catch (error) {
            console.error("Error al reproducir audio:", error);
            Alert.alert("Error", "No se pudo reproducir el audio");
        } finally {
            setLoadingAudio(false);
        }
    };
//Añade la cancion a la lista de BF
    const addTrackToBeatFinderPlaylist = async (track, swipeableRef) => {
        try {
            const accessToken = await AsyncStorage.getItem(
                "spotify_access_token"
            );
            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            const playlistId = await AsyncStorage.getItem(
                "beat_finder_playlist_id"
            );
            if (!playlistId) {
                throw new Error("No se encontró el ID de la playlist");
            }

            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    uris: [`spotify:track:${track.spotifyId}`],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(`Canción ${track.title} añadida a Beat Finder Playlist`);

            Alert.alert(
                "Éxito",
                `Canción ${track.title} añadida a Beat Finder Playlist`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            if (swipeableRef && swipeableRef.current) {
                                swipeableRef.current.close();
                            }
                        }
                    }
                ]
            );

            return true;
        } catch (error) {
            console.error("Error al añadir canción a Beat Finder Playlist:", error);
            Alert.alert(
                "Error",
                "No se pudo añadir la canción a Beat Finder Playlist"
            );
            return false;
        }
    };

    const renderItem = (item) => {
        if (!swipeableRefs.current[item.id]) {
            swipeableRefs.current[item.id] = React.createRef();
        }

        return (
            <HistoryItem
                key={item.id}
                item={item}
                swipeableRef={swipeableRefs.current[item.id]}
                playSound={playSound}
                addTrackToBeatFinderPlaylist={addTrackToBeatFinderPlaylist}
                isCurrentTrack={currentTrack === item.preview}
                isPlaying={isPlaying}
                loadingAudio={loadingAudio && currentTrack === item.preview}
            />
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor='orange' 
                        colors={["orange"]} 
                    />
                }
            >
                {history.length > 0 ? (
                    history.map(renderItem)
                ) : (
                    <Text style={styles.noDataText}>
                        No hay historial disponible
                    </Text>
                )}
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    contentContainer: {
        padding: 0,
    },
    noDataText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
        padding: 20,
    },
});