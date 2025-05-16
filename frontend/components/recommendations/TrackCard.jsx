import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//Carta de cancion Recommendations
const TrackCard = ({
    track,
    playSound,
    togglePlayPause,
    isPlaying,
    currentTime,
    duration,
}) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Determinar si el audio ha terminado 
    const hasFinished = currentTime > 0 && currentTime >= duration - 0.5;

    // Cambiar el icono 
    const getPlaybackIcon = () => {
        console.log("Debug TrackCard:", { isPlaying, hasFinished, currentTime, duration });

        if (isPlaying) {
            return "pause";
        } else if (hasFinished) {
            return "refresh";
        } else {
            return "play";
        }
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.mainCard}>
                <Image
                    source={{ uri: track.image }}
                    style={styles.artwork}
                />

                <View style={styles.playButtonOverlay}>
                    <Ionicons
                        name={getPlaybackIcon()}
                        size={60}
                        color="white"
                        style={styles.playIcon}
                    />
                </View>
            </TouchableOpacity>

            <View style={styles.infoSection}>
                <View style={styles.trackInfo}>
                    <Text
                        style={styles.trackName}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {track.name}
                    </Text>
                    <Text
                        style={styles.album}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {track.album}
                    </Text>
                </View>
                <Text
                    style={styles.artist}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >
                    {track.artist}
                </Text>

                <View style={styles.progressContainer}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {formatTime(currentTime)}
                        </Text>
                        <Text style={styles.timeText}>0:30</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progress,
                                {
                                    width: `${Math.min((currentTime / duration) * 100, 100)}%`,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    mainCard: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        position: "relative", 
    },
    artwork: {
        width: "100%",
        height: "100%",
    },
    playButtonOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)", 
    },
    playIcon: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    infoSection: {
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 10,
    },
    trackInfo: {
        marginBottom: 8,
    },
    trackName: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    album: {
        marginTop: 4,
        color: "#999",
        fontSize: 20,
    },
    artist: {
        color: "#999",
        fontSize: 20,
        marginBottom: 8,
    },
    progressContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    progressBar: {
        height: 3,
        backgroundColor: "#333",
        borderRadius: 1.5,
        marginBottom: 8,
    },
    progress: {
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 1.5,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    timeText: {
        color: "#999",
        fontSize: 15,
    },
});

export default TrackCard;