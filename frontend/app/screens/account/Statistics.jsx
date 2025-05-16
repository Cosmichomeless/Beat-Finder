import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import StatisticsTabs from '../../../components/statistics/StatisticsTabs';
import ChartSection from '../../../components/statistics/ChartSection';
import DetailsSection from '../../../components/statistics/DetailsSection';
import TopFavoritesSection from '../../../components/statistics/TopFavoritesSection';
import RecentAchievements from '../../../components/statistics/RecentAchievements';
import ProgressSection from '../../../components/statistics/ProgressSection';
import { Colors } from '../../../constants/colors';
import { Localhost } from '../../../constants/localhost';
import {
    prepareBarData,
    preparePieData,
    prepareLineData,
    prepareRadarData,
    prepareCalendarData,
    getIconForMetricType,
    getColorForMetricType,
    getDateLabels
} from '../../../utils/statisticsHelpers';

const WIDTH = Dimensions.get('window').width;

const Statistics = () => {
    const params = useLocalSearchParams();

    // Estado local para manejar las estadísticas
    const [statistics, setStatistics] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [activeChartTab, setActiveChartTab] = useState('bar');
    const [userEmail, setUserEmail] = useState("");

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchStatistics();
        } catch (error) {
            console.error("Error al refrescar las estadísticas:", error);
            setError("Error al actualizar las estadísticas");
        } finally {
            setRefreshing(false);
        }
    }, []);

    // Función para obtener el nombre de usuario del almacenamiento
    const fetchUserFromStorage = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("userEmail");
            if (userEmail) {
                setUserEmail(userEmail);
                return userEmail;
            } else {
                setError("No se encontró el email del usuario");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el email del usuario:", error);
            setError("Error al obtener información del usuario");
            return null;
        }
    };

    // Función para obtener estadísticas del backend
    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!userEmail) {
                setLoading(false);
                return null;
            }

            console.log(`Obteniendo estadísticas para el usuario: ${userEmail}`);
            const response = await axios.get(
                `http://${Localhost}:8080/api/statistics/user/${userEmail}`
            );

            console.log("Estadísticas obtenidas:", response.data);
            setStatistics(response.data);

            await fetchAchievements();

            return response.data;
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            setError("Error al cargar las estadísticas: " + (error.response?.data?.message || error.message));
            return null;
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Función para obtener los logros
    const fetchAchievements = async () => {
        try {
            const response = await axios.get(
                `http://${Localhost}:8080/api/achievements`
            );

            // Se organizan los logros por tipo 
            const achievementsByType = {
                swipes: [],
                songs_added: [],
                playlists_created: [],
                genres_discovered: []
            };

            // Verificamos si los datos son un array antes de procesarlos
            if (Array.isArray(response.data)) {
                response.data.forEach(achievement => {
                    // Se mapean los datos
                    const metricType = achievement.metricType || achievement.metric_type || achievement.type;

                    // Se verifica si es un logro genérico o específico de género
                    const isGenericAchievement = achievement.requiredValue && !isNaN(achievement.requiredValue);

                    if (metricType && achievementsByType[metricType] && isGenericAchievement) {
                        achievementsByType[metricType].push({
                            id: achievement.id,
                            name: achievement.name,
                            description: achievement.description,
                            threshold: achievement.requiredValue,
                            icon: metricType
                        });
                    }
                });

                Object.keys(achievementsByType).forEach(key => {
                    achievementsByType[key].sort((a, b) => a.threshold - b.threshold);
                });

                setAchievements(achievementsByType);
                return achievementsByType;
            } else {
                console.error("La respuesta de logros no es un array");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener logros:", error);
            return null;
        }
    };

    // Se determina el siguiente logro 
    const getNextAchievement = (metricType, currentValue) => {
        if (!achievements || !achievements[metricType] || achievements[metricType].length === 0) {
            return { name: "Cargando...", threshold: 100 };
        }

        const metricAchievements = achievements[metricType];
        const pendingAchievements = metricAchievements.filter(ach => ach.threshold > currentValue);

        if (pendingAchievements.length > 0) {
            pendingAchievements.sort((a, b) => a.threshold - b.threshold);
            return pendingAchievements[0];
        }

        //Si no hay mas logros se especifica que esta completado
        if (metricAchievements.length > 0) {
            const lastAchievement = metricAchievements[metricAchievements.length - 1];
            return {
                ...lastAchievement,
                name: `${lastAchievement.name} (Completado)`
            };
        }
    };

    // Inicializar datos
    useEffect(() => {
        const initializeData = async () => {
            // Se obtiene el usuario 
            const userEmail = await fetchUserFromStorage();

            if (userEmail) {
                await fetchStatistics();
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        if (userEmail) {
            fetchStatistics();
        }
    }, [userEmail]);

    if (error && !statistics) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchStatistics}
                >
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Preparar datos para los gráficos
    const barData = prepareBarData(statistics);
    const maxBarValue = Math.max(...barData.map(item => item.value), 10) * 1.2;
    const total = barData.reduce((acc, item) => acc + item.value, 0);
    const pieData = preparePieData(statistics, total);

    // Preparar datos para la línea de tiempo
    const dateLabels = getDateLabels();
    const lineData = {
        labels: dateLabels,
        datasets: [
            {
                data: dateLabels.map((_, i) => {
                    const total = statistics?.swipes || 10;
                    return Math.round((total / 7) * (i + 1) + Math.random() * 5);
                }),
                color: () => Colors.swipe,
                strokeWidth: 2
            }
        ],
    };

    // Se obtienen los proximos logros
    const nextSwipeAchievement = getNextAchievement('swipes', statistics?.swipes || 0);
    const nextSongAchievement = getNextAchievement('songs_added', statistics?.songs_added || 0);
    const nextPlaylistAchievement = getNextAchievement('playlists_created', statistics?.playlists_created || 0);
    const nextGenreAchievement = getNextAchievement('genres_discovered', statistics?.genres_discovered || 0);

    // Se prepraran datos para el radar
    const maxValues = {
        swipes: nextSwipeAchievement.threshold,
        songs_added: nextSongAchievement.threshold,
        playlists_created: nextPlaylistAchievement.threshold,
        genres_discovered: nextGenreAchievement.threshold
    };

    const radarData = [
        { name: 'Swipes', value: Math.min(1, (statistics?.swipes || 0) / maxValues.swipes), color: Colors.swipe },
        { name: 'Canciones', value: Math.min(1, (statistics?.songs_added || 0) / maxValues.songs_added), color: Colors.song },
        { name: 'Playlists', value: Math.min(1, (statistics?.playlists_created || 0) / maxValues.playlists_created), color: Colors.playlist },
        { name: 'Géneros', value: Math.min(1, (statistics?.genres_discovered || 0) / maxValues.genres_discovered), color: Colors.genre },
    ];

    // Obtener logros recientes
    const recentAchievements = statistics?.recent_achievements?.map(achievement => ({
        name: achievement.name,
        description: achievement.description,
        date: achievement.formatted_date,
        icon: getIconForMetricType(achievement.metric_type),
        color: getColorForMetricType(achievement.metric_type)
    })) || [];

    // Datos de progreso para metas
    const progressData = [
        {
            title: nextSwipeAchievement.name,
            current: statistics?.swipes || 0,
            target: nextSwipeAchievement.threshold,
            color: Colors.swipe
        },
        {
            title: nextSongAchievement.name,
            current: statistics?.songs_added || 0,
            target: nextSongAchievement.threshold,
            color: Colors.song
        },
        {
            title: nextPlaylistAchievement.name,
            current: statistics?.playlists_created || 0,
            target: nextPlaylistAchievement.threshold,
            color: Colors.playlist
        },
        {
            title: nextGenreAchievement.name,
            current: statistics?.genres_discovered || 0,
            target: nextGenreAchievement.threshold,
            color: Colors.genre
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DB954" />
                    <Text style={styles.loadingText}>Cargando estadísticas...</Text>
                </View>
            ) : (
                <>
                    <StatisticsTabs
                        activeChartTab={activeChartTab}
                        setActiveChartTab={setActiveChartTab}
                    />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#1DB954"]}
                                tintColor="#1DB954"
                                title="Actualizando estadísticas..."
                                titleColor={Colors.white}
                            />
                        }
                    >
                        <ChartSection
                            activeChartTab={activeChartTab}
                            barData={barData}
                            maxBarValue={maxBarValue}
                            pieData={pieData}
                            lineData={lineData}
                            radarData={radarData}
                            total={total}
                            statistics={statistics}
                        />

                        <DetailsSection statistics={statistics} />


                        <TopFavoritesSection statistics={statistics} />

                        {recentAchievements.length > 0 && (
                            <RecentAchievements achievements={recentAchievements} />
                        )}

                        <ProgressSection progressData={progressData} />
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.white,
        marginTop: 15,
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: Colors.orange,
        borderRadius: 5,
    },
    retryText: {
        color: Colors.white,
        fontWeight: 'bold',
    }
});

export default Statistics;
