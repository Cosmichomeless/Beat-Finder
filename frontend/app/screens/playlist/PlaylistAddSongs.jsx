import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { Audio } from 'expo-av';
import { fetchAccessToken } from '../../../actions/recommendations';
import { Localhost } from '../../../constants/localhost';

export default function PlaylistAddSongs() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [addingTrack, setAddingTrack] = useState(false);
    const [addingTrackId, setAddingTrackId] = useState(null);
    const [sound, setSound] = useState(null);
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playlistId = params.playlistId;
    const playlistName = params.playlistName || "playlist";
    const parsedTracks = params.tracks ? JSON.parse(params.tracks) : [];

    // Obtener el token de acceso al iniciar
    useEffect(() => {
        async function getToken() {
            const token = await fetchAccessToken();
            setAccessToken(token);
        }
        getToken();
    }, []);

    // Identificar y eliminar duplicados
    const tracksMap = new Map();
    const uniqueTracks = parsedTracks.filter(item => {
        if (!item || !item.id) return false;
        if (tracksMap.has(item.id)) return false;
        tracksMap.set(item.id, true);
        return true;
    });

    // Función para mezclar cualquier array 
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Crear un conjunto de claves normalizadas de canciones existentes
    const createExistingTracksSet = () => {
        const existingTracksSet = new Set();

        // Conjunto para IDs exactos
        const existingTrackIds = new Set();

        // Conjunto para pares artista-título normalizados
        const existingTrackPairs = new Set();

        uniqueTracks.forEach(track => {
            // Guardar el ID exacto
            if (track.id) {
                existingTrackIds.add(track.id);
            }

            // También normalizar los nombres para comparaciones más flexibles
            if (track.name) {
                const normalizedTitle = track.name.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
                    .replace(/[^\w\s]/g, "") // Eliminar caracteres especiales
                    .trim();

                // Para cada artista, crear una clave única
                if (track.artists && track.artists.length > 0) {
                    track.artists.forEach(artist => {
                        if (typeof artist === 'string') {
                            // Si es una cadena directamente
                            const normalizedArtist = artist.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^\w\s]/g, "")
                                .trim();

                            const trackKey = `${normalizedArtist}:${normalizedTitle}`;
                            existingTrackPairs.add(trackKey);
                        } else if (artist.name) {
                            // Si es un objeto con propiedad name
                            const normalizedArtist = artist.name.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^\w\s]/g, "")
                                .trim();

                            const trackKey = `${normalizedArtist}:${normalizedTitle}`;
                            existingTrackPairs.add(trackKey);
                        }
                    });
                }
            }
        });

        console.log(`Filtro: ${existingTrackIds.size} IDs y ${existingTrackPairs.size} pares artista-título únicos`);

        return {
            existingTrackIds,
            existingTrackPairs
        };
    };

    // Función para extraer los artistas principales
    const getMainArtistsFromTracks = () => {
        const artistsMap = new Map();
        uniqueTracks.forEach(track => {
            if (track.artists && Array.isArray(track.artists) && track.artists.length > 0) {
                // Tomar solo el primer artista de cada canción
                const mainArtist = track.artists[0];

                if (!artistsMap.has(mainArtist)) {
                    artistsMap.set(mainArtist, {
                        artistName: mainArtist,
                        songTitle: track.name || "",
                        trackReference: track
                    });
                }
            }
        });
        return Array.from(artistsMap.values());
    };

    // Seleccionar artistas aleatorios
    const selectRandomArtists = (artists, count = 5) => {
        if (artists.length <= count) return artists;
        const shuffled = shuffleArray(artists);
        return shuffled.slice(0, count);
    };

    // Funciones para reproducción de audio
    const playSound = async (previewUrl, trackId) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setCurrentPlayingId(trackId);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate(status => {
                if (status.didJustFinish) {
                    setCurrentPlayingId(null);
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.error('Error reproduciendo audio:', error);
            Alert.alert('Error', 'No se pudo reproducir esta canción');
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const stopSound = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            setCurrentPlayingId(null);
            setIsPlaying(false);
        }
    };

    const togglePlayback = (previewUrl, trackId) => {
        if (currentPlayingId === trackId && isPlaying) {
            pauseSound();
        } else if (currentPlayingId === trackId && !isPlaying && sound) {
            sound.playAsync();
            setIsPlaying(true);
        } else {
            playSound(previewUrl, trackId);
        }
    };

    // Función para buscar artistas relacionados en Deezer
    const fetchRelatedArtists = async (artistId, artistName, limit = 2) => {
        try {
            const response = await axios.get(`https://api.deezer.com/artist/${artistId}/related`);

            if (!response.data.data || response.data.data.length === 0) {
                return [];
            }

            const relatedData = response.data.data.slice(0, limit).map(artist => ({
                id: artist.id,
                name: artist.name,
                relatedTo: artistName
            }));

            console.log(`Se encontraron ${relatedData.length} artistas relacionados con ${artistName}`);
            return relatedData;
        } catch (error) {
            console.error(`Error buscando artistas relacionados con ${artistName}:`, error);
            return [];
        }
    };

    // Función para buscar canciones de un artista relacionado
    const fetchRelatedArtistTracks = async (relatedArtist, limit = 5) => {
        try {
            const response = await axios.get(
                `https://api.deezer.com/artist/${relatedArtist.id}/top?limit=${limit}`
            );

            const tracks = response.data.data || [];
            console.log(`Encontradas ${tracks.length} canciones de ${relatedArtist.name} (relacionado con ${relatedArtist.relatedTo})`);

            return tracks.map(track => ({
                ...track,
                recommendedFrom: `${relatedArtist.name} (relacionado con ${relatedArtist.relatedTo})`
            }));
        } catch (error) {
            console.error(`Error buscando canciones para artista relacionado ${relatedArtist.name}:`, error);
            return [];
        }
    };

    // Función para buscar canciones de un artista principal
    const fetchTopTracksByArtist = async (artistData) => {
        try {
            const { artistName, songTitle } = artistData;
            console.log(`Buscando canciones para ${artistName}`);

            // Buscar artista en Deezer
            const encodedArtistName = encodeURIComponent(artistName);
            const artistResponse = await axios.get(
                `https://api.deezer.com/search/artist?q=${encodedArtistName}&limit=3`
            );

            if (!artistResponse.data.data || artistResponse.data.data.length === 0) {
                console.log(`No se encontró el artista: ${artistName}`);
                return { tracks: [], relatedArtists: [] };
            }

            let bestArtist = null;
            for (const artist of artistResponse.data.data) {
                if (artist.name.toLowerCase() === artistName.toLowerCase()) {
                    bestArtist = artist;
                    console.log(`Coincidencia exacta: ${artist.name}`);
                    break;
                }
                if (!bestArtist) {
                    bestArtist = artist;
                }
            }

            if (!bestArtist) {
                return { tracks: [], relatedArtists: [] };
            }

            console.log(`Artista seleccionado: ${bestArtist.name} (ID: ${bestArtist.id})`);

            // Obtener canciones del artista principal
            const topTracksResponse = await axios.get(
                `https://api.deezer.com/artist/${bestArtist.id}/top?limit=5`
            );

            const tracks = topTracksResponse.data.data || [];
            console.log(`Encontradas ${tracks.length} canciones para ${artistName}`);

            // Obtener artistas relacionados
            const relatedArtists = await fetchRelatedArtists(bestArtist.id, bestArtist.name);

            return {
                tracks: tracks.map(track => ({
                    ...track,
                    recommendedFrom: artistName
                })),
                relatedArtists
            };
        } catch (error) {
            console.error(`Error con ${artistData.artistName}:`, error);
            return { tracks: [], relatedArtists: [] };
        }
    };

    // Función para buscar una canción en Spotify
    const searchTrackOnSpotify = async (title, artist) => {
        if (!accessToken) {
            console.error('No hay token de acceso disponible');
            return null;
        }

        try {
            const query = encodeURIComponent(`track:${title} artist:${artist}`);
            const response = await axios.get(
                `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (response.data.tracks.items.length > 0) {
                return response.data.tracks.items[0].id;
            } else {
                console.log(`No se encontró la canción "${title}" de ${artist} en Spotify`);

                // Intentar una búsqueda menos restrictiva
                const broadQuery = encodeURIComponent(`${title} ${artist}`);
                const broadResponse = await axios.get(
                    `https://api.spotify.com/v1/search?q=${broadQuery}&type=track&limit=1`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );

                if (broadResponse.data.tracks.items.length > 0) {
                    return broadResponse.data.tracks.items[0].id;
                }

                return null;
            }
        } catch (error) {
            console.error('Error buscando en Spotify:', error);
            return null;
        }
    };

    // Función para añadir una canción a la playlist de Spotify
    const addTrackToPlaylist = async (track) => {
        if (!accessToken || !playlistId) {
            Alert.alert('Error', 'No se puede añadir la canción debido a problemas de autenticación');
            return false;
        }

        try {
            setAddingTrack(true);

            // Buscar la canción en Spotify
            const title = track.title;
            const artist = track.artist.name;

            console.log(`Buscando "${title}" de ${artist} en Spotify...`);
            const spotifyTrackId = await searchTrackOnSpotify(title, artist);

            if (!spotifyTrackId) {
                Alert.alert('No encontrada', 'No se pudo encontrar esta canción en Spotify');
                setAddingTrack(false);
                return false;
            }

            const response = await axios.post(
                `http://${Localhost}:8080/api/spotify/playlists/${playlistId}/tracks`,
                {
                    uris: [`spotify:track:${spotifyTrackId}`]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Canción añadida con éxito', response.data);

            removeTrackFromRecommendations(track);

          
            // Detener cualquier reproducción de audio en curso
            await stopSound();
            setAddingTrack(false);
            return true;
        } catch (error) {
            console.error('Error añadiendo canción a la playlist:', error);

            if (error.response && error.response.status === 401) {
                Alert.alert('Sesión expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else {
                Alert.alert('Error', 'No se pudo añadir la canción a la playlist');
            }

            setAddingTrack(false);
            return false;
        }
    };

    // Nueva función para eliminar la canción de las recomendaciones
    const removeTrackFromRecommendations = (trackToRemove) => {
        // Normalizar título y artista
        const normalizedTitle = trackToRemove.title?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, "")
            .trim() || "";

        const normalizedArtist = trackToRemove.artist?.name?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, "")
            .trim() || "";

        // Actualizar el estado de recomendaciones
        setRecommendations(prevRecommendations =>
            prevRecommendations.filter(rec => {
                // Eliminar por ID exacto
                if (rec.id === trackToRemove.id) {
                    return false;
                }

                // También verificar si es la misma canción pero con ID diferente
                const recNormalizedTitle = rec.title?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w\s]/g, "")
                    .trim() || "";

                const recNormalizedArtist = rec.artist?.name?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w\s]/g, "")
                    .trim() || "";

                //Si el titulo y el artista conciden con otra cancion no se añade
                if (recNormalizedTitle === normalizedTitle &&
                    recNormalizedArtist === normalizedArtist) {
                    return false;
                }
                return true;
            })
        );
    };
    // Función principal para buscar recomendaciones
    const fetchRecommendations = async () => {
        await stopSound();

        setIsLoading(true);
        try {
            // Obtener artistas principales
            const mainArtists = getMainArtistsFromTracks();

            if (mainArtists.length === 0) {
                console.log('No se encontraron artistas en la playlist');
                Alert.alert('Error', 'No se encontraron artistas en la playlist');
                setIsLoading(false);
                return;
            }

            // Seleccionar artistas aleatorios
            const randomArtists = selectRandomArtists(mainArtists, 5);
            setSelectedArtists(randomArtists.map(a => a.artistName));

            // Preparar para filtrar canciones duplicadas 
            const { existingTrackIds, existingTrackPairs } = createExistingTracksSet();
            let allRecommendations = [];
            let allRelatedArtists = [];

            const filterTrack = (track) => {

                if (existingTrackIds.has(track.id)) {
                    return false;
                }

                // Normalizar título y artista para comparar
                const normalizedTitle = track.title.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w\s]/g, "")
                    .trim();

                const normalizedArtist = track.artist.name.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w\s]/g, "")
                    .trim();

                // Crear la clave combinada
                const trackKey = `${normalizedArtist}:${normalizedTitle}`;

                // Si la combinación existe se excluye
                return !existingTrackPairs.has(trackKey);
            };

            // Obtener canciones de artistas principales y sus relacionados
            for (const artistData of randomArtists) {
                // Buscar canciones del artista principal y sus artistas relacionados
                const { tracks, relatedArtists } = await fetchTopTracksByArtist(artistData);

                // Filtrar canciones que ya existen 
                const filteredTracks = tracks.filter(filterTrack);

                // Añadir artistas relacionados a la lista
                allRelatedArtists = [...allRelatedArtists, ...relatedArtists];

                // Añadir canciones del artista principal
                allRecommendations = [...allRecommendations, ...filteredTracks];
            }

            // Actualizar lista de artistas relacionados para mostrar
            setRelatedArtists(allRelatedArtists);

            // Buscar canciones de artistas relacionados
            for (const relatedArtist of allRelatedArtists) {
                const relatedTracks = await fetchRelatedArtistTracks(relatedArtist);

                // Filtrar canciones 
                const filteredRelatedTracks = relatedTracks.filter(filterTrack);

                allRecommendations = [...allRecommendations, ...filteredRelatedTracks];
            }

            // Eliminar duplicados por ID
            const uniqueRecommendations = Array.from(
                new Map(allRecommendations.map(item => [item.id, item])).values()
            );

            // Mezclar para variar los resultados
            const shuffledRecommendations = shuffleArray(uniqueRecommendations);
            console.log(`Total: ${shuffledRecommendations.length} recomendaciones después de filtrar`);

            if (shuffledRecommendations.length === 0) {
                Alert.alert('Información', 'No se encontraron nuevas recomendaciones');
            }

            setRecommendations(shuffledRecommendations);
        } catch (error) {
            console.error('Error obteniendo recomendaciones:', error);
            Alert.alert('Error', 'No se pudieron cargar las recomendaciones');
        } finally {
            setIsLoading(false);
        }
    };
    // Cargar recomendaciones al iniciar
    useEffect(() => {
        fetchRecommendations();

        // Limpiar el audio al desmontar
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Renderizar elemento de canción recomendada
    const renderRecommendationItem = ({ item }) => {
        if (!item) return null;

        const isCurrentlyPlaying = currentPlayingId === item.id && isPlaying;
        const hasPreview = item.preview && item.preview.length > 0;

        const isAddingThisTrack = addingTrack && addingTrackId === item.id;

        return (
            <View style={styles.trackItem}>
                <TouchableOpacity
                    onPress={() => hasPreview ? togglePlayback(item.preview, item.id) : Alert.alert('Info', 'No hay preview disponible para esta canción')}
                    disabled={!hasPreview || isAddingThisTrack}
                    style={styles.playButtonContainer}
                >
                    <Image
                        source={{ uri: item.album?.cover_medium || item.album?.cover || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2" }}
                        style={[
                            styles.trackImage,
                            isCurrentlyPlaying ? styles.playingTrackImage : null,
                            isAddingThisTrack ? styles.addingTrackImage : null
                        ]}
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
                        {item.title || "Canción sin título"}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {item.artist?.name || "Artista desconocido"}
                    </Text>
                    {item.recommendedFrom && (
                        <Text style={styles.recommendationSource} numberOfLines={1}>
                            {item.recommendedFrom.includes('relacionado')
                                ? item.recommendedFrom
                                : `Recomendado por ${item.recommendedFrom}`}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={async () => {
                        if (addingTrack) {
                            Alert.alert('Espera', 'Ya se está añadiendo una canción');
                            return;
                        }

                        // Guarda el ID de la canción
                        setAddingTrackId(item.id);

                        // Añadir canción
                        await addTrackToPlaylist(item);

                        // Limpiar el ID
                        setAddingTrackId(null);
                    }}
                    disabled={addingTrack}
                >
                    {isAddingThisTrack ? (
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
        );
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' />


            <View style={styles.recommendationsHeader}>
                <Text style={styles.recommendationsTitle}>
                    Recomendaciones
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isPlaying && (
                        <TouchableOpacity
                            style={[styles.controlButton, { marginRight: 10 }]}
                            onPress={stopSound}
                        >
                            <Ionicons name="stop-circle" size={22} color={Colors.orange} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchRecommendations}
                        disabled={isLoading}
                    >
                        <Ionicons name="refresh" size={20} color={Colors.orange} />
                    </TouchableOpacity>
                </View>
            </View>

            {selectedArtists.length > 0 && (
                <View style={styles.artistsContainer}>
                    <Text style={styles.artistsLabel}>Artistas seleccionados:</Text>
                    <Text style={styles.artistsList}>{selectedArtists.join(', ')}</Text>
                </View>
            )}

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.orange} />
                    <Text style={styles.loadingText}>Buscando recomendaciones...</Text>
                </View>
            ) : (
                <FlatList
                    data={recommendations}
                    keyExtractor={item => `deezer-${item.id}`}
                    renderItem={renderRecommendationItem}
                    contentContainerStyle={styles.tracksList}
                    ListEmptyComponent={() => (
                        <Text style={styles.noTracksText}>
                            No se encontraron recomendaciones nuevas
                        </Text>
                    )}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    playButtonContainer: {
        position: 'relative',
    },
    trackImage: {
        width: 60,
        height: 60,
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
    controlButton: {
        padding: 6,
    },

    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
    },
    tracksList: {
        paddingBottom: 20,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
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
    addButton: {
        padding: 8,
    },
    noTracksText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },
    recommendationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    recommendationSource: {
        fontSize: 12,
        color: '#8c8c8c', 
        marginTop: 2,
        fontStyle: 'italic',
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    refreshButton: {
        padding: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    artistsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    artistsLabel: {
        fontSize: 12,
        color: '#aaa',
        marginBottom: 2,
    },
    artistsList: {
        fontSize: 14,
        color: Colors.orange,
        fontStyle: 'italic',
    },
});