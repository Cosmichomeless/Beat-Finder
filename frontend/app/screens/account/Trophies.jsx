import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "../../../components/LoadingScreen";
import TrophyHeader from "../../../components/trophies/TrophyHeader";
import TabSelector from "../../../components/trophies/TabSelector";
import FilterSelector from "../../../components/trophies/FilterSelector";
import CompletedToggle from "../../../components/trophies/CompletedToggle";
import TrophyItem from "../../../components/trophies/TrophyItem";
import EmptyTrophiesView from "../../../components/trophies/EmptyTrophiesView";
import ErrorView from "../../../components/trophies/ErrorView";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Localhost } from "../../../constants/localhost";

const ACHIEVEMENT_ICONS = {
    "swipes": "finger-print",
    "playlists_created": "albums",
    "songs_added": "musical-notes",
    "genres_discovered": "compass",
    "playlists_shared": "share-social",
    "artists_listened": "people"
};

export default function Trophies() {
    const [activeTab, setActiveTab] = useState("permanent"); 
    const [activeFilter, setActiveFilter] = useState("all");
    const [trophies, setTrophies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [permanentTrophies, setPermanentTrophies] = useState([]);
    const [dailyTrophies, setDailyTrophies] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [hideCompleted, setHideCompleted] = useState(true); //Se ocultan los logros completados por defecto

    // Se obtiene el usuario
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem("userEmail");

                if (user) {
                    setUsername(user);
                } else {
                    setError("No se encontró el nombre de usuario");
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
        if (username) {
            fetchUserAchievements();
        }
    }, [username]);

    //Se aplican los filtros
    useEffect(() => {
        filterTrophies();
    }, [activeTab, activeFilter, permanentTrophies, dailyTrophies, hideCompleted]);

    const fetchUserAchievements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://${Localhost}:8080/api/achievements/user/${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // En caso de que no se encuentre logros se inicializan 
            if (response.data.length === 0) {
                console.log("No se encontraron logros para el usuario, inicializando...");
                await initializeUserAchievements();
                return fetchUserAchievements();
            }

            const allTrophies = response.data.map(userAchievement => ({
                id: userAchievement.id.toString(),
                name: userAchievement.achievement.name,
                description: userAchievement.achievement.description,
                icon: ACHIEVEMENT_ICONS[userAchievement.achievement.metricType] || "trophy",
                progress: userAchievement.currentProgress || 0,
                target: userAchievement.achievement.requiredValue,
                unlocked: userAchievement.unlocked,
                unlockedDate: userAchievement.unlocked ?
                    new Date(userAchievement.unlockedAt).toLocaleDateString() : null,
                category: userAchievement.achievement.category,
                metricType: userAchievement.achievement.metricType
            }));

            // Separar por categorías
            const permanent = allTrophies.filter(trophy =>
                trophy.category !== "DAILY"
            );

            const daily = allTrophies.filter(trophy =>
                trophy.category === "DAILY"
            );

            setPermanentTrophies(permanent);
            setDailyTrophies(daily);
            filterTrophies();
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener logros:", error);
            setError("Error al cargar los logros");
            setLoading(false);
        }
    };

    //Para inicializar los logros para un usuario 
    const initializeUserAchievements = async () => {
        try {
            await axios.post(
                `http://${Localhost}:8080/api/achievements/initialize/${username}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Logros inicializados correctamente para:", username);
            return true;
        } catch (error) {
            console.error("Error al inicializar logros:", error);
            setError("Error al inicializar los logros");
            setLoading(false);
            return false;
        }
    };

    const filterTrophies = () => {
        let filteredTrophies = activeTab === "permanent" ? permanentTrophies : dailyTrophies;

        // Filtrar por tipo
        if (activeFilter !== "all") {
            if (activeFilter === "swipes") {
                filteredTrophies = filteredTrophies.filter(trophy =>
                    trophy.metricType === "swipes" || trophy.metricType === "songs_added"
                );
            } else {
                filteredTrophies = filteredTrophies.filter(trophy => trophy.metricType === activeFilter);
            }
        }

  //Filtro para mostrar los logros
        if (hideCompleted) {
            filteredTrophies = filteredTrophies.filter(trophy => !trophy.unlocked);
        } else {
            filteredTrophies = filteredTrophies.filter(trophy => trophy.unlocked);
        }

        setTrophies(filteredTrophies);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorView error={error} onRetry={fetchUserAchievements} />;
    }

    return (
        <LinearGradient
            colors={["#000000", "#1a1a1a"]}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <StatusBar style="light" />

            <TrophyHeader
                permanentCount={permanentTrophies.filter(t => t.unlocked).length}
                permanentTotal={permanentTrophies.length}
                dailyCount={dailyTrophies.filter(t => t.unlocked).length}
                dailyTotal={dailyTrophies.length}
            />

            <TabSelector
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <FilterSelector
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <CompletedToggle
                hideCompleted={hideCompleted}
                onToggle={() => setHideCompleted(!hideCompleted)}
            />

            <FlatList
                data={trophies}
                renderItem={({ item }) => <TrophyItem trophy={item} activeTab={activeTab} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.trophyList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyTrophiesView hideCompleted={hideCompleted} />
                }
                refreshing={loading}
                onRefresh={fetchUserAchievements}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    trophyList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});
