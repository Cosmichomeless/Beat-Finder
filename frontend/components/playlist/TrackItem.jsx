import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

// Formatea las unidades de tiempo para luego mostrarlas
const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

//Item de cancion para playlistDetails
const TrackItem = ({
    track,
    trackId,
    isCurrentTrack,
    isPlaying,
    loadingAudio,
    onPress,
    onPlayPausePress,
    swipeableRef,
    onRemoveTrack,
    onAddToOtherPlaylist,
}) => {
    const artistNames = track.artists.map((artist) => artist.name).join(", ");
    const albumImage = track.album?.images?.[0]?.url || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";
    const albumName = track.album?.name || "Álbum desconocido";
    const duration = formatDuration(track.duration_ms);

    // Renderizar las acciones de deslizamiento a la derecha (eliminar)
    const renderRightActions = (progress, dragX) => (
        <View style={styles.rightActions}>
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => onRemoveTrack(track)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    // Renderizar las acciones de deslizamiento a la izquierda (añadir a otra playlist)
    const renderLeftActions = (progress, dragX) => (
        <View style={styles.leftActions}>
            <TouchableOpacity
                style={styles.addAction}
                onPress={() => {
           
                    if (swipeableRef && swipeableRef.current) {
                        swipeableRef.current.close();
                    }
                
                    onAddToOtherPlaylist(track);
                }}
            >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.actionText}>Añadir a playlist</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            onSwipeableOpen={(direction) => {
                Object.keys(swipeableRef.current || {}).forEach(key => {
                    if (key !== trackId && swipeableRef.current[key]?.current) {
                        swipeableRef.current[key].current.close();
                    }
                });
            }}
        >
            <TouchableOpacity
                style={styles.trackItem}
                onPress={onPress}
                activeOpacity={0.7}
            >
    
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: albumImage }}
                        style={[
                            styles.trackImage,
                            isCurrentTrack && isPlaying && styles.playingImage
                        ]}
                    />

                    <View style={styles.playIconOverlay}>
                        {loadingAudio && isCurrentTrack ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <Ionicons
                                name={isCurrentTrack && isPlaying ? "pause" : "play"}
                                size={24}
                                color="white"
                            />
                        )}
                    </View>
                </View>

                <View style={styles.trackInfo}>
                    <Text style={styles.trackName} numberOfLines={1}>
                        {track.name}
                    </Text>
                    <Text style={styles.albumName} numberOfLines={1}>
                        {albumName}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {artistNames}
                    </Text>

                </View>

                <View style={styles.metadataContainer}>
                    <Text style={styles.durationText}>{duration}</Text>

                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    trackItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#121212",
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    imageContainer: {
        position: "relative",
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    trackImage: {
        width: 60,
        height: 60,

    },
    playingImage: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.orange
    },
    playIconOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 4,
    },
    trackInfo: {
        flex: 1,
        justifyContent: "center",
    },
    trackName: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
        marginBottom: 2,
    },
    albumName: {
        fontSize: 14,
        color: "#b3b3b3",
    },
    metadataContainer: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        minWidth: 90,
    },
    artistName: {
        fontSize: 14,
        color: "#b3b3b3",
        textAlign: "left",
        marginTop: 2,

    },
    durationText: {
        fontSize: 12,
        color: "#808080",
        textAlign: "right",
        marginBottom: 2,
    },
    rightActions: {
        backgroundColor: "#E53935", 
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: "100%",
    },
    leftActions: {
        backgroundColor: "#388E3C", 
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        height: "100%",
    },
    deleteAction: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    addAction: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
        marginTop: 4,
    },
});

export default TrackItem;