import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Platform, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../../constants/colors";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from 'expo-linking';
import axios from "axios";
import { router } from "expo-router";
import { Localhost } from "../../../constants/localhost";
import { changeUsername } from "../../../actions/apiLogin";
import ProfileHeader from "../../../components/settings/ProfileHeader";
import SettingsSection from "../../../components/settings/SettingsSection";
import VersionInfo from "../../../components/settings/VersionInfo";
import UsernameChangeModal from "../../../components/settings/UsernameChangeModal";
import { fetchAccessToken } from "../../../actions/recommendations";
import { getUserProfile } from "../../../actions/userItems";

export default function Settings() {

    const [newUsername, setNewUsername] = useState("");
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        swipes: 0,
        songs_added: 0,
        playlists_created: 0,
        genres_discovered: 0
    });
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState(null);

    //Se recuperan los datos del usuario 
    const useUserData = () => {
        const [username, setUsername] = useState("");
        const [userEmail, setUserEmail] = useState("");
        const [accessToken, setAccessToken] = useState("");
        const [refreshToken, setRefreshToken] = useState("");
        const [profileImage, setProfileImage] = useState(null);
        const [allStoredData, setAllStoredData] = useState({});

        useEffect(() => {
            const getUserData = async () => {
                try {
                    // Recuperar todos los datos almacenados del usuario 
                    const storedUsername = await AsyncStorage.getItem("user");
                    const email = await AsyncStorage.getItem("userEmail");
                    const token = await AsyncStorage.getItem("accessToken");
                    const refresh = await AsyncStorage.getItem("refreshToken");

                    // Obtener cualquier otro dato almacenado
                    const allKeys = await AsyncStorage.getAllKeys();
                    const allData = {};

                    for (const key of allKeys) {
                        allData[key] = await AsyncStorage.getItem(key);
                    }

                    console.log("Todos los datos almacenados:", allData);
                    setAllStoredData(allData);

                    // Se actualizan los estados con los datos recuperados
                    if (storedUsername) setUsername(storedUsername);
                    if (email) setUserEmail(email);
                    if (token) setAccessToken(token);
                    if (refresh) setRefreshToken(refresh);

                    // Obtener imagen de perfil de Spotify
                    const spotifyToken = await fetchAccessToken();
                    if (spotifyToken) {
                        const profileData = await getUserProfile(spotifyToken);
                        if (profileData && profileData.images && profileData.images.length > 0) {
                            setProfileImage(profileData.images[0].url);
                        }
                    }

                } catch (error) {
                    console.error("Error al obtener datos de usuario:", error);
                }
            };

            getUserData();
        }, []);

        return {
            username,
            setUsername,
            userEmail,
            accessToken,
            refreshToken,
            profileImage,
            allStoredData
        };
    };

    const {
        username, setUsername,
        userEmail,
        profileImage,
        accessToken
    } = useUserData();

    // Se obtienen las estadisticas
    const fetchStatistics = async () => {
        try {
            setStatsLoading(true);
            setStatsError(null);

            // Obtener el email del usuario
            const email = await AsyncStorage.getItem("userEmail");

            if (!email) {
                setStatsError("No se encontró el email del usuario");
                setStatsLoading(false);
                return;
            }

            const response = await axios.get(
                `http://${Localhost}:8080/api/statistics/user/${email}`
            );

            // Se actualizan las estadísticas con los datos del back
            setStatistics(response.data);
            return response.data;
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            setStatsError("Error al cargar las estadísticas");
        } finally {
            setStatsLoading(false);
        }
    };

    // Función para cambiar nombre de usuario
    const handleChangeUsername = async () => {
        if (newUsername.trim() === "") {
            Alert.alert("Error", "El nombre de usuario no puede estar vacío");
            return;
        }

        if (newUsername === username) {
            Alert.alert("Error", "El nuevo nombre de usuario es igual al actual");
            return;
        }

        try {
            setLoading(true);

            // Verificar si el nombre de usuario ya existe en el back
            const checkResponse = await axios.get(
                `http://${Localhost}:8080/api/users/check-username/${newUsername}`,
            );

            if (checkResponse.data === true) {
                Alert.alert("Error", "Este nombre de usuario ya está en uso");
                setLoading(false);
                return;
            }

            await changeUsername(username, newUsername);

            // Actualizar AsyncStorage con el nuevo nombre de usuario
            await AsyncStorage.setItem("user", newUsername);
            setUsername(newUsername);

            Alert.alert("Éxito", "Nombre de usuario actualizado correctamente");
            setShowUsernameModal(false);
        } catch (error) {
            console.error("Error al cambiar nombre de usuario:", error);
            Alert.alert("Error", "No se pudo cambiar el nombre de usuario");
        } finally {
            setLoading(false);
        }
    };

    const handleReport = () => {
        const subject = "Reporte de problema en Beat Finder";
        const body = `
            Versión de la app: 1.0
            Sistema operativo: ${Platform.OS} ${Platform.Version}
            
            Detalles del problema:
            
            
            `;
        const url = `mailto:beatfinder@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "No se puede abrir la aplicación de correo");
            }
        });
    };

    // Función para cerrar sesión
    const handleLogout = async () => {
        try {
            // Limpiar AsyncStorage (todos los datos almacenados del usuario)
            await AsyncStorage.clear();

            // Navega al index inicial de la app
            router.replace("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", "No se pudo cerrar sesión");
        }
    };

    return (
        <LinearGradient
            colors={["#000000", "#1a1a1a"]}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <StatusBar style="light" />

            <ProfileHeader
                profileImage={profileImage}
                username={username}
                userEmail={userEmail}
            />

            <SettingsSection
                title="Cuenta"
                options={[
                    {
                        icon: "person",
                        iconColor: Colors.white,
                        text: "Cambiar nombre de usuario",
                        onPress: () => setShowUsernameModal(true)
                    }, {
                        icon: "log-out",
                        iconColor: "#ff6b6b",
                        text: "Cerrar sesión",
                        textStyle: styles.logoutText,
                        onPress: handleLogout
                    }

                ]}
            />

            <SettingsSection
                title="Soporte"
                options={[
                    {
                        icon: "alert-circle",
                        iconColor: Colors.white,
                        text: "Reportar problema",
                        onPress: handleReport
                    },
                    {
                        icon: "help-circle",
                        iconColor: Colors.white,
                        text: "Preguntas frecuentes",
                        onPress: () => router.push("/htmlview?page=faq")
                    }
                ]}
            />

            <SettingsSection
                title="Acerca de"
                options={[
                    {
                        icon: "document-text",
                        iconColor: Colors.white,
                        text: "Términos y condiciones",
                        onPress: () => router.push("/htmlview?page=terms")
                    },
                    {
                        icon: "shield",
                        iconColor: Colors.white,
                        text: "Política de privacidad",
                        onPress: () => router.push("/htmlview?page=privacy")
                    }
                ]}
            />

            <VersionInfo />

            <UsernameChangeModal
                visible={showUsernameModal}
                currentUsername={username}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                onCancel={() => {
                    setShowUsernameModal(false);
                    setNewUsername("");
                }}
                onConfirm={handleChangeUsername}
                loading={loading}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    logoutText: {
        color: '#ff6b6b',
    }
});
