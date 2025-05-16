import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, getTopArtists } from "./userItems";

export const fetchAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem("spotify_access_token");
        if (token !== null) {
            return token;
        } else {
            console.log("No se encontró el token");
            return null;
        }
    } catch (error) {
        console.error("Error al recuperar el token:", error);
        return null;
    }
};

export const fetchData = async (
    accessToken,
    setProfile,
    setTopArtists,
    setLoading
) => {
    if (!accessToken) return;

    try {
        // 1. Obtener perfil del usuario
        const profile = await getUserProfile(accessToken);
        setProfile(profile);

        // 2. Obtener los artistas más escuchados desde el backend
        const topArtists = await getTopArtists(accessToken);
        setTopArtists(topArtists);
    } catch (error) {
        console.error(
            "Error fetching data:",
            error.response ? error.response.data : error.message
        );
        setLoading(false);
        Alert.alert("Error", "Hubo un problema al obtener los datos");
    }
};

