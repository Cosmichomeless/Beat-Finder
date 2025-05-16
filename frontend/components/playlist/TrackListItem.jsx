import React, { useRef } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const TrackItem = ({ track, isCurrentTrack, isPlaying, loadingAudio, duration, onPlayPause }) => {
    const swipeableRef = useRef(null);

    const renderLeftActions = () => (
        <View style={styles.leftAction}>
            <AntDesign name='pluscircleo' size={60} color='black' />
        </View>
    );

    const renderRightActions = () => (
        <View style={styles.rightAction}>
            <AntDesign name='minuscircleo' size={60} color='black' />
        </View>
    );

    const handleSwipeableLeftOpen = () => {
        console.log("Añadiendo a Beat Finder Playlist");
        // Aquí puedes añadir la lógica para añadir la canción a la playlist
        swipeableRef.current.close();
    };

    const handleSwipeableRightOpen = () => {
        console.log("Eliminando de la playlist");
        // Aquí puedes añadir la lógica para eliminar la canción de la playlist
        swipeableRef.current.close();
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableLeftOpen={handleSwipeableLeftOpen}
            onSwipeableRightOpen={handleSwipeableRightOpen}
            friction={2}
            overshootLeft={false}
            overshootRight={false}
            leftThreshold={100}
            rightThreshold={100}
        >
            <Pressable onPress={() => onPlayPause(track.name, track.artists)}>
                <View style={styles.itemContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: track.album.images[0].url }} style={styles.image} />
                        <View style={styles.playPauseIconContainer}>
                            {loadingAudio ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={24}
                                    color='white'
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{track.name}</Text>
                        <Text style={styles.artist}>{track.artists.map(artist => artist.name).join(', ')}</Text>
                        <Text style={styles.duration}>{duration}</Text>
                    </View>
                </View>
            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: Colors.black,
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.background,
        width: '95%',
        alignSelf: 'center',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 12,
    },
    playPauseIconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 4,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 16,
        color: '#999',
    },
    duration: {
        fontSize: 14,
        color: '#999',
    },
    leftAction: {
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '95%',
        height: '87%',
        paddingLeft: 20,
        borderRadius: 8,
        marginStart: 10,
    },
    rightAction: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '95%',
        height: '87%',
        paddingRight: 20,
        borderRadius: 8,
        marginEnd: 10,
    },
});

export default TrackItem;