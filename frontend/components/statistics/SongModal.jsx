import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

//Modal para mostrar las canciones de un album o artista de statistics
const SongModal = ({
    visible,
    onClose,
    modalType,
    selectedArtist,
    selectedAlbum,
    songs,
    loading,
    error,
    handlePlayPause,
    isPlaying,
    currentTrack,
    loadingTrack,
    sound
}) => {

    // Componente para renderizar una canción en la lista
    const renderSongItem = ({ item, index }) => {
        const isCurrentlyPlaying = currentTrack === item.id && isPlaying;
        const isLoading = loadingTrack[item.id];

        return (
            <TouchableOpacity
                style={styles.songItem}
                onPress={() => handlePlayPause(item)}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                <Text style={styles.songIndex}>{index + 1}.</Text>

                <View style={styles.songImageContainer}>
                    {item.image ? (
                        <Image
                            source={{ uri: item.image }}
                            style={[
                                styles.songImage,
                                isCurrentlyPlaying && styles.playingImage
                            ]}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[
                            styles.songImagePlaceholder,
                            isCurrentlyPlaying && styles.playingImage
                        ]}>
                            <Ionicons name="musical-note" size={20} color={Colors.white} />
                        </View>
                    )}

                    <View style={styles.playIconOverlay}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <Ionicons
                                name={isCurrentlyPlaying ? "pause" : "play"}
                                size={20}
                                color="white"
                            />
                        )}
                    </View>
                </View>

                <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.songAlbum} numberOfLines={1}>
                        {modalType === 'artist' ? item.album : item.artist}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleClose = () => {
        if (sound) {
            sound.pauseAsync();
        }
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)']}
                    style={styles.modalHeader}
                >
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                    >
                        <Ionicons name="close" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={styles.artistInfoContainer}>
                        {modalType === 'artist' ? (
                            // Mostrar información del artista
                            <>
                                {selectedArtist?.image_url ? (
                                    <Image
                                        source={{ uri: selectedArtist.image_url }}
                                        style={styles.modalArtistImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.modalArtistImagePlaceholder}>
                                        <Ionicons name="person" size={40} color={Colors.white} />
                                    </View>
                                )}
                                <Text style={styles.modalArtistName}>{selectedArtist?.name}</Text>
                                {!loading && (
                                    <Text style={styles.modalSongsCount}>
                                        {songs.length} {songs.length === 1 ? 'canción guardada' : 'canciones guardadas'}
                                    </Text>
                                )}
                            </>
                        ) : (
                            // Mostrar información del álbum
                            <>
                                {selectedAlbum?.image_url ? (
                                    <Image
                                        source={{ uri: selectedAlbum.image_url }}
                                        style={styles.modalAlbumImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.modalAlbumImagePlaceholder}>
                                        <Ionicons name="disc" size={40} color={Colors.white} />
                                    </View>
                                )}
                                <Text style={styles.modalAlbumName}>{selectedAlbum?.name}</Text>
                                <Text style={styles.modalAlbumArtist}>{selectedAlbum?.artist}</Text>
                                {!loading && (
                                    <Text style={styles.modalSongsCount}>
                                        {songs.length} {songs.length === 1 ? 'canción guardada' : 'canciones guardadas'}
                                    </Text>
                                )}
                            </>
                        )}
                    </View>
                </LinearGradient>

                <View style={styles.songsListContainer}>
                    <Text style={styles.songsListTitle}>
                        {modalType === 'artist' ? 'Todas las canciones' : 'Canciones del álbum'}
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.loadingText}>Cargando canciones...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={50} color={Colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : songs.length > 0 ? (
                        <>
                            <FlatList
                                data={songs}
                                renderItem={renderSongItem}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.songsList}
                            />
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>
                                    * Si el número de canciones no coincide con lo indicado anteriormente, es porque algunas pueden estar guardadas varias veces en diferentes playlists.
                                </Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.noSongsContainer}>
                            <Ionicons name="musical-notes-outline" size={50} color={Colors.grayText} />
                            <Text style={styles.noSongsText}>
                                {modalType === 'artist'
                                    ? 'No se encontraron canciones guardadas de este artista'
                                    : 'No se encontraron canciones guardadas de este álbum'}
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    modalHeader: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10,
        padding: 5,
    },
    artistInfoContainer: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
    },
    modalArtistImage: {
        width: 200,
        height: 200,
        borderRadius: 125,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    modalArtistImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.darkGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    modalAlbumImage: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    modalAlbumImagePlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 10,
        backgroundColor: Colors.darkGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    modalArtistName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 5,
        textAlign: 'center',
    },
    modalAlbumName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 5,
        textAlign: 'center',
    },
    modalAlbumArtist: {
        fontSize: 18,
        color: Colors.white,
        marginBottom: 0,
        textAlign: 'center',
    },
    modalSongsCount: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
    songsListContainer: {
        flex: 1,
        backgroundColor: Colors.grayBg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 15,
    },
    songsListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    songsList: {
        paddingBottom: 20,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    songIndex: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.grayText,
    },
    songImageContainer: {
        position: 'relative',
        marginRight: 12,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    songImage: {
        width: 60,
        height: 60,
        backgroundColor: Colors.white,
    },
    playingImage: {
        borderWidth: 2,
        borderColor: Colors.orange,
        opacity: 0.8,
        borderRadius: 10,
    },
    songImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 5,
        backgroundColor: Colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',

    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 4,
    },
    songAlbum: {
        fontSize: 14,
        color: Colors.grayText,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.white,
        marginTop: 15,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    errorText: {
        fontSize: 16,
        color: Colors.error,
        marginTop: 15,
        textAlign: 'center',
    },
    noSongsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noSongsText: {
        fontSize: 16,
        color: Colors.grayText,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 30,
    },
    infoContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    infoText: {
        fontSize: 12,
        color: Colors.grayText,
        fontStyle: 'italic',
        textAlign: 'center',
    }
});

export default SongModal;