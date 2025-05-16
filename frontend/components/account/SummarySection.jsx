import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Separator from "../Separator";
import HeaderSeparator from "./HeaderSeparator";
import { Ionicons } from "@expo/vector-icons"; // Importar Ionicons

//Resumen de artistas y canciones account
const SummarySection = ({
    topArtists,
    topTracks,
    playArtistTopTrack,
    playPreview,
    currentTrack,
    isPlaying,
}) => {
    return (
        <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Resumen del perfil</Text>
            <HeaderSeparator />
            <Text style={styles.subTitle}>Artistas que más escuchas</Text>
            <Separator />
            {topArtists.length > 0 ? (
                topArtists.map((artist) => {
                    const isCurrentlyPlaying = currentTrack === artist.topTrack && isPlaying;

                    return (
                        <TouchableOpacity
                            key={artist.id}
                            onPress={() => playArtistTopTrack(artist.topTrack)}
                        >
                            <View style={styles.artistContainer}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: artist.images[0].url }}
                                        style={[
                                            styles.artistImage,
                                            isCurrentlyPlaying && styles.playingImage
                                        ]}
                                    />
                                    {/* Overlay con icono de play/pause */}
                                    <View style={styles.playIconOverlay}>
                                        <Ionicons
                                            name={isCurrentlyPlaying ? "pause" : "play"}
                                            size={20}
                                            color="white"
                                        />
                                    </View>
                                </View>
                                <View style={styles.artistInfo}>
                                    <Text style={styles.artistName}>
                                        {artist.name}
                                    </Text>
                                    <Text style={styles.followersText}>
                                        {artist.followers.total.toLocaleString()}{" "}
                                        Seguidores
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <Text style={styles.text}>No se encontraron artistas</Text>
            )}
            <Text style={styles.subTitle}>Canciones que más escuchas</Text>
            <Separator />
            {topTracks.length > 0 ? (
                topTracks.map((track) => {
                    const isCurrentlyPlaying = currentTrack === track.previewUrl && isPlaying;

                    return (
                        <TouchableOpacity
                            key={track.id}
                            onPress={() => playPreview(track.previewUrl)}
                        >
                            <View style={styles.trackContainer}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: track.album.images[0].url }}
                                        style={[
                                            styles.trackImage,
                                            isCurrentlyPlaying && styles.playingImage
                                        ]}
                                    />
                                    {/* Overlay con icono de play/pause */}
                                    <View style={styles.playIconOverlay}>
                                        <Ionicons
                                            name={isCurrentlyPlaying ? "pause" : "play"}
                                            size={20}
                                            color="white"
                                        />
                                    </View>
                                </View>
                                <View style={styles.trackInfo}>
                                    <Text style={styles.trackName}>
                                        {track.name}
                                    </Text>
                                    <Text style={styles.trackArtist}>
                                        {track.artists[0].name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <Text style={styles.text}>No se encontraron canciones</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    summarySection: {
        padding: 20,
    },
    summaryTitle: {
        alignSelf: "center",
        fontSize: 28,
        color: "#fff",
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 18,
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
    },
    artistContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
        marginRight: 10,
    },
    artistImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    playingImage: {
        borderWidth: 2,
        borderColor: "orange",
        opacity: 0.8,
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
        borderRadius: 10,
    },
    artistInfo: {
        flex: 1,
    },
    artistName: {
        fontSize: 16,
        color: "#fff",
    },
    followersText: {
        fontSize: 14,
        color: "#888",
    },
    trackContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    trackInfo: {
        flex: 1,
    },
    trackName: {
        fontSize: 16,
        color: "#fff",
    },
    trackArtist: {
        fontSize: 14,
        color: "#888",
    },
    text: {
        color: "#fff",
        textAlign: "center",
        marginTop: 20,
    },
});

export default SummarySection;