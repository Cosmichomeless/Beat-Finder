import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../../constants/colors';

//Cabecera para playlist details
const PlaylistHeader = ({ playlist, currentUserId, onMenuPress }) => {
    const defaultImageUrl =
        "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";

    // Obtener nombre de usuario 
    const creatorName = playlist.owner?.display_name || "Usuario de Spotify";

    // Verifica que el usuario es el creador
    const isOwner = playlist.owner?.id === currentUserId;

    // Obtener detalles adicionales de la playlist
    const trackCount = playlist.tracks?.total || 0;
    const followerCount = playlist.followers?.total || 0;
    const isPublic = playlist.public !== false;

    return (
        <View style={styles.headerContainer}>
            <Image
                source={
                    playlist.images && playlist.images.length > 0
                        ? { uri: playlist.images[0].url }
                        : { uri: defaultImageUrl }
                }
                style={styles.headerBackground}
                resizeMode='cover'
                blurRadius={2}
            />
            <View style={styles.headerOverlay} />

            <View style={styles.headerContent}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => onMenuPress(isOwner)}
                    >
                        <Ionicons
                            name='ellipsis-horizontal'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.playlistTitle}>
                        {playlist.name || "Playlist 1"}
                    </Text>
                    <Text style={styles.playlistCreator}>
                        Creada por {creatorName}
                    </Text>
                    <View style={styles.playlistStats}>
                        <Text style={styles.statText}>
                            {trackCount} {trackCount === 1 ? 'canción' : 'canciones'}
                        </Text>
                        {followerCount > 0 && (
                            <Text style={styles.statText}>
                                • {followerCount} {followerCount === 1 ? 'seguidor' : 'seguidores'}
                            </Text>
                        )}
                        <Text style={styles.statText}>
                            • {isPublic ? 'Pública' : 'Privada'}
                        </Text>
                    </View>
                    {playlist.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {playlist.description}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: "40%",
        position: "relative",
        width: "100%",
    },
    headerBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    headerContent: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
        paddingTop: 40,
    },
    headerTopRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    titleContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 16,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: 20,
        width: "100%",
    },
    playlistCreator: {
        color: Colors.lightGray,
        fontSize: 14,
        marginTop: 5,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    playlistTitle: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
    },
    playlistStats: {
        flexDirection: 'row',
        marginTop: 5,
        flexWrap: 'wrap',
    },
    statText: {
        color: '#b3b3b3',
        fontSize: 12,
        marginRight: 5,
    },
    description: {
        color: '#e0e0e0',
        fontSize: 13,
        marginTop: 8,
        fontStyle: 'italic',
    }
});

export default PlaylistHeader;