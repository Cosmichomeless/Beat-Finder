import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const CLIENT_ID = "0885d122e5914062ac1405c47be00206";
const REDIRECT_URI = "beatfinder://screens/main/recomendations";

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
)}&scope=ugc-image-upload%20user-read-private%20user-read-email%20playlist-read-private%20user-top-read%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public`;

export const authenticateWithSpotify = async (router) => {
    try {
        // Elimina el token anterior para forzar la re-autenticación y obtener un token con el scope actualizado
        await AsyncStorage.removeItem("spotify_access_token");

        const result = await WebBrowser.openAuthSessionAsync(
            authUrl,
            REDIRECT_URI
        );
        console.log("Resultado de autenticación:", result);

        if (result.type === "success") {
            console.log("URL de redirección recibida:", result.url);
            const urlParams = new URLSearchParams(result.url.split("?")[1]);
            const code = urlParams.get("code");
            console.log("Código obtenido:", code);

            if (code) {
                const response = await fetch(
                    "http://192.168.1.71:8080/api/auth/spotify/callback",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                    }
                );

                const data = await response.json();
                console.log("Respuesta del backend:", data);
                if (data.access_token) {
                    await AsyncStorage.setItem(
                        "spotify_access_token",
                        data.access_token
                    );
                    router.replace("/screens/main/recomendations");
                } else {
                    Alert.alert("Error", "No se recibió el token de acceso");
                }
            } else {
                Alert.alert(
                    "Error",
                    "No se obtuvo el código de autorización. Revisa la URL: " +
                        result.url
                );
            }
        } else {
            Alert.alert("Error", "Autenticación cancelada o fallida");
        }
    } catch (error) {
        console.error("Error en la autenticación con Spotify:", error);
        Alert.alert("Error", "Hubo un problema con la autenticación");
    }
};
