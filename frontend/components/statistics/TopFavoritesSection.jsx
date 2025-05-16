import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Localhost } from '../../constants/localhost';
import { Audio } from 'expo-av';
import { getDeezerPreview } from '../../actions/accountItems';
import SongModal from './SongModal';
// Importar AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get('window').width;

//Seccion de favoritos de statistics
const TopFavoritesSection = ({ statistics, onPress }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [artistSongs, setArtistSongs] = useState([]);
    const [albumSongs, setAlbumSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(""); // Cambiado de username a userEmail para mantener coherencia
    const [modalType, setModalType] = useState('artist'); // 'artist' o 'album'
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loadingTrack, setLoadingTrack] = useState({});
    const topArtist = statistics?.top_artist;
    const topAlbum = statistics?.top_album;
    const topArtists = statistics?.top_artists || [];
    const topAlbums = statistics?.top_albums || [];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const email = await AsyncStorage.getItem("userEmail");

                if (email) {
                    setUserEmail(email);
                } else {
                    setError("No se encontró el email del usuario");
                    setLoading(false);
                }
            } catch (error) {
                setError("Error al obtener los datos de sesión");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Si no hay datos no muestra el componente
    if (!topArtist && !topAlbum && topArtists.length === 0 && topAlbums.length === 0) return null;

    const handlePlayPause = async (song) => {
        if (!song) return;

        try {
            if (currentTrack === song.id) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
                return;
            }

            if (sound) {
                await sound.unloadAsync();
            }

            setLoadingTrack({ ...loadingTrack, [song.id]: true });

            let previewUrl = null;

            previewUrl = await getDeezerPreview(song.title, song.artist);

            setLoadingTrack({ ...loadingTrack, [song.id]: false });

            if (!previewUrl) {
                console.log('No preview URL available for this song');
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true },
                (status) => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                    }
                }
            );

            setSound(newSound);
            setIsPlaying(true);
            setCurrentTrack(song.id);

        } catch (error) {
            console.error('Error al reproducir:', error);
            setLoadingTrack({ ...loadingTrack, [song.id]: false });
        }
    };

    const fetchArtistSongs = async (artist) => {
        if (!artist || !artist.name || !userEmail) return;

        setLoading(true);
        setError(null);

        try {
            // Usamos userEmail en lugar de username para mantener coherencia
            const response = await axios.get(`http://${Localhost}:8080/api/history/all/${userEmail}`);

            if (response.data) {
                //Filtra la cancion por artista
                let artistSongs = response.data.filter(song =>
                    song.artist && song.artist.toLowerCase() === artist.name.toLowerCase() &&
                    song.decision === "Yup"
                );

                // Elimina los duplicados
                const uniqueSongsMap = new Map();

                artistSongs.forEach(song => {
                    const key = song.title.toLowerCase() + "-" + song.artist.toLowerCase();

                    if (song.spotifyId && (!uniqueSongsMap.has(key) || !uniqueSongsMap.get(key).spotifyId)) {
                        uniqueSongsMap.set(key, song);
                    }
                    else if (!uniqueSongsMap.has(key)) {
                        uniqueSongsMap.set(key, song);
                    }
                });

                const uniqueSongs = Array.from(uniqueSongsMap.values());

                // Ordena por fecha
                uniqueSongs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                console.log(`Filtradas ${artistSongs.length} canciones, quedaron ${uniqueSongs.length} únicas`);

                setArtistSongs(uniqueSongs);
            } else {
                setArtistSongs([]);
            }
        } catch (error) {
            console.error('No se pudieron cargar las canciones:', error);
            setError('No se pudieron cargar las canciones');
            setArtistSongs([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener canciones por álbum
    const fetchAlbumSongs = async (album) => {
        if (!album || !album.name || !userEmail) return;

        setLoading(true);
        setError(null);

        try {
            // Obtiene todas las canciones del usuario usando userEmail
            const response = await axios.get(`http://${Localhost}:8080/api/history/all/${userEmail}`);

            if (response.data) {
                // Filtra canciones por álbum
                let albumSongs = response.data.filter(song =>
                    song.album && song.album.toLowerCase() === album.name.toLowerCase() &&
                    song.decision === "Yup"
                );

                //Elimina duplicados
                const uniqueSongsMap = new Map();

                albumSongs.forEach(song => {
                    const key = song.title.toLowerCase() + "-" + song.artist.toLowerCase();

                    if (song.spotifyId && (!uniqueSongsMap.has(key) || !uniqueSongsMap.get(key).spotifyId)) {
                        uniqueSongsMap.set(key, song);
                    }
                    else if (!uniqueSongsMap.has(key)) {
                        uniqueSongsMap.set(key, song);
                    }
                });

                const uniqueSongs = Array.from(uniqueSongsMap.values());

                // Ordena por fecha
                uniqueSongs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                console.log(`Filtradas ${albumSongs.length} canciones de álbum, quedaron ${uniqueSongs.length} únicas`);

                setAlbumSongs(uniqueSongs);
            } else {
                setAlbumSongs([]);
            }
        } catch (error) {
            console.error('Error fetching album songs:', error);
            setError('No se pudieron cargar las canciones');
            setAlbumSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleArtistPress = (artist, type) => {
        if (type && onPress) {
            onPress(type, artist);
            return;
        }

        setSelectedArtist(artist);
        setSelectedAlbum(null);
        setArtistSongs([]);
        setModalType('artist');
        setModalVisible(true);

        // Hacer la petición para obtener las canciones usando directamente artist y userEmail
        fetchArtistSongs(artist);
    };

    // Función para abrir la modal con las canciones del álbum
    const handleAlbumPress = (album, type) => {
        // Si se requiere navegación a otra pantalla, usar el callback onPress
        if (type && onPress) {
            onPress(type, album);
            return;
        }

        // De lo contrario, mostrar la modal con las canciones del álbum
        setSelectedAlbum(album);
        setSelectedArtist(null);
        setAlbumSongs([]);
        setModalType('album');
        setModalVisible(true);

        // Usa directamente album y userEmail
        fetchAlbumSongs(album);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setIsPlaying(false);
    };

    const renderArtistItem = ({ item, index }) => {
        if (!item) return null;

        // Dependiendo de la posicion se asigna un color u otro
        let rankBackgroundColor, rankTextColor;
        if (index === 0) {
            // Oro para el primer puesto
            rankBackgroundColor = '#FFD700';
            rankTextColor = '#000000';
        } else if (index === 1) {
            // Plata para el segundo puesto
            rankBackgroundColor = '#C0C0C0';
            rankTextColor = '#000000';
        } else if (index === 2) {
            // Bronce para el tercer puesto
            rankBackgroundColor = '#CD7F32';
            rankTextColor = '#FFFFFF';
        } else {
            // Color normal para el resto
            rankBackgroundColor = Colors.black;
            rankTextColor = Colors.orange;
        }

        return (
            <TouchableOpacity
                style={styles.topItem}
                onPress={() => handleArtistPress(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.topItemRank, { backgroundColor: rankBackgroundColor }]}>
                    <Text style={[styles.topItemRankText, { color: rankTextColor }]}>{index + 1}</Text>
                </View>

                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={[
                            styles.topItemImage,
                            index < 3 && { borderColor: rankBackgroundColor, borderWidth: 2 }
                        ]}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.itemIconContainer}>
                        <Ionicons name="person" size={18} color={Colors.song} />
                    </View>
                )}

                <View style={styles.topItemDetails}>
                    <Text style={styles.topItemName} numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                    <Text style={styles.topItemCount}>
                        {item.song_count || item.count} {(item.song_count || item.count) === 1 ? 'canción' : 'canciones'}
                    </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={Colors.grayText} />
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <SongModal
                visible={modalVisible}
                onClose={handleCloseModal}
                modalType={modalType}
                selectedArtist={selectedArtist}
                selectedAlbum={selectedAlbum}
                songs={modalType === 'artist' ? artistSongs : albumSongs}
                loading={loading}
                error={error}
                handlePlayPause={handlePlayPause}
                isPlaying={isPlaying}
                currentTrack={currentTrack}
                loadingTrack={loadingTrack}
                sound={sound}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                style={styles.header}
            >
                <Text style={styles.sectionTitle}>Tus Favoritos</Text>
            </LinearGradient>

            <View style={styles.cardsContainer}>
                {topArtist && (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleArtistPress(topArtist)}
                        activeOpacity={0.7}
                    >
                        {topArtist.image_url ? (
                            <Image
                                source={{ uri: topArtist.image_url }}
                                style={styles.artistImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.iconContainer}>
                                <Ionicons name="person" size={32} color={Colors.song} />
                            </View>
                        )}
                        <Text style={styles.cardTitle}>Artista Favorito</Text>
                        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
                            {topArtist.name}
                        </Text>
                        <Text style={styles.itemCount}>
                            {topArtist.song_count} {topArtist.song_count === 1 ? 'canción' : 'canciones'}
                        </Text>
                    </TouchableOpacity>
                )}

                {topAlbum && (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleAlbumPress(topAlbum)}
                        activeOpacity={0.7}
                    >
                        {topAlbum.image_url ? (
                            <Image
                                source={{ uri: topAlbum.image_url }}
                                style={styles.albumImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.iconContainer}>
                                <Ionicons name="disc" size={32} color={Colors.playlist} />
                            </View>
                        )}
                        <Text style={styles.cardTitle}>Álbum Favorito</Text>
                        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
                            {topAlbum.name}
                        </Text>
                        <Text style={styles.artistName} numberOfLines={1} ellipsizeMode="tail">
                            {topAlbum.artist}
                        </Text>
                        <Text style={styles.itemCount}>
                            {topAlbum.song_count} {topAlbum.song_count === 1 ? 'canción' : 'canciones'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {topArtists.length > 1 && (
                <View style={styles.topListContainer}>
                    <LinearGradient
                        colors={['rgba(25,25,25,0.8)', 'rgba(25,25,25,0.5)']}
                        style={styles.topListHeader}
                    >
                        <Text style={styles.topListTitle}>Top Artistas</Text>
                    </LinearGradient>
                    <FlatList
                        data={topArtists}
                        renderItem={renderArtistItem}
                        keyExtractor={(item, index) => `artist-${index}`}
                        scrollEnabled={false}
                        style={styles.topList}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: WIDTH * 0.9,
        marginVertical: 15,
        backgroundColor: Colors.grayBg,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: Colors.darkGray,
    },
    card: {
        width: WIDTH * 0.41,
        backgroundColor: Colors.cardBg,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    albumImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: Colors.orange,
        borderWidth: 2,
    },
    artistImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.orange,
    },
    cardTitle: {
        fontSize: 14,
        color: Colors.grayText,
        marginBottom: 5,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
        marginBottom: 2,
        width: '100%',
    },
    artistName: {
        fontSize: 14,
        color: Colors.white,
        textAlign: 'center',
        marginBottom: 5,
        width: '100%',
    },
    itemCount: {
        fontSize: 12,
        color: Colors.white,
        marginTop: 4,
        fontWeight: 'bold',
    },
    topListContainer: {
        marginTop: 5,
        backgroundColor: Colors.darkGray,
    },
    topListHeader: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    topListTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    topList: {
        padding: 15,
    },
    topItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: Colors.cardBg,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    topItemRank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    topItemRankText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topItemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    topItemDetails: {
        flex: 1,
    },
    topItemName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.white,
    },
    topItemCount: {
        fontSize: 12,
        color: Colors.grayText,
        marginTop: 2,
    },
    moreMusicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    moreMusicIcon: {
        marginRight: 8,
    },
    moreMusicText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    }
});

export default TopFavoritesSection;