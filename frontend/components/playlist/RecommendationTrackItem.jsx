import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from 'react-native-gesture-handler';
import { Colors } from '../../constants/colors';

//Item de cancion para Addsongs
const RecommendationTrackItem = ({
    track,
    isCurrentlyPlaying,
    addingTrack,
    swipeableRef,
    onTogglePlayback,
    onAddTrack
}) => {
    if (!track) return null;

    const hasPreview = track.preview && track.preview.length > 0;
    const coverUrl = track.album?.cover_medium || track.album?.cover ||
        "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";

    // Renderizar acción de deslizar a la derecha (añadir a playlist)
    const renderRightActions = () => (
        <View style={styles.rightAction}>
            <Ionicons name="add-circle" size={30} color="white" />
            <Text style={styles.actionText}>Añadir</Text>
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableRightOpen={() => {
                onAddTrack(track);
                swipeableRef?.current?.close();
            }}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
        >
            <View style={styles.trackItem}>
                <TouchableOpacity
                    onPress={() => hasPreview ? onTogglePlayback(track.preview, track.id) :
                        Alert.alert('Info', 'No hay preview disponible para esta canción')}
                    disabled={!hasPreview}
                    style={styles.playButtonContainer}
                >
                    <Image
                        source={{ uri: coverUrl }}
                        style={[styles.trackImage, isCurrentlyPlaying ? styles.playingTrackImage : null]}
                    />
                    {hasPreview && (
                        <View style={[styles.playIconOverlay, { opacity: isCurrentlyPlaying ? 0.7 : 0.4 }]}>
                            <Ionicons
                                name={isCurrentlyPlaying ? "pause" : "play"}
                                size={24}
                                color="white"
                            />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.trackInfo}>
                    <Text style={styles.trackName} numberOfLines={1}>
                        {track.title || "Canción sin título"}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {track.artist?.name || "Artista desconocido"}
                    </Text>
                    {track.recommendedFrom && (
                        <Text style={styles.recommendationSource} numberOfLines={1}>
                            {track.recommendedFrom.includes('relacionado')
                                ? track.recommendedFrom
                                : `Recomendado por ${track.recommendedFrom}`}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onAddTrack(track)}
                    disabled={addingTrack}
                >
                    {addingTrack ? (
                        <ActivityIndicator size="small" color={Colors.orange} />
                    ) : (
                        <Ionicons
                            name="add-circle"
                            size={24}
                            color={Colors.orange}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#121212',
    },
    playButtonContainer: {
        position: 'relative',
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 12,
    },
    playingTrackImage: {
        borderWidth: 2,
        borderColor: Colors.orange,
        opacity: 0.8,
    },
    playIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 12,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 4,
    },
    trackInfo: {
        flex: 1,
    },
    trackName: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
    artistName: {
        fontSize: 14,
        color: '#b3b3b3',
        marginTop: 2,
    },
    recommendationSource: {
        fontSize: 12,
        color: '#8c8c8c',
        marginTop: 2,
        fontStyle: 'italic',
    },
    addButton: {
        padding: 8,
    },
    rightAction: {
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    },
    actionText: {
        color: 'white',
        fontSize: 14,
        marginTop: 4,
    }
});

export default RecommendationTrackItem;