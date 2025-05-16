import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colors";
import ImageSelector from "../../../components/playlist/ImageSelector.jsx";
import PlaylistForm from "../../../components/playlist/PlaylistForm";
import BlackButton from "../../../components/BlackButton";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Localhost } from '../../../constants/localhost';
import { getSpotifyToken } from '../../../actions/playlistActions';
import { sendPlaylistCreatedMetricToBackend } from '../../../actions/backendActions';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const CreatePlaylist = () => {
    const params = useLocalSearchParams();
    const { userId } = params;
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gradientColors, setGradientColors] = useState(["#000000", "#1a1a1a"]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageSize, setImageSize] = useState(null);
    const [processingImage, setProcessingImage] = useState(false);

    // Función para convertir imagen a Base64
    const imageToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error("Error al convertir imagen a base64:", error);
            return null;
        }
    };

    // Función para seleccionar y procesar imagen
    const pickImage = async () => {
        console.log("Iniciando pickImage");
        try {
            console.log("Solicitando permisos...");
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log("Estado de permisos:", status);

            if (status !== "granted") {
                Alert.alert(
                    "Permiso denegado",
                    "Necesitamos permiso para acceder a tus fotos"
                );
                return;
            }

            console.log("Lanzando selector de imágenes...");
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            console.log(
                "Selector de imágenes completado:",
                result.canceled ? "Cancelado" : "Imagen seleccionada"
            );

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Activar indicador de procesamiento
                setProcessingImage(true);

                try {
                    const originalUri = result.assets[0].uri;
                    console.log("Verificando tamaño inicial de la imagen...");

                    // Obtener y mostrar el tamaño inicial
                    let fileInfo = await FileSystem.getInfoAsync(originalUri);
                    const originalSize = Math.round(fileInfo.size / 1024); 
                    console.log(`Tamaño original: ${originalSize} KB`);

                    // Si la imagen ya es pequeña, usarla directamente
                    if (fileInfo.size <= 256 * 1024) {
                        console.log(
                            "La imagen ya es suficientemente pequeña, se usará sin comprimir"
                        );
                        setSelectedImage(originalUri);
                        setImageSize(originalSize);
                        setProcessingImage(false);
                        return;
                    }

                    console.log(
                        "La imagen excede 256KB, iniciando compresión..."
                    );

                    let processedImage = await ImageManipulator.manipulateAsync(
                        originalUri,
                        [], 
                        {
                            compress: 0.5,
                            format: ImageManipulator.SaveFormat.JPEG,
                        }
                    );

                    fileInfo = await FileSystem.getInfoAsync(
                        processedImage.uri
                    );
                    console.log(
                        `Tamaño después de compresión inicial: ${Math.round(
                            fileInfo.size / 1024
                        )} KB`
                    );

                    if (fileInfo.size > 256 * 1024) {
                        console.log(
                            "Compresión inicial insuficiente, redimensionando..."
                        );

                        processedImage = await ImageManipulator.manipulateAsync(
                            originalUri,
                            [{ resize: { width: 600, height: 600 } }],
                            {
                                compress: 0.4,
                                format: ImageManipulator.SaveFormat.JPEG,
                            }
                        );

                        fileInfo = await FileSystem.getInfoAsync(
                            processedImage.uri
                        );
                        console.log(
                            `Tamaño después de redimensionar a 600x600: ${Math.round(
                                fileInfo.size / 1024
                            )} KB`
                        );
                    }

                    if (fileInfo.size > 256 * 1024) {
                        console.log(
                            "Aún demasiado grande, aplicando compresión máxima..."
                        );

                        processedImage = await ImageManipulator.manipulateAsync(
                            originalUri,
                            [{ resize: { width: 300, height: 300 } }],
                            {
                                compress: 0.3,
                                format: ImageManipulator.SaveFormat.JPEG,
                            }
                        );

                        fileInfo = await FileSystem.getInfoAsync(
                            processedImage.uri
                        );
                        console.log(
                            `Tamaño final después de redimensionar a 300x300: ${Math.round(
                                fileInfo.size / 1024
                            )} KB`
                        );

                        if (fileInfo.size > 256 * 1024) {
                            console.log(
                                "La imagen no pudo comprimirse lo suficiente"
                            );
                            Alert.alert(
                                "Imagen demasiado compleja",
                                "No fue posible comprimir la imagen por debajo de 256KB. Por favor selecciona otra imagen."
                            );
                            setProcessingImage(false);
                            return;
                        }
                    }

                    console.log("Compresión exitosa");
                    setSelectedImage(processedImage.uri);
                    setImageSize(Math.round(fileInfo.size / 1024));
                } catch (compressionError) {
                    console.error(
                        "Error durante la compresión:",
                        compressionError
                    );
                    Alert.alert(
                        "Error",
                        "No se pudo procesar la imagen. Inténtalo nuevamente."
                    );
                } finally {
                    setProcessingImage(false);
                }
            } else {
                console.log("No se seleccionó ninguna imagen o se canceló");
            }
        } catch (error) {
            console.error("Error en pickImage:", error);
            Alert.alert(
                "Error",
                "Error al abrir el selector de imágenes: " + error.message
            );
            setProcessingImage(false);
        }
    };

    // Función para eliminar la imagen
    const removeImage = () => {
        setSelectedImage(null);
        setImageSize(null);
    };

    const generateDarkRandomColor = () => {
        const r = Math.floor(Math.random() * 100);
        const g = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);

        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    };

    // Genera nuevos colores de gradiente
    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    // Generar gradiente al cargar el componente
    useEffect(() => {
        generateNewGradient();
    }, []);

    // Función para subir imagen a la playlist
    const uploadPlaylistImage = async (playlistId, accessToken, imageUri) => {
        try {
            const base64Image = await imageToBase64(imageUri);
            if (!base64Image) {
                throw new Error("No se pudo codificar la imagen");
            }

            const response = await fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/images`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "image/jpeg",
                    },
                    body: base64Image,
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error al subir imagen: ${errorData}`);
            }

            return true;
        } catch (error) {
            console.error("Error al subir imagen:", error);
            return false;
        }
    };

    const fetchCurrentUserId = async (accessToken) => {
        try {
            const response = await axios.get(
                `http://${Localhost}:8080/api/spotify/profile`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            return response.data.id;
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            throw new Error("No se pudo obtener la información del usuario");
        }
    };

    const handleCreatePlaylist = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre de la playlist es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const accessToken = await getSpotifyToken();
            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            const currentUserId =
                userId || (await fetchCurrentUserId(accessToken));
            if (!currentUserId) {
                throw new Error("No se pudo obtener el ID de usuario");
            }

            const playlistData = {
                name: name,
                description: description || "Playlist creada con Beat Finder",
                public: !isPrivate,
            };

            const response = await axios.post(
                `http://${Localhost}:8080/api/spotify/users/${currentUserId}/playlists`,
                playlistData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Obtener el ID de la playlist recién creada
            const playlistId = response.data.id;

            // Guardar el ID de la playlist en el almacenamiento local
            await AsyncStorage.setItem("createdPlaylistId", playlistId);

            // Si hay una imagen seleccionada, subirla
            let imageUploaded = false;
            if (selectedImage) {
                imageUploaded = await uploadPlaylistImage(
                    playlistId,
                    accessToken,
                    selectedImage
                );
            }

            // Guardar la playlist en la base de datos
            try {
                const timestamp = Date.now();

                // Obtener el nombre de usuario del dispositivo
                let username = "Usuario de Beat Finder";
                try {
                    const localUsername = await AsyncStorage.getItem("userEmail");
                    if (localUsername) {
                        username = localUsername;
                    } else {
                        const userProfileResponse = await axios.get(
                            `http://${Localhost}:8080/api/spotify/profile`,
                            {
                                headers: { Authorization: `Bearer ${accessToken}` },
                            }
                        );
                        username = userProfileResponse.data.display_name || "Usuario de Spotify";
                    }
                } catch (userError) {
                    console.error("Error al obtener nombre de usuario:", userError);
                }

                const playlistDBData = {
                    playlistId: playlistId,
                    playlistName: name,
                    description: description || "Playlist creada con Beat Finder",
                    username: username,
                    isNewPlaylist: true,
                    imageUploaded: imageUploaded,
                    isPrivate: isPrivate,
                    createdAt: timestamp,
                    updatedAt: timestamp
                };

                await axios.post(
                    `http://${Localhost}:8080/api/playlists`,
                    playlistDBData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Playlist guardada en la base de datos con username:", username);

            } catch (dbError) {
                console.error("Error al guardar en la base de datos:", dbError);
            }

            await sendPlaylistCreatedMetricToBackend();

            // Navegar a la pantalla de preferencias
            router.push({
                pathname: "./PlaylistPreferences",
                params: {
                    playlistId: playlistId,
                    playlistName: name,
                    isNewPlaylist: true,
                    imageUploaded: imageUploaded,
                    isPrivate: isPrivate,
                },
            });
        } catch (error) {
            console.error("Error al crear playlist:", error);
            setError(
                error.response?.data?.message ||
                "No se pudo crear la playlist. Intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >

                <View style={styles.formContainer}>
                    <ImageSelector
                        selectedImage={selectedImage}
                        imageSize={imageSize}
                        processingImage={processingImage}
                        onPickImage={pickImage}
                        onRemoveImage={removeImage}
                    />

                    <PlaylistForm
                        name={name}
                        setName={setName}
                        description={description}
                        setDescription={setDescription}
                        isPrivate={isPrivate}
                        setIsPrivate={setIsPrivate}
                        error={error}
                    />

                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <BlackButton
                            onPress={handleCreatePlaylist}
                            disabled={loading || processingImage}
                            text='Crear Playlist'
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size='small'
                                    color={Colors.black}
                                />
                            ) : (
                                <Text style={styles.createButtonText}>
                                    Crear Playlist
                                </Text>
                            )}
                        </BlackButton>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
        paddingHorizontal: 20
    },

    formContainer: {
        marginTop: 20,
    },
    createButtonText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default CreatePlaylist;