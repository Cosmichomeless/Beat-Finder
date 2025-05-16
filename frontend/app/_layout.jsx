import { Stack, Slot } from "expo-router";
import { Colors } from "../constants/colors";
import { Platform } from "react-native";

export default function Layout() {
    // Android, usar Slot que simplemente renderiza los hijos sin layout
    if (Platform.OS === 'android') {
        return <Slot />;
    }

    // iOS: usar el Stack Navigator con toda la configuración
    return (
        <Stack
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: Colors.black },
                headerTintColor: Colors.white,
                headerTitleStyle: { fontSize: 20 },
                contentStyle: { backgroundColor: Colors.black },
                headerBackTitleVisible: false,
                headerBackTitle: "",
                animation: "none",
                presentation: "card",

            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Inicio",
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="screens/Login/Login"
                options={{
                    title: "Iniciar Sesión",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/Login/Register"
                options={{
                    title: "Registrarse",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/SpotifyAuth"
                options={{
                    title: "Inicio de sesion",
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />

            <Stack.Screen
                name="screens/main"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />

            <Stack.Screen
                name="screens/account/Settings"
                options={{
                    title: "Configuración",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/account/Statistics"
                options={{
                    title: "Estadísticas",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/account/Trophies"
                options={{
                    title: "Tus Trofeos",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/recomendations/History"
                options={{
                    title: "Historial",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/playlist/PlaylistDetail"
                options={{
                    title: "Detalles de la lista",
                    headerBackTitleVisible: false,
                    headerShown: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/playlist/CreatePlaylist"
                options={{
                    title: "Crear Playlist",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/playlist/PlaylistPreferences"
                options={{
                    title: "Preferencias",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen
                name="screens/playlist/PlaylistRecomendations"
                options={{
                    title: "",
                    headerBackTitleVisible: false,
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="screens/playlist/PlaylistAddSongs"
                options={{
                    title: "Añadir canciones",
                    headerBackTitleVisible: false,
                    headerShown: true,
                    gestureEnabled: true,
                }}
            />
            <Stack.Screen
                name="screens/playlist/EditPlaylist"
                options={{
                    title: "Editar Playlist",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />
            <Stack.Screen
                name="screens/playlist/AddToPlaylist"
                options={{
                    title: "Añadir a Playlist",
                    headerBackTitleVisible: false,
                    gestureEnabled: true,
                }}
            />


            <Stack.Screen
                name="htmlview/index"
                options={{
                    title: "",
                    headerBackTitleVisible: false,
                    headerShown: true,
                }}
            />

        </Stack>


    );
}