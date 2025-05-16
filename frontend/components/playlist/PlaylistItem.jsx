import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";

//Item para la cuadricula de playlists
const PlaylistItem = ({ item }) => {
    const router = useRouter();
    const imageUrl = item.images && item.images.length > 0
        ? item.images[0].url
        : "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";

    return (
        <TouchableOpacity
            style={styles.playlistCard}
            onPress={() => {
                router.push({
                    pathname: "../playlist/PlaylistDetail",
                    params: { playlist: JSON.stringify(item) },
                });
            }}
        >
            <Image
                source={{ uri: imageUrl }}
                style={styles.playlistImage}
                resizeMode='cover'
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});

export default PlaylistItem;