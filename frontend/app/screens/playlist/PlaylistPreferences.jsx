import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colors";
import { TabSelector } from "../../../components/preferences/TabSelector";
import { ErrorText } from "../../../components/preferences/ErrorText";
import { BottomButtons } from "../../../components/preferences/BottomButtons";
import { ArtistsTab } from "../../../components/preferences/ArtistsTab";
import { GenresTab } from "../../../components/preferences/GenresTab";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Localhost } from '../../../constants/localhost';
import { getSpotifyToken } from '../../../actions/playlistActions';

const { width } = Dimensions.get("window");

const PlaylistPreferences = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {
        playlistId,
        playlistName,
        isNewPlaylist,
        imageUploaded,
        isPrivate,
    } = params;
    const scrollViewRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0); // 0 = artistas, 1 = géneros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Mostrar mensaje de éxito si es una playlist recién creada
    useEffect(() => {
        showNewPlaylistAlert();
    }, []);

    // Función para mostrar alerta de nueva playlist
    const showNewPlaylistAlert = () => {
        if (isNewPlaylist === "true") {
            Alert.alert(
                "¡Playlist creada!",
                `Tu nueva playlist "${playlistName}" ha sido creada con éxito${isPrivate === "true" ? " como privada" : ""
                }${imageUploaded === "true" ? " con imagen personalizada" : ""
                }.`
            );
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem("userEmail");

                if (user) {
                    setUsername(user);
                } else {
                    setError("No se encontró el nombre de usuario");
                }
            } catch (error) {
                setError("Error al obtener los datos de sesión");
            }
        };

        fetchUser();
    }, []);

    // Función simplificada para obtener el ID de Deezer
    const getDeezerArtistId = async (artistName) => {
        try {
            const encodedArtistName = encodeURIComponent(artistName);
            console.log(`Buscando artista en Deezer: ${artistName}`);

            const response = await axios.get(
                `https://api.deezer.com/search/artist?q=${encodedArtistName}&limit=10`
            );

            if (!response.data.data || response.data.data.length === 0) {
                console.log(`No se encontraron resultados para: ${artistName}`);
                return null;
            }

            // Buscar coincidencia exacta primero
            const exactMatch = response.data.data.find(
                artist => artist.name.toLowerCase() === artistName.toLowerCase()
            );

            if (exactMatch) {
                console.log(`Coincidencia exacta: ${exactMatch.name} (ID: ${exactMatch.id})`);
                return exactMatch.id;
            }

            // Si no hay coincidencia exacta, usar el primer resultado
            console.log(`Usando primer resultado: ${response.data.data[0].name} (ID: ${response.data.data[0].id})`);
            return response.data.data[0].id;
        } catch (error) {
            console.error("Error al obtener el ID de Deezer:", error);
            return null;
        }
    };

    const handleSavePreferences = async () => {
        if (selectedArtists.length === 0 && selectedGenres.length === 0) {
            Alert.alert(
                "Selecciones vacías",
                "Por favor selecciona al menos un artista o un género musical"
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Obtener IDs de Deezer para artistas seleccionados
            const deezerArtistIds = await Promise.all(
                selectedArtists.map(artist => getDeezerArtistId(artist.name))
            );

            const userPreferencesData = {
                userId: username,  //Usa usuario guardado en la app
                playlistId: playlistId,
                artist1: deezerArtistIds[0] || null,
                artist2: deezerArtistIds[1] || null,
                artist3: deezerArtistIds[2] || null,
                artist4: deezerArtistIds[3] || null,
                artist5: deezerArtistIds[4] || null,
                genre1: selectedGenres[0]?.name || null,
                genre2: selectedGenres[1]?.name || null,
            };

            // Guarda las preferencias
            await axios.post(
                `http://${Localhost}:8080/api/user-preferences/users/${username}/preferences`,
                userPreferencesData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Guarda los generos
            const discoveredGenres = selectedGenres.map(genre => genre.name);
            await axios.post(
                `http://${Localhost}:8080/api/achievements/user/${username}/discover-genres`,
                { genres: discoveredGenres },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            Alert.alert(
                "Preferencias guardadas",
                "Tus preferencias han sido guardadas correctamente.",
                [
                    {
                        text: "Continuar",
                        onPress: () =>
                            router.push({
                                pathname: "./PlaylistRecomendations",
                                params: { playlistId, playlistName },
                            }),
                    },
                ]
            );
        } catch (error) {
            console.error("Error al guardar preferencias:", error);
            setError(
                "No se pudieron guardar las preferencias. Intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Función para buscar artistas
    const searchArtists = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const accessToken = await getSpotifyToken();
            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            const response = await axios.get(
                `http://${Localhost}:8080/api/spotify/search/artists`,
                {
                    params: { q: query, limit: 10 },
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setSearchResults(response.data.artists.items || []);
        } catch (error) {
            console.error("Error al buscar artistas:", error);
            Alert.alert(
                "Error",
                "No se pudieron obtener resultados de búsqueda"
            );
        } finally {
            setSearchLoading(false);
        }
    };

    // Tiempo de espera para realizar la busqueda (Temas visuales)
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (searchQuery) {
                searchArtists(searchQuery);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery]);

    // Manejar selección de artistas
    const toggleArtistSelection = (artist) => {
        setSelectedArtists((prev) => {
            const isSelected = prev.some((a) => a.id === artist.id);
            if (isSelected) {
                return prev.filter((a) => a.id !== artist.id);
            } else {
       
                if (prev.length >= 5) {
                    Alert.alert(
                        "Límite alcanzado",
                        "Puedes seleccionar hasta 5 artistas"
                    );
                    return prev;
                }
                // En caso de que se selecciones un artista se deseleccionan los generos
                setSelectedGenres([]);
                return [...prev, artist];
            }
        });
    };

    const [genres, setGenres] = useState([]);
    const [genresLoading, setGenresLoading] = useState(false);

    // Función para obtener géneros
    const fetchGenres = async () => {
        setGenresLoading(true);
        try {
            const response = await axios.get(
                `http://${Localhost}:8080/api/genres`
            );
            // Verificar la estructura de la respuesta 
            if (Array.isArray(response.data)) {
                setGenres(response.data);
            } else if (response.data.genres) {
                setGenres(response.data.genres);
            } else {
                console.log("Estructura de respuesta:", response.data);
                setGenres([]);
            }
        } catch (error) {
            console.error("Error al obtener géneros:", error);
            Alert.alert("Error", "No se pudieron obtener los géneros");
        } finally {
            setGenresLoading(false);
        }
    };

    // Llamar a fetchGenres cuando el componente se monte
    useEffect(() => {
        fetchGenres();
    }, []);

    // Función para manejar selección de géneros
    const toggleGenreSelection = (genre) => {
        setSelectedGenres((prev) => {
            // Verificar si el género ya está seleccionado usando su id de genero
            const isSelected = prev.some((g) => g.id_genre === genre.id_genre);

            if (isSelected) {
                return prev.filter((g) => g.id_genre !== genre.id_genre);
            } else {
               
                if (prev.length >= 2) {
                    Alert.alert(
                        "Límite alcanzado",
                        "Puedes seleccionar hasta 2 géneros"
                    );
                    return prev;
                }
                // Deseleccionar todos los artistas si se selecciona un género
                setSelectedArtists([]);
                return [...prev, genre];
            }
        });
    };

    // Función para cambiar entre pestañas
    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
        scrollViewRef.current?.scrollTo({
            x: tabIndex * width,
            animated: true,
        });
    };

    // Función para manejar el deslizamiento y actualizar la pestaña activa
    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newActiveTab = Math.round(contentOffsetX / width);
        if (activeTab !== newActiveTab) {
            setActiveTab(newActiveTab);
        }
    };

    // Función para saltar las preferencias
    const handleSkip = () => {
        Alert.alert(
            "¿Quieres omitir este paso?",
            "Puedes configurar estas preferencias más tarde desde los ajustes de la playlist.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Omitir",
                    onPress: () => router.push("../main/playlist"),
                },
            ]
        );
    };

    return (
        <LinearGradient
            colors={["#000000", "#1a1a1a"]}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                style={styles.tabsContent}
            >

                <ArtistsTab
                    playlistName={playlistName}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    searchLoading={searchLoading}
                    selectedArtists={selectedArtists}
                    toggleArtistSelection={toggleArtistSelection}
                    width={width}
                />

                <GenresTab
                    playlistName={playlistName}
                    genres={genres}
                    loading={genresLoading}
                    selectedGenres={selectedGenres}
                    toggleGenreSelection={toggleGenreSelection}
                    width={width}
                />
            </ScrollView>

            <ErrorText error={error} />

            <BottomButtons
                onSave={handleSavePreferences}
                onSkip={handleSkip}
                loading={loading}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabsContent: {
        flex: 1,
    }
});

export default PlaylistPreferences;